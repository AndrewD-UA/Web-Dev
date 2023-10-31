/* Client.js by Andrew Dennison
 * Last updated 30 OCT 23
 * This file contains the client-side code for generating and sending GET and POST
 * requests to the server (206.81.15.22)
 * The following is required:
 *      - The username entered does not already exist in the DB
 *      - Responses from the server are displayed in the window
 *      - Error responses from the server are alerted
 *
*/

/**
 * This function generates and sends a POST when the add user is selected
 */
function addUser(){
    // Collect required information
    let name = document.getElementById("username").value;
    let pwd = document.getElementById("password").value;
    
    // Format required information
    let info = {
        username: name, 
        password: pwd,
    };
    let url = "http://localhost:80/add/user/";
    
    // Create the POST request
    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {'Content-Type': 'application/json'}
    });
    
    // Alert the response and clear the input fields
    p.then((response) => {
        return response.text();
    }).then((text) => {
        window.alert(text);
    }).then(() => {
        Array.from(document.getElementsByClassName("Clear1")).forEach((element) => {
            element.value = "";
        });
    });
}

/**
 * This function generates and sends a POST when the submit new item is selected
 */
function addItem(){
    // Collect required information
    let srcTitle = document.getElementById("title").value;
    let srcDesc = document.getElementById("desc").value;
    let srcImgPath = document.getElementById("image").value;
    let srcPrice = parseInt(document.getElementById("price").value);
    let srcStatus = document.getElementById("status").value;
    let srcName = document.getElementById("itemUserName").value;
    
    // Format required information
    let info = {
        title:        srcTitle, 
        description:  srcDesc,
        imgPath:      srcImgPath,
        price:        srcPrice,
        status:       srcStatus    };    
    let url = "http://localhost:80/add/item/" + srcName;
    
    // Create the POST request
    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {'Content-Type': 'application/json'}
    });

    // Alert the response and clear the input fields
    p.then((response) => {
        return response.text();
    }).then((text) => {
        window.alert(text);
    }).then(() => {
        Array.from(document.getElementsByClassName("Clear2")).forEach((element) => {
            element.value = "";
        });
    });
}

/**
 * This function binds the required functions to each submit button
 */
function load(){
	let subUser = document.getElementById("submitUser");
	subUser.onclick = addUser;

    let subItem = document.getElementById("submitItem");
	subItem.onclick = addItem;
}

window.onload = load();