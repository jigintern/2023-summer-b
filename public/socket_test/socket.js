//after auth DID
const myUsername = localStorage.getItem("name");
const socket = new WebSocket(
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
    location.href = "/index.html";
}

function pushLine(line) {
    socket.send(
        JSON.stringify({
        event: "push-line",
        line: line,
      }),
  )
}