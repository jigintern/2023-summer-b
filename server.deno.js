import { serveDir } from "https://deno.land/std@0.180.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { DIDAuth } from 'https://jigintern.github.io/did-login/auth/DIDAuth.js';
import { addDID, checkIfIdExists, getUser, addPost, getPost, delPost, fixPost, isPostExists, getPosts_index, searchPosts_name, changeprf, getPosts_userid, postusername_byid, getUser_id, getPosts_limit } from './db-controller.js';


serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "GET" && pathname === "/selectall") {
    const result = await getPosts_index();
    return new Response(await JSON.stringify(result.rows));
  }

  if (req.method === "POST" && pathname === "/authdid") {
    const json = await req.json();
    const did = json.did;
    const isExists = await checkIfIdExists(did);
    return new Response(await JSON.stringify(isExists));
  }

  if (req.method === "POST" && pathname === "/getprf_did") {
    const json = await req.json();
    const did = json.did;
    const result = await getUser(did);
    return new Response(await JSON.stringify(result.rows));
  }


  if (req.method === "POST" && pathname === "/getprf_id") {
    const json = await req.json();
    const id = json.id;
    const result = await getUser_id(id);
    return new Response(await JSON.stringify(result.rows));
  }

  if (req.method === "POST" && pathname === "/newuser") {
    const json = await req.json();
    const userName = json.name;
    const sign = json.sign;
    const did = json.did;
    const message = json.message;

    // 電子署名が正しいかチェック
    try {
      const chk = DIDAuth.verifySign(did, sign, message);
      if (!chk) {
        return new Response("不正な電子署名です", { status: 400 });
      }
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }

    // 既にDBにDIDが登録されているかチェック
    try {
      const isExists = await checkIfIdExists(did);
      if (isExists) {
        return Response("登録済みです", { status: 400 });
      }
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }

    // DBにDIDとuserNameを保存
    try {
      await addDID(did, userName);
      return new Response("ok");
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }

  if (req.method === "POST" && pathname === "/login") {
    const json = await req.json();
    const sign = json.sign;
    const did = json.did;
    const message = json.message;
  
    // 電子署名が正しいかチェック
    try {
      const chk = DIDAuth.verifySign(did, sign, message);
      if (!chk) {
        return new Response("不正な電子署名です", { status: 400 });
      }
    } catch (e) {
      return new Response(e.message, { status: 400 });
    }
  
    // DBにdidが登録されているかチェック
    try {
      const isExists = await checkIfIdExists(did);
      if (!isExists) {
        return new Response("登録されていません", { status: 400 });
      }
      // 登録済みであればuser情報を返す
      const res = await getUser(did);
      const user = { did: res.rows[0].did, name: res.rows[0].user_name };
      return new Response(JSON.stringify({ user }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }

  //Posts
  if (req.method === "POST" && pathname === "/submitpost") {
    const json = await req.json();
    const posts_user_id = await getUser(json.did);
    const title = json.title;
    const imgpath = json.imgpath;
    const text_contents = json.text_contents;
    const post_date = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    await addPost(
      posts_user_id.rows[0].id,
      title,
      imgpath,
      text_contents,
      post_date
    );
    console.log("new post",post_date);
    return new Response("add post ok");
  }

  if (req.method === "POST" && pathname === "/delpost") {
    const json = await req.json();
    const id = json.id;
    const did = json.did;
    
    // DBに投稿があるかチェック
    try {
      const isExists = await isPostExists(id);
      if (!isExists) {
        return new Response("投稿がありません", { status: 400 });
      }
      
      // あればpostを削除
      const post_user_id = (await getPost(id)).post_user_id;
      const user_id = (await getUser(did)).rows[0].id;
      if (post_user_id !== user_id) {
        return new Response("Mismatch User", { status : 500});
      }

      await delPost(id);
      console.log("del post", id);
      return new Response("del post ok")
      } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }

  if (req.method === "GET" && pathname === "/getpost") {
    const id = new URL(req.url).searchParams.get("id");
    // DBに投稿があるかチェック
    try {
      const isExists = await isPostExists(id);
      if (!isExists) {
        return new Response("投稿がありません", { status: 400 });
      }
      // あればpostを返す
      const res = await getPost(id);
      return new Response(JSON.stringify( res ), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }

  if (req.method === "POST" && pathname === "/fixpost") {
    const json = await req.json();
    const did = json.did;
    const id = json.id;
    const post_user_id = (await getPost(id)).post_user_id;
    const user_id = (await getUser(did)).rows[0].id;
    if (post_user_id !== user_id) {
      return new Response("Mismatch User", { status : 500});
    }
    
    const title = json.title;
    const text_contents = json.text_contents;
    await fixPost(
      id,
      title,
      text_contents,
    );
    return new Response("fix post ok");
  }

  if (req.method === "POST" && pathname === "/changeprf"){
    const json = await req.json();
    const did = json.did;
    const name = json.name;
    const intro = json.intro;
    try{
      await changeprf(did, name, intro);
      return new Response("ok");
    }
    catch(e){
      console.log(e);
      return new Response(e);
    }
  }

  if (req.method === "GET" && pathname === "/search") {
    const currentURL = req.url;
    const URLParams = new URLSearchParams(currentURL.split("?")[1]);
    var search_value = "";
    search_value = URLParams.get("search_value");
    const res = await searchPosts_name(search_value);
    return new Response(await JSON.stringify(res.rows));
  }

  if (req.method === "POST" && pathname === "/prfposts") {
    const json = await req.json();
    const id = json.id;
    const res = await getPosts_userid(id);
    return new Response(await JSON.stringify(res.rows));
  }

  //投稿主とdidが一致するか
  if (req.method === "POST" && pathname === "/checkPostUser") {
    const json = await req.json();
    const did = json.did;
    const id = json.id;
    const post_user_id = (await getPost(id)).post_user_id;
    const user_id = (await getUser(did)).rows[0].id;
    return new Response(await JSON.stringify({result: post_user_id === user_id}));
  }

  if (req.method === "POST" && pathname === "/postusername_byid") {
    const json = await req.json();
    const user_id = json.post_user_id;
    const user_name = await postusername_byid(user_id);
    return new Response(await JSON.stringify(user_name.rows));
  }

  if (req.method === "POST" && pathname === "/getposts_limit") {
    const json = await req.json();
    const page_number = json.page_number;
    const res = await getPosts_limit(page_number);
    return new Response(await JSON.stringify(res.rows));
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});

