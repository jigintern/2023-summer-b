import { serveDir } from "https://deno.land/std@0.180.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { DIDAuth } from 'https://jigintern.github.io/did-login/auth/DIDAuth.js';
import { addDID, checkIfIdExists, getUser, addPost, getPost, delPost, fixPost } from './db-controller.js';

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

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
    const posts_user_id = json.posts_user_id;
    const title = json.title;
    const imgpath = json.imgpath;
    const text_contents = json.text_contents;
    const post_date = new Date();
    await addPost(
      posts_user_id,
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
    const post_id = json.id;
    await delPost(post_id);
    console.log("del post", post_id);
    return new Response("del post ok")
  }

  if (req.method === "GET" && pathname === "/getpost") {
    const id = new URL(req.url).searchParams.get("id");
    const post = await getPost(id);
    return new Response(JSON.stringify(post), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST" && pathname === "/fixpost") {
    const json = await req.json();
    const id = json.id;
    const title = json.title;
    const text_contents = json.text_contents;
    await fixPost(
      id,
      title,
      text_contents,
    );
    return new Response("fix post ok");
  }


  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});

