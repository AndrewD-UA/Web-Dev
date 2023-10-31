/*	By: Andrew Dennison
	This file contains the client-side code for creating, sending,
	and displaying requests.
*/

// This function sends the values currently in the input boxes as a POST
function sendChat(){
	
	// Collect our required information
	let name = document.getElementById("alias").value;
	let chat = document.getElementById("message").value;
	
	// Format the information for sending
	let info = {
		time: new Date().getTime(),
		alias: name, 
		message: chat
	};
	
	// The remote server we are sending to
	let url = "http://localhost:80/chats/post/";
	
	// Format and send the POST in JSON format.
	// no-cors prevents browser interference
	let p = fetch(url, {
		method: 'POST',
		body: JSON.stringify(info),
		headers: { 'Content-Type': 'application/json'},
		mode: 'no-cors'
	}).catch((err) => {
		console.log(err);
	});
	
	// Clear the current value within the message input box
	document.getElementById("message").value = "";
	
}

// This function asks the server for a list of all stored messages
function checkMessages(){
	let url = "http://localhost:80/chats/";
	
	// Format a GET request with no-cors to prevent browser interference
	let get = fetch(url, {
		mode: 'no-cors'
	}) // Then gather the text of the response
	.then((response) => {
		return response.text();
	}) // Then store this text, which is HTML format, in the display window
	.then((text) => {
		let chat = document.getElementById("chatWindow");
		chat.innerHTML = text;
	});	
}

// This function is called once upon the initial load of the webpage
function load(){
	
	// Bind the submit button to sending the current chat info
	let sub = document.getElementById("submit");
	sub.onclick = sendChat;	
	
	// Bind the enter key to sending current chat info, when the cursor is in the message box
	let message = document.getElementById("message");
	message.onkeyup = ((key) => {
		if (key.keyCode === 13){
			sendChat();
		}
	});
	
	// Do an initial check for messages
	checkMessages();
	
	// Check for messages every additional second
	setInterval(checkMessages, 1000);
}

// Inital call to load
window.onload = load();