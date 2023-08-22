function canvasToBase64() {
    return document.getElementById('canvas').toDataURL("image/png", 0.5);
}


//新規投稿
document
.getElementById("submitpsot")
.addEventListener("submit", async (event) => {
    event.preventDefault();
    const did = localStorage.getItem("did");
    const title = document.getElementById("title").value;
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
                title,
                imgpath,
                text_contents,
            }),
        });

        // サーバーから成功ステータスが返ってこないときの処理
        if (!resp.ok) {
            const errMsg = await resp.text();
            document.getElementById("error").innerText = "エラー：" + errMsg;
            return;
        }

        // レスポンスが正常のときの処理
        console.log("投稿できました")

    } catch (err) {
        document.getElementById("error").innerText = err.message;
    }
});
