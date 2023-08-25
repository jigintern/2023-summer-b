function canvasToBase64() {
    return document.getElementById('canvas-wrap').firstElementChild.toDataURL("image/png", 0.5);
}

const submit_btn = document.getElementById("submit-btn");

//新規投稿
document
.getElementById("submitpost")
.addEventListener("submit", async (event) => {
    event.stopPropagation();
    event.preventDefault();
    submit_btn.disabled = true;

    const did = localStorage.getItem("did");
    let title = document.getElementById("title").value;
    if (title.length <= 0){title = "no title";}
    const imgpath = canvasToBase64();
    const text_contents = document.getElementById("text-contents").value;
    const post_time = Date.now();

    // サーバーに送信
    const path = "/submitpost";
    const method = "POST";

    try {
        const resp = await fetch(path, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                did,
                title,
                imgpath,
                text_contents,
                post_time,
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

    return;
});
