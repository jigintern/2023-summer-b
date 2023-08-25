## API構成

GET: /selectall postsテーブルからすべてのidを取ってくる。

POST: /authdid didをjson形式でPOST。 DBにDIDが存在すればtrueを返す。

POST: /getprf_did usersからdidが一致するレコードをとってくる。

POST: /getprf_id usersからidが一致するレコードをとってくる。

POST: /newuser name,sign,did,messageをjson形式でPOST。
電子署名が正しいかチェックする。 同じdidが存在しないかチェックする。
上二つが確認出来たらDBにその名前とdidを追加する。

POST: /login did,sign,messageをbodyとしてjson形式でPOST。
電子署名が正しいかチェックする。 DBにdidが登録されているかチェックする。
登録されていればDBからid、user_name、didを返す。

POST: /submitpost
did、title、imgpath、text_contentsをjson形式でPOST。didからuserのidをgetUser関数を使って求め、postsテーブルに投稿する。

POST: /delpost
作品のid、didをjsonでPOST。idと一致する作品があり、その投稿者のdidが一致すればその作品を削除する。成功した場合「del
post ok」を返す。

GET: /getpost
ユーザーのidをクエリパラメータに載せてGET。そのidによる投稿があれば作品すべてのレコードを返す。作品がなかった場合、「投稿がありません」と返す。

POST: /fixpost
did、作品のid、title、text_contentsをjsonでPOST。idと一致する作品があり、その投稿者のdidが一致すれば作品のtitleとtext_contentsを更新する。

GET: /search
search_valueをクエリパラメータに載せてGET。その文字列をtitleに含む作品のレコードを返す。

POST: /prfposts user_idからその作品のレコードを返す。

POST: /checkPostUser
did、作品のidをjsonでPOST。didのユーザーと作品の投稿者が同じならtrueを返す。

POST: /postusername_byid
post_user_idをjsonでPOST。そのuser_idと一致するidを持つユーザーの名前を返す。

POST: /getposts_limit page_numberをjsonでPOST。新しい順で(page_number -
1)×20個めの投稿 ～
page_number×20個めの投稿までのpostsのレコードを返す。(ex:page_numberが1なら最新の投稿から20番目に新しい投稿までをとってくる)
