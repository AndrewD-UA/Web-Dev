function sendChat(){
	console.log("Starting new chat");
	let name = document.getElementById("alias").value;
	console.log("Name: " + name);
	let message = document.getElementById("message").value;
	console.log("Message: " + message);
	
	let info = {"alias": name, "chat": message};
	// message = message.split(" ").join("+");
	let url = "http://localhost:80/chatSent/";
	
	let p = fetch(url, {
		method: 'POST',
		body: {alias: name, chat: message},
		headers: { 'Content-Type': 'application/json'}
	});
	
	p.then((response) => {
    return response.text();
  }).then((text) => {
    console.log(text);
  });
	
}

function load(){
	let sub = document.getElementById("submit");
	sub.onclick = sendChat();
}
window.onload = load();