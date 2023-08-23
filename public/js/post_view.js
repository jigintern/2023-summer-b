const post_edit_btn_area = document.getElementById("post_edit_btn_area");

window.onload = async (event) => {
    event.preventDefault();
    localStorage.setItem("previous_screen", window.location.href);
    
    const currentURL = window.location.href;
    const URLParams = new URLSearchParams(currentURL.split("?")[1]);
    var id = "";
    id = URLParams.get("id");
    const fetchURL = "/getpost?id=" + id;
    const res = await fetch(fetchURL);
    res.text().then((data) => {
        const result = JSON.parse(data);
        const targetDiv = document.querySelector('.image_area');
        const textElement = document.createElement('div');
        textElement.textContent = "タイトル：" + result.title;
        textElement.classList.add('title');
        const imagediv = document.createElement('div');
        var imageElement = document.createElement('img');
        imageElement.src = "data:image/png;" + result.imgpath;
        imageElement.alt = result.title; // オプション：画像が読み込めない場合の代替テキスト
        imageElement.style.width = "70vw"; // オプション：画像の幅
        imageElement.style.height = "auto"; // オプション：画像の高さ
        imagediv.appendChild(imageElement);
        textElement.appendChild(imagediv);
        targetDiv.appendChild(textElement);
        document.getElementById("text_contents").innerText += result.text_contents;
    })
}