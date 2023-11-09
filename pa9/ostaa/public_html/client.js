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
        window.alert(text);
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
        }

        else if (text === "ERROR"){
            document.getElementById("password").value = "";
            innerHTML = document.getElementById("login").innerHTML;
            document.getElementById("login").innerHTML = innerHTML + "<div id='error'>Issue logging in with that info</div>";
        }
    });
}
