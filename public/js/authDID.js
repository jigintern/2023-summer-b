async function authDID(event) {
    event.preventDefault();
    var did = ""
    did = localStorage.getItem("did");
    if (did === null) {
        window.location.href = "./login.html";
        return;
    }
    try {
        const resp = await fetch("/authdid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                did,
            }),
        })

        if (!resp.ok) {
            const errMsg = await resp.text();
            console.log(errMsg);
            return;
        }

        await resp.text().then((data) => {
            const result = data;
            if (result === "true") {
                console.log("success!")
                return;
            }
            else {
                window.location.href = "./login.html";
                return;
            }
        },
            (err) => {
                console.log(err)
                return;
            }
        )
    }
    catch (err) {
        console.log(err);
        return;
    }
};
