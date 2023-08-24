
window.addEventListener("load", (e)=>{
    document.getElementById("create-room").onclick = async ()=> {
        const path = "/createroom"
        const method = "POST"
        const did = localStorage.getItem("did");
        try {
            const resp = await fetch(path, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    did,
                }),
            })
    
            if (!resp.ok) {
                console.log(resp);
                return;
            }
    
            //部屋立て成功
            const json = await resp.json();
            console.log(json);
        }
        catch (err) {
            console.log(err);
            return;
        }
    };


    //join
    document.getElementById("join-room").onclick = async ()=> {
        connectSocket();
    };
});

let socket;
async function connectSocket(){
    const myUsername = localStorage.getItem("name");
    const did = localStorage.getItem("did");
    const roomid = document.getElementById("roomid").value;
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