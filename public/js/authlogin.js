async function authlogin(event){
    event.preventDefault();
    var did = "";
    did = localStorage.getItem("did");
    if (did === null) {
        const targetDiv = document.querySelector('.login');
        const linkElement = document.createElement("a");
        linkElement.href = "./login.html";
        linkElement.classList.add("header-button-link");
        const buttonElement = document.createElement("button");
        buttonElement.textContent = "Login";
        linkElement.appendChild(buttonElement);
        targetDiv.appendChild(linkElement);
    }
    else {
        const targetDiv = document.querySelector('.login');
        const linkElement = document.createElement("a");
        linkElement.href = "./prf.html";
        linkElement.classList.add("header-button-link");
        const buttonElement = document.createElement("button");
        buttonElement.textContent = localStorage.getItem("name");
        linkElement.appendChild(buttonElement);
        targetDiv.appendChild(linkElement);
    }
}

window.addEventListener("load", (e)=>{
    authlogin(e);
});
