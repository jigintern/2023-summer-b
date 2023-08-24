
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
    document.getElementById("join-room").onclick = ()=> {
    };
});

let socket;
function connectSocket(){
    const myUsername = localStorage.getItem("name");
    socket = new WebSocket(
    `ws://localhost:8000/start_web_socket?username=${myUsername}`,
    );

    socket.onmessage = (m) => {
        const data = JSON.parse(m.data);
    
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
            //console.log(data.lines);
            lines = data.lines;
            return;
        }

        if (data.event === "update-BGcolor"){
            tool.setBackgroundColor(data.color);
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