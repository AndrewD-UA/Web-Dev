// By: Andrew Dennison
// JavaScript file which generates or computes both the
// Caesar and Square ciphers, then updates the text
// fields with both ciphers.  When everything is loaded,
// map functions to their respective HTML element via DOM.

// Global square variable stores the square cipher
let square = [];

// For both text boxes, pass the input to the encryption
// and update the text.
function updateText(){
	let input = document.getElementById("input").value;
	
	let topText = document.getElementById("text1");
	topText.innerText = getCeasarEncryption(input);
	
	let bottomText = document.getElementById("text2");
	bottomText.innerText = getSquareEncryption(input);
}

function getSquareEncryption(input) {
	let str = input.toUpperCase();
	result = "";
	
	// For each character in the string, get its ASCII value
	// If it falls in the range of a letter, then convert
	// the ASCII value to the corresponding index of the grid
	// Otherwise, leave the character as is
	for(let i = 0; i < str.length; i++){
		let charAt = str.charCodeAt(i);
		
		if(charAt >= 65 && charAt < 90){
			result += square[charAt - 65];
		} else {
			result += String.fromCharCode(charAt);
		}
	}
	
	return result;
}

function getCeasarEncryption(input) {
	let str = input.toUpperCase();
	result = "";
	
	// For each character in the string, get it ASCII value
	// If it is in the range of a letter, then add the
	// slider value.  If that falls outside the range of a letter, then
	// loop back to the beginning of the alphabet, or "wrap"
	for(let i = 0; i < str.length; i++){
		let charAt = str.charCodeAt(i);
		
		if (charAt >= 65 && charAt <=90){
			let shift = parseInt(document.getElementById("slider").value);
			charAt += shift;
			
			if(charAt > 90){
				charAt -= 26;
			}
		}		
		result += String.fromCharCode(charAt);		
	}
	
	return result;
}

function updateSlider(){
	let input = document.getElementById("slider").value;
	document.getElementById("displaySlider").innerText = input;
	
	// The text must also be updated every time the slider is updated
	updateText();
}

function scrambleSquare(){
	table = document.getElementsByClassName("Cipher");
	square = [];
	let charArr = [];
	
	// Build an array with the first 25 letters of the alphabet
	for(let i = 0; i < 25; i++){
		charArr.push(String.fromCharCode(65 + i));
	}
	
	// Pick a random character from the alphabet array, then store it in
	// the global square array
	let index = 0;
	while (charArr.length > 0){
		index = Math.floor(Math.random() * charArr.length);
		square.push(charArr[index]);		
		
		charArr = [...charArr.slice(0, index), ...charArr.slice(index + 1)];
	}
	
	// Present the updated cipher and store it in the table
	for (let i = 0; i < table.length; i++){
		table[i].innerText = square[i];
	}
	
	updateText();
}

function onLoad(){
	let textBox = document.getElementById("input");
	textBox.oninput = updateText;
	
	let slider = document.getElementById("slider");
	slider.oninput = updateSlider;
	
	let update = document.getElementById("update");
	update.onclick = scrambleSquare;
	
	scrambleSquare();
}

onLoad();