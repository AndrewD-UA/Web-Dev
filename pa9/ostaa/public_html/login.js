function addUser(){
    console.log("Starting new add user");
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
    });
}

function login(){

}

function onLoad(){
    document.getElementById("loginUser").onclick = login.then(() =>{
        document.getElementById("username").innerText = "";
        document.getElementById("password").innerText = "";
    });
    document.getElementById("addUser").onclick = addUser.then(() => {
        document.getElementById("usernameAdd").innerText = "";
        document.getElementById("passwordAdd").innerText = "";
    });
}

onLoad();