# template-deno-dev

[Deno](https://deno.land/)を使った開発のテンプレートです。\
[Deno Deploy](https://deno.com/deploy)を利用して外部へ公開することを想定しています。

## Deno Deploy の利用方法

↓以上の詳細は公式リファレンスへ。

1. [Deno Deploy](https://deno.com/deploy)にアクセスして、右上の「Sign
   In」からGitHubアカウントでのOAuthログインでアカウントを作成orログインしてください。
2. 青い「+ New Project」から「Create a project」画面に遷移して、「Deploy an
   existing GitHub repository」側から GitHub repository の「Select a
   repository」をクリック
3. Create a project from GitHub
   の画面で、デプロイするリポジトリを選んでこのリポジトリをテンプレートにした場合は「No
   build
   step」で、メインのDenoのコードが書いてあるファイルをエントリポイントに指定して「Create
   & Deploy」します。
4. ダイアログが出て Deployed
   になれば成功。右上の青い「View」からデプロイされたページが確認できるはずです。

## API構成

GET: /selectall postsテーブルからすべてのレコードを取ってくる。

POST: /authdid didをjson形式でPOST。 DBにDIDが存在すればtrueを返す。

POST: /newuser name,sign,did,messageをjson形式でPOST。
電子署名が正しいかチェックする。 同じdidが存在しないかチェックする。
上二つが確認出来たらDBにその名前とdidを追加する。

POST: /login did,sign,messageをbodyとしてjson形式でPOST。
電子署名が正しいかチェックする。 DBにdidが登録されているかチェックする。
登録されていればDBからid、user_name、didを返す。
