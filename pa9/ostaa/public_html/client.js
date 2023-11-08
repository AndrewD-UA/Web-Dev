function addUser(){
    console.log("Starting new add user");
    let name = document.getElementById("username").value;
    let message = document.getElementById("password").value;
    
    let info = {
        "username": username, 
        "password": password,
    };

    let url = "http://localhost:80/add/user/";
    
    let p = fetch(url, {
        method: 'POST',
        body: {alias: name, chat: message},
        headers: {'Content-Type': 'application/json'}
    });
    
    p.then((response) => {
    return response.text();
    }).then((text) => {
    console.log(text);
    });
}

function addItem(){
    console.log("Starting new add item");
    let title = document.getElementById("title").value;
    let desc = document.getElementById("desc").value;
    let imgPath = document.getElementById("image").value;
    let price = document.getElementById("price").value;
    let status = document.getElementById("status").value;
    let username = document.getElementById("itemUserName").value;
    
    let info = {
        "title":        title, 
        "description":  desc,
        "image":        imgPath,
        "price":        price,
        "status":       status,
        "username":     username
    };
    
    let url = "http://localhost:80/add/user/";
    
    let p = fetch(url, {
        method: 'POST',
        body: {alias: name, chat: message},
        headers: {'Content-Type': 'application/json'}
    });
    
    p.then((response) => {
    return response.text();
    }).then((text) => {
    console.log(text);
    });
}

function load(){
	let subUser = document.getElementById("submitUser");
	subUser.onclick = addUser();

    let subItem = document.getElementById("submitItem");
	subItem.onclick = addItem();
}

window.onload = load();