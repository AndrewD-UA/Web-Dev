function addUser(){
    let addUser = document.getElementById("usernameAdd").value;
    let addPass = document.getElementById("passwordAdd").value;
    
    let info = {
        username: addUser, 
        password: addPass,
    };

    let url = "http://127.0.0.1:80/add/user/";
    
    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {'Content-Type': 'application/json'}
    });
    
    p.then((response) => {
        return response.text();
    }).then((text) => {
        console.log(text);
        //document.getElementById("usernameAdd").value = "";
        //document.getElementById("passwordAdd").value = "";
    });
}

function login(){
    let currUser = document.getElementById("username").value;
    let currPass = document.getElementById("password").value;

    let url = "http://127.0.0.1:80/account/login/";

    let info = {
        username: currUser, 
        password: currPass,
    };

    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {'Content-Type': 'application/json'}
    });

    p.then((response) => {
        return response.text();
    }).then((text) => {
        if (text === "SUCCESS"){
            window.location.href = '/app/home.html';
            return;
        }

        document.getElementById("username").value = "";
        innerHTML = document.getElementById("login").innerHTML;
        document.getElementById("login").innerHTML = innerHTML + "<div id='error'>" + text + "</div>";
    });
}

function onLoad(){
    document.getElementById("loginUser").onclick = login;
    document.getElementById("addUser").onclick = addUser;
}

onLoad();