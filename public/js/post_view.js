//show the post
window.addEventListener("load", async (event) => {
    event.preventDefault();
    localStorage.setItem("previous_screen", window.location.href);

    //post id from URL param
    const url = new URL(window.location.href);
    const post_id = url.searchParams.get("id");
    
    //get post
    const fetchURL = "/getpost?id=" + post_id;
    const res = await fetch(fetchURL);
    const result = await res.json();
    const post_user_id = result.post_user_id;
    const user_name_res = await fetch("/postusername_byid", {
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            post_user_id
        }),
    });
    const user_name = await user_name_res.json();
    const post_date = new Date(result.post_date);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'};
    const post_date_fmt = post_date.toLocaleString('ja-JP', options);
    const targetDiv = document.querySelector('.image_area');
    const textElement = document.createElement('div');
    textElement.textContent = "タイトル：" + result.title;
    textElement.classList.add('title');
    const imagediv = document.createElement('div');
    const imageElement = document.createElement('img');
    imageElement.src = "data:image/png;" + result.imgpath;
    imageElement.alt = result.title; // オプション：画像が読み込めない場合の代替テキスト
    imageElement.classList.add('post-img');
    const postuserdiv = document.querySelector('.post_user');
    const linkElement = document.createElement('a');
    linkElement.textContent = user_name[0].user_name;
    linkElement.href = "./prf.html?id=" + result.post_user_id;
    
    //add HTML
    imagediv.appendChild(imageElement);
    textElement.appendChild(imagediv);
    targetDiv.appendChild(imagediv);
    postuserdiv.innerText = "作者："
    postuserdiv.appendChild(linkElement);
    document.getElementById("title").innerText = "タイトル：" + result.title;
    document.getElementById("post_date").innerText = "投稿日：" + post_date_fmt;
    document.getElementById("text_contents").innerText = "日記：\n" + result.text_contents;
    
});


//add edit btn
window.addEventListener("load", async (e)=>{
    //user 判定
    const did = localStorage.getItem("did");
    const url = new URL(window.location.href);
    const post_id = url.searchParams.get("id");

    const resp = await fetch("/checkPostUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            did,
            id : post_id,
        }),
    });
    const result = (await resp.json()).result;
    //console.log(result)
    if(result) {
        add_btns();
    }
    

});

function add_btns() {
    const btn_area = document.getElementById("post_edit_btn_area");
    const repost_btn = createBtn("編集");
    const delpost_btn = createBtn("削除");

    const url = new URL(window.location.href);
    const post_id = url.searchParams.get("id");

    //add listener
    repost_btn.onclick = (e)=> {
        e.preventDefault();
        window.location.href = "/repost.html?id=" + post_id;
        return;
    }
    delpost_btn.onclick = async (e)=> {
        e.preventDefault;
        const ans = confirm("削除してよろしいですか？");
        if (ans) {
            const did = localStorage.getItem("did");
            await delPost(post_id,did);
        }
    }

    //add html
    btn_area.appendChild(repost_btn);
    btn_area.appendChild(delpost_btn);
}

function createBtn(txt) {
    const elm = document.createElement("button");
    elm.classList.add("btn");
    elm.innerText = txt;
    return elm;
}


//投稿削除
async function delPost(post_id,did) {
    // サーバーに送信
    const path = "/delpost";
    const method = "POST";

    try {
        const resp = await fetch(path, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                did,
                id : post_id,
            }),
        });

        // サーバーから成功ステータスが返ってこないときの処理
        if (!resp.ok) {
            const errMsg = await resp.text();
            document.getElementById("error").innerText = "エラー：" + errMsg;
            return;
        }

        // レスポンスが正常のときの処理
        console.log("削除できました")
        window.location.href = "/index.html";


    } catch (err) {
        document.getElementById("error").innerText = err.message;
    }
}