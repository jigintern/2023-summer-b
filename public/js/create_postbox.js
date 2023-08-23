function create_postbox(array) {
    console.log(array.imgpath)
    if (array.imgpath === "null") {
      const postsDiv = document.querySelector('.posts');
      const textElement = document.createElement('div');
      textElement.textContent = array.title;
      textElement.classList.add('post_box');
      const linkElement = document.createElement('a');
      linkElement.href = "./post_view.html?id=" + array.id;
      linkElement.appendChild(textElement);
      postsDiv.appendChild(linkElement);
    }
    else {
      const postsDiv = document.querySelector('.posts');
      const textElement = document.createElement('div');
      textElement.textContent = array.title;
      textElement.classList.add('post_box');
      const imagediv = document.createElement('div');
      var imageElement = document.createElement('img');
      imageElement.src = "data:image/png;" + array.imgpath;
      imageElement.alt = array.title; // オプション：画像が読み込めない場合の代替テキスト
      imageElement.width = 300; // オプション：画像の幅
      imageElement.height = 200; // オプション：画像の高さ
      imageElement.classList.add('post-img');
      const linkElement = document.createElement('a');
      linkElement.href = "./post_view.html?id=" + array.id;
      imagediv.appendChild(imageElement);
      textElement.appendChild(imagediv);
      linkElement.appendChild(textElement);
      postsDiv.appendChild(linkElement);
    }
  };