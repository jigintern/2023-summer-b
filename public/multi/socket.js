
window.addEventListener("load", (e)=>{
    connectSocket();
});

let socket;
async function connectSocket(){
    const myUsername = localStorage.getItem("name");
    const did = localStorage.getItem("did");
    const url = new URL(window.location.href);
    const roomid =url.searchParams.get("roomid");
    socket = new WebSocket(
        `ws://localhost:8000/start_web_socket?username=${myUsername}&room=${roomid}&did=${did}`,
    );
    socket.onmessage = (m) => {
        const data = JSON.parse(m.data);
        console.log(data);
    
        if (data.event === "update-users") {
            // refresh displayed user list
            let userListHtml = "";
            for (const username of data.usernames) {
            userListHtml += `<div> ${username} </div>`;
            }
            document.getElementById("users").innerHTML = userListHtml;
            return;
        }
        
        if (data.event === "update-lines"){
            lines = data.lines;
            return;
        }

        if (data.event === "update-BGcolor"){
            tool.setBackgroundColor(data.BGcolor);
            return;
        }

        if (data.event === "update-text") {
            document.getElementById("title").value = data.title;
            document.getElementById("text-contents").value = data.text_contents;
            return;
        }

        if (data.event === "update-states") {       
            lines = data.lines;
            tool.setBackgroundColor(data.BGcolor);
            document.getElementById("title").value = data.title;
            document.getElementById("text-contents").value = data.text_contents;
            return;
        }

        if (data.event === "room-end") {
            console.log("room end");
            return;
        }

        if(data.event === "isOwner"){
            //タイトルと本文解放
            document.getElementById("title").disabled = false;
            document.getElementById("text-contents").disabled = false;

            //ルームを閉じるボタン
            document.getElementById("roomclose").disabled = false;
            document.getElementById("roomclose").onclick = ()=>{
                socket.send(
                    JSON.stringify({
                        event: "end",
                    })
                );
            };
            return;
        }

        console.log("unexpected event:", data.event);
    };

    socket.onclose = (m) => {
        console.log(m)
        //location.href = "/index.html";
    }
}
function pushLine(line) {
    socket.send(
        JSON.stringify({
        event: "push-line",
        line: line,
      }),
  )
}

function changeText(title,text_contents) {
    socket.send(
        JSON.stringify({
            event: "change-text",
            title: title,
            text_contents: text_contents,
        })
    );
}
