import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import "https://deno.land/std@0.192.0/dotenv/load.ts";

// SQLの設定
const connectionParam = {
  hostname: Deno.env.get("HOST_NAME"),
  username: Deno.env.get("SQL_USER"),
  password: Deno.env.get("SQL_PASSWORD"),
  db: Deno.env.get("DATABASE"),
  port: Number(Deno.env.get("PORT")),
};

// クライアントの作成
const client = await new Client().connect(connectionParam);

export async function checkIfIdExists(did) {
  // DBにDIDがあるか
  const res = await client.execute(
    `select count(*) from users where did = ?;`,
    [did]
  );
  // レスポンスのObjectから任意のDIDと保存されているDIDが一致している数を取得し
  // その数が1かどうかを返す
  // DBにはDIDが重複されない設計になっているので一致している数は0か1になる
  return res.rows[0][res.fields[0].name] === 1;
}

export async function addDID(did, userName) {
  // DBにDIDとuserNameを追加
  await client.execute(`insert into users (user_name, did) values (?, ?);`, [
    userName,
    did,
  ]);
}

export async function getUser(did) {
  // DBからsignatureが一致するレコードを取得
  const res = await client.execute(`select * from users where did = ?;`, [did]);
  return res;
}

export async function addPost(post_user_id, title, imgpath, text_contents, post_date){
  //　DBに投稿を追加
  await client.execute(`insert into posts (post_user_id, title, imgpath, text_contents, post_date) values (?, ?, ?, ?, ?);`, [
    post_user_id,
    title,
    imgpath,
    text_contents,
    post_date,
  ]);
}

export async function isPostExists(id) {
  // DBからIDで投稿を取得
  const res = await client.execute(`select count(*) from posts where id = ?;`, [id]);
  return res.rows[0][res.fields[0].name] === 1;
}

export async function getPost(id) {
  // DBからIDで投稿を取得

  const res = await client.query(`select * from posts where id = ?;`, [id]);
  return res[0];
}

export async function delPost(id) {
  // DBから投稿を削除
  await client.execute(`delete from posts where id = ?;`, [id]);
}

export async function fixPost(id, title, text_contents) {
  // DBの投稿を更新
  await client.execute(`update posts set title = ?, text_contents = ? where id = ?;`, [title, text_contents, id]);
}

export async function getPosts_index() {
  const res = await client.execute(`select id from posts ORDER BY post_date DESC;`);
  return res;
}

export async function searchPosts_name(search_value) {
  const res = await client.execute(`SELECT * FROM posts WHERE title LIKE ?;`, [`%${search_value}%`]);
  return res;
}

export async function changeprf(did, name, intro) {
  const id = await client.execute('SELECT id FROM users WHERE did = ?', [did]);
  await client.execute('UPDATE users SET user_name = ?, self_intro = ? WHERE id = ?', [name, intro, id.rows[0].id]);
}

export async function getPosts_userid(user_id) {
  const res = await client.execute(`select * from posts WHERE post_user_id = ? ORDER BY post_date DESC;`, [user_id]);
  return res;
}

export async function postusername_byid(user_id) {
  const res = await client.execute('select user_name from users WHERE id = ?;', [user_id]);
  return res;
}

export async function getUser_id(id) {
  const res = await client.execute('select * from users where id = ?', [id]);
  return res;
}

export async function getPosts_limit(page_number) {
  const limit = (page_number - 1) * 20
  const res = await client.execute('SELECT * FROM posts ORDER BY post_date DESC LIMIT ?, 20;', [limit]);
  return res;
}