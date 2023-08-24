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
            location.href = "./multidraw.html?roomid=" + json.roomid;
        }
        catch (err) {
            console.log(err);
            return;
        }
    };


    //join
    document.getElementById("join-room").onclick = async ()=> {
        const roomid = document.getElementById("roomid").value;
        location.href = "./multidraw.html?roomid=" + roomid;
    };
});