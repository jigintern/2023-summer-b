function canvasToBase64() {
    return document.getElementById('canvas').toDataURL("image/png", 0.5);
}

const submit_btn = document.getElementById("submit-btn");
let post_id = null;

//投稿取得
window.addEventListener("load", async (event)=>{
    event.preventDefault();
    // URLParamsを取得
    const url = new URL(window.location.href);
    post_id = url.searchParams.get("id");
    if(!post_id){
        console.error('no id in URL');
        return;
    }
    
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
        document.getElementById("title").value = json.title;
        document.getElementById("text-contents").value = json.text_contents;

        //絵を表示
        document.getElementById("posted-img").src = "data:image/png;" + json.imgpath;

    } catch (err) {
        document.getElementById("error").innerText = err.message;
    }
});

//再投稿
//title, text-contentsを更新
document.getElementById("fixpost").addEventListener("submit", async (event)=>{
    event.preventDefault();
    submit_btn.disabled = true;
    const did = localStorage.getItem("did");
    const id = post_id
    const title = document.getElementById("title").value + "[再投稿]";
    const text_contents = document.getElementById("text-contents").value;
    
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
        window.location.href = "./post_view?id=" + post_id;

    } catch (err) {
        document.getElementById("error").innerText = err.message;
    }
});
