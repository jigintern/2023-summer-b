import { serveDir } from "https://deno.land/std@0.180.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { DIDAuth } from 'https://jigintern.github.io/did-login/auth/DIDAuth.js';
import { addDID, checkIfIdExists, getUser, addPost, getPost, delPost, fixPost, isPostExists, getPosts_index, searchPosts_name, changeprf, getPosts_userid, postusername_byid, getUser_id, getPosts_limit } from './db-controller.js';
import { Md5 } from "https://deno.land/std@0.119.0/hash/md5.ts";

serve(async (req) => {
  const url = new URL(req.url)
  const pathname = url.pathname;
  //console.log(pathname);

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
    const post_date = new Date(Date.now() + ((new Date().getTimezoneOffset() + (0 * 60)) * 60 * 1000));
    //const post_date = new Date(json.post_time);
    //const post_date = new Date();
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

  //join room
  //web soket
  if (req.method === "GET" && pathname === "/start_web_socket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const username = url.searchParams.get("username");
    const roomid = url.searchParams.get("room");
    const did = url.searchParams.get("did");
    console.log(rooms);

    //部屋がない
    if(!rooms.has(roomid)){
      setTimeout(()=>{socket.close(1008, `no room`);}, 500);
      return response;
    }

    const room = rooms.get(roomid);
    
    //user被りをはじく
    /*
    if (room.connectedClients.has(username)) {
      setTimeout(()=>{socket.close(1008, `Username ${username} is already taken`);}, 500);
      return response;
    }*/

    //user追加
    const isOwner = did === room.ownerdid;
    socket.isOwner = isOwner;
    socket.username = username;
    room.connectedClients.set(username, socket);

    //socket listener================================
    socket.onopen = () => {
      room.sendStates(socket);
      room.broadcast_usernames();
      if(isOwner){
        socket.send(JSON.stringify({event: "isOwner"}));
      }
    };
    socket.onmessage = (e) => {
      const json = JSON.parse(e.data)
      console.log('socket event:', json.event);
      if (json.event === "push-line"){
        if(json.line){
          room.pushline(json.line);
          room.broadcast_lines();
        }
      }else if(json.event === "change-text" && isOwner){
        room.changeText(json.title, json.text_contents);
        room.broadcast_text();
      }else if(json.event === "end" && isOwner){
        console.log("end room")
        closeRoom(roomid);
      }
    };
    socket.onerror = (e) => {
      console.log('socket errored:', e)
    };
    socket.onclose = () => {
      room.connectedClients.delete(socket.username);

      //auto del room
      if(room.connectedClients.size === 0){
        closeRoom(roomid);
      }

      room.broadcast_usernames();
    };

    return response;
  }

  //roomを作成
  if (req.method === "POST" && pathname === "/createroom") {
    const json = await req.json();
    const did = json.did;

    //check
    const roomid = new Md5().update(did).toString();
    console.log(roomid);
    //部屋が多い
    if (rooms.length > 20) {
      return new Response("部屋を作れません", { status: 400 });
    }

    //既に部屋を立てている
    if (rooms.has(roomid)){
      return new Response(JSON.stringify({roomid}));
    }
    const room = createNewRoom(roomid, did);

    return new Response(JSON.stringify({roomid}));
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



//web socket & draw -------------------
const rooms = new Map();

function createNewRoom(id, ownerdid){
  const room = new Room(ownerdid);
  rooms.set(id,room);
  return room;
}
function closeRoom(roomid){
  const room = rooms.get(roomid);
  if(room){
    console.log("room close",room);
    room.close();
    rooms.delete(roomid);
  }
}

class Room {
  constructor(ownerdid){
    this.connectedClients = new Map();
    this.ownerdid = ownerdid;

    this.lines = [];
    this.BGcolor = "#ffffff";
    this.title = "";
    this.text_contents = "";

    //timer ==============================
    this.started = false;
    this.timeover = false;
    this.totalSeconds;
    this.interval; 
  }

  pushline(l){
    if(this.started === false) {
      this.startCountdown(5);
      this.started = true;
    }

    if(l.type === "rect"){
      this.BGcolor = l.color;
      this.broadcast_BGcolor();
    }
    this.lines.push(l);
    if(this.lines.length > 100){
      this.lines.slice(1,1);
    }
  }

  changeText(title, text_contents) {
    this.title = title;
    this.text_contents = text_contents;
  }

  //broadcast============================
  broadcast(message) {
    for (const client of this.connectedClients.values()) {
      console.log(client);
      if(client.readyState !== 1){
        return;
      }
      client.send(message);
    }
  }
  
  //名前を更新
  broadcast_usernames() {
    const usernames = [...this.connectedClients.keys()];
    this.broadcast(
      JSON.stringify({
        event: "update-users",
        usernames: usernames,
      }),
    );
  }

  //linesを更新
  broadcast_lines() {
    this.broadcast(
      JSON.stringify({
        event: "update-lines",
        lines: this.lines,
      })
    );
  }

  //背景色を更新
  broadcast_BGcolor() {
    this.broadcast(
      JSON.stringify({
        event: "update-BGcolor",
        color: this.BGcolor,
      })
    );
  }

  //テキストを更新
  broadcast_text() {
    this.broadcast(
      JSON.stringify({
        event: "update-text",
        title: this.title,
        text_contents: this.text_contents,
      })
    );
  }

  //新規参加者に状態を送信
  sendStates(socket) {
    socket.send(
      JSON.stringify({
        event: "update-states",
        lines: this.lines,
        BGcolor: this.BGcolor,
        title: this.title,
        text_contents: this.text_contents,
      })
    );
  }

  //timer
  broadcast_time(time_text) {
    this.broadcast(
      JSON.stringify({
        event: "update-time",
        timeover: this.timeover,
        time_text: time_text,
      })
    );
  }

  close() {
    for (const client of this.connectedClients.values()) {
      /*if(client.isOwner) {
        client.send(
          JSON.stringify({
            event: "room-end",
          })
        );
      } else {
        client.close();
      }*/
      client.close();
    }
  }



  //timer ==============================
  startCountdown(seconds) {
      this.started = true;
      this.totalSeconds = seconds * 60;
      this.interval = setInterval(()=>{this.updateCountdown();}, 1000);
  }

  updateCountdown() {
      if (this.totalSeconds <= 0) {
        this.stopCountdown();
          return;
      }

      const minutes = Math.floor(this.totalSeconds / 60);
      const seconds = this.totalSeconds % 60;

      const formattedTime = this.pad(minutes) + ":" + this.pad(seconds);
      this.broadcast_time(formattedTime);

      this.totalSeconds--;
  }

  pad(num) {
      return (num < 10) ? "0" + num : num;
  }

  stopCountdown() {
    this.timeover = true;
    clearInterval(this.interval);
    this.broadcast_time("00:00");

  }


}
