//after auth DID
const myUsername = localStorage.getItem("name");
const socket = new WebSocket(
  `ws://localhost:8000/start_web_socket?username=${myUsername}`,
);

socket.onmessage = (m) => {
    const data = JSON.parse(m.data);
  
    switch (data.event) {
        case "update-users":
            // refresh displayed user list
            let userListHtml = "";
            for (const username of data.usernames) {
            userListHtml += `<div> ${username} </div>`;
            }
            document.getElementById("users").innerHTML = userListHtml;
            break;
    
        case "send-message":
            // display new chat message
            addMessage(data.username, data.message);
            break;

        default:
            console.log("unexpected event:", data.event);
    }
};

socket.onclose = (m) => {
    console.log(m)
}