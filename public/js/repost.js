function canvasToBase64() {
    return document.getElementById('canvas').toDataURL("image/png", 0.5);
}

const submit_btn = document.getElementById("submit-btn");

//新規投稿
document
.getElementById("submitpsot")
.addEventListener("submit", async (event) => {
    event.preventDefault();
    submit_btn.disabled = true;

    const did = localStorage.getItem("did");
    let title = document.getElementById("title").value;
    if (title.length <= 0){title = "no title";}
    const imgpath = canvasToBase64();
    const text_contents = document.getElementById("text-contents").value;

    // サーバーに送信
    const path = "/submitpost";
    const method = "POST";

    try {
        const resp = await fetch(path, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                did,
                id,
                title,
                imgpath,
                text_contents,
            }),
        });

        // サーバーから成功ステータスが返ってこないときの処理
        if (!resp.ok) {
            const errMsg = await resp.text();
            document.getElementById("error").innerText = "エラー：" + errMsg;
            submit_btn.disabled = false;
            return;
        }

        // レスポンスが正常のときの処理
        console.log("投稿できました");
        //ホームに戻る
        window.location.href = "./index.html";

    } catch (err) {
        document.getElementById("error").innerText = err.message;
    }
});

//投稿取得
document.getElementById("getpost").addEventListener("submit", async (event)=>{
    event.preventDefault();
    const post_id = document.getElementById("re-post-id").value;
    
    // サーバーに送信
    try {
        const resp = await fetch("/getpost?id=" + post_id);
        
        // サーバーから成功ステータスが返ってこないときの処理
        if (!resp.ok) {
            const errMsg = await resp.text();
            document.getElementById("error").innerText = "エラー：" + errMsg;
            return;
        }

        //結果を編集欄に反映
        const json = await resp.json();
        document.getElementById("re-title").value = json.title;
        document.getElementById("re-text-contents").value = json.text_contents;

        //絵を表示
        document.getElementById("posted-img").src = "data:image/png;" + json.imgpath;

    } catch (err) {
        document.getElementById("error").innerText = err.message;
    }
});

//再投稿
//title, text-contentsを更新
//ひとまず時間の変更は無し
document.getElementById("fixpost").addEventListener("submit", async (event)=>{
    event.preventDefault();
    submit_btn.disabled = true;
    const did = localStorage.getItem("did");
    const id = document.getElementById("re-post-id").value;
    const title = document.getElementById("re-title").value + "[再投稿]";
    const text_contents = document.getElementById("re-text-contents").value;
    
    // サーバーに送信
    const path = "/fixpost";
    const method = "POST";

    try {
        const resp = await fetch(path, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                did,
                id,
                title,
                text_contents,
            }),
        });

        // サーバーから成功ステータスが返ってこないときの処理
        if (!resp.ok) {
            const errMsg = await resp.text();
            document.getElementById("error").innerText = "エラー：" + errMsg;
            submit_btn.disabled = false;
            return;
        }

        // レスポンスが正常のときの処理
        console.log("編集できました");

    } catch (err) {
        document.getElementById("error").innerText = err.message;
    }
});
