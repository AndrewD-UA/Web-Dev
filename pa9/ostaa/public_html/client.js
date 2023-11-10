/* By: Andrew Dennison
 * Last updated: 09 NOV 23
 * This file contains the functions used by the login page
 */

//This function contains the code required to POST/create a new user
function addUser(){
    
    // Collect and format the required information
    let addUser = document.getElementById("usernameAdd").value;
    let addPass = document.getElementById("passwordAdd").value;    
    let info = {
        username: addUser, 
        password: addPass,
    };

    // Send the POST to the server
    let url = "http://localhost:80/add/user/";    
    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {'Content-Type': 'application/json'}
    });
    
    // Alert the status of the POST
    p.then((response) => {
        return response.text();
    }).then((text) => {
        window.alert(text);
    });
}

// This function sends a login request
function login(){
    
    // Collect the required information and format
    let currUser = document.getElementById("username").value;
    let currPass = document.getElementById("password").value;
    let info = {
        username: currUser, 
        password: currPass,
    };
    
    // Send the login request to the server
    let url = "http://localhost:80/account/login/";
    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {'Content-Type': 'application/json'}
    });

    // Handle the server's response to the request
    p.then((response) => {
        return response.text();
    }).then((text) => {
        // If the login was successful, redirect to the home page.
        if (text === "SUCCESS"){
            window.location.href = '/app/home.html';
        }
        
        // If the login was not successful, clear the password field and notify the user
        else if (text === "ERROR"){
            document.getElementById("password").value = "";
            innerHTML = document.getElementById("login").innerHTML;
            document.getElementById("login").innerHTML = innerHTML + "<div id='error'>Issue logging in with that info</div>";
        }
    });
}
