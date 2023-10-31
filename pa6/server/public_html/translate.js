/* By: Andrew Dennison
	This javascript program gather's the user's inputs from
	the web page, then formats it into an XHR which requests 
	a translation from the web server.  Lastly, it binds the
	translation function to various elements 
*/

function getTranslation(){
	
	// Create a new XHR, and when the request is fulfilled ouptut the translation
	let XHR = new XMLHttpRequest();
	XHR.onreadystatechange = () => {
		if (XHR.readyState = 4 && XHR.status === 200){
			let outputText = document.getElementById("outputBox");
			outputText.innerText = XHR.response;
		}
	};
	
	
	// Gather the input text
	let inputText = document.getElementById("inputBox").value;
	inputText = inputText.split(" ").join("+");
	console.log(inputText);
	
	
	// determine the language we are translating from
	let fromLang = document.getElementById("inputLang").value;
	if (fromLang === "English"){
		fromLang = "e";
	} else if (fromLang === "Spanish"){
		fromLang = "s";
	} else{
		fromLang = "g";
	}
	
	// determine the language we are translating to
	let toLang = document.getElementById("outputLang").value;
	if (toLang === "English"){
		toLang = "e";
	} else if (toLang === "Spanish"){
		toLang = "s";
	} else {
		toLang = "g";
	}
	
	
	// Format the request
	let lang = [fromLang, toLang].join("2");
	let path = ["/translate", lang, inputText].join("/");
	console.log(path);
	
	
	// Send the request
	XHR.open("get", path, true);
	XHR.send();
}

function onLoad(){
	// Bind translation to any updates to the input text box
	// or changes to the translation language
	let input = document.getElementById("inputBox");		
	let inLang = document.getElementById("inputLang");
	let outLang = document.getElementById("outputLang");
	input.onkeyup = getTranslation
	inLang.onchange = getTranslation
	outLang.onchange = getTranslation
}

onLoad();