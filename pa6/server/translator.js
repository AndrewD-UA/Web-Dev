/* 	Translator.js by Andrew Dennison
*
*	The intent of this program is to receive a GET, and from the url
*	translate a given phrase into a given language as specified by: 
*	/translate/{String}2{String}/{word1}+{word2}+...
*
*	A couple assumptions are made:
*		- In the translation .txt files, only the last translation will be used.
*			This leads to weird, but expected, outputs such as "Hello" in English
*			translating to "Hello" in German.  This decision was made to exactly match
*			the provided examples on the Assignment 6 page.
*		- Two-word phrases are supported.  Translation first checks if a word and
			the next word form a valid compound word, otherwise it translates them individually.
*		- All words, from all inputs, are handled in lowercase.
*		- Any String in the splits array will be used to determine where to stop 
*			processing an entry from a lang file.  If any of the Strings are in
*			the input, the ending will be chopped off.
*		- Article adjectives are preserved as a compound word.
*		- If any input word was not found, it is appended to the result as "?"
*		- The default output is ?
*		- If the input language and output language are the same, the program assumes the user
*			has provided valid input and simply spits it back out to the user with no translation.
*			this is to avoid the case where the user inputs valid words that are simply not in the
*			dictionary, and ? are provided back in place of those words.
*/

const express = require("express");
const fs = require("fs");
const app = express();
const port = 80;

// [0] is toLanguage, [1] is fromLanguage
german = [{}, {}];
spanish = [{}, {}];

// Used only in buildDict
var splits = ["[", "]", "(", ")", ",", ";", "/"];

// If no input has been provided, this default request will be sent.
app.get('/translate/:language', function (req, res) {
	res.status(200);
	res.end("?");
});

// If input has been put into inputBox, this request is sent.
app.get('/translate/:language/:phrase', function (req, res) {
	var lang = req.params.language;
	var phrase = req.params.phrase.split("+").join(" ");
	
	var langs = lang.split("2");
	var fromLang = langs[0];
	var toLang = langs[1];
	
	// If the input language is not the output language, translate
	// Otherwise, we will skip and simply send back the input
	if (fromLang !== toLang){
		// Processing what language the input is in and converting it to English.
		if (fromLang !== "e"){
			if (fromLang === "s"){
				phrase = translate(phrase, spanish[1]);
			} else if (fromLang === "g"){
				phrase = translate(phrase, german[1]);
			}
		}
		
		// We now assume at this point, the input is in English.
		
		// Translate our input to the desired output language.
		if (toLang === "s"){
			phrase = translate(phrase, spanish[0]);
		} else if (toLang === "g"){
			phrase = translate(phrase, german[0]);
		}
	}
	
	res.type('text/plain');
	res.status(200);
	res.end(phrase);
});

/**
*	Translate a given string into the given language,
*	specified by which dictionary is given.  If the word is
*	not a valid word in the given dictionary, skip it.
*
*	@param {String} 	The String to translate, with spaces separating words
*	@param {dictionary}	A key:value mapping of words (keys) to their translations (value)
*	@return {String} 	Each word individually translated as a String seperated by spaces
*/
function translate(data, dict){
	var words = data.split(" ");
	var translated = [];
	
	// Individually translate each word seperated by a plus
	for (var i = 0; i < words.length; i++){
		var word = words[i].toLowerCase();
		var added = false;
		
		// First, check if this word and the next word form a compound word
		if (i < words.length - 1){
			var nextWord = word + " " + words[i + 1].toLowerCase();
			if (nextWord in dict){
				translated.push(dict[nextWord]);
				
				// After adding the compound word, we skip the next iteration and
				// indicate we added a word to the result already.
				i++;
				added = true;
			}
		}
		
		// If we didn't already add a compound word
		if (!added){
			// We skip words that are invalid
			if (word in dict){
				translated.push(dict[word]);
			}	else {
			translated.push("?");
			}
		}
	}
	
	// Join together each translated word
	// If none of the provided words were valid, reset to ?.
	if (translated.length === 0){
		return "?";
	}
	return translated.join(" ");
}

/**
*	Given a large String representing the input data, and an array of dicts,
*	load the translations into bi-directional dicts.
*
*	@param {error} 	Any error passed in.  Not specified in spec, but could be.
*	@param {String}	The given data as a String, with each line separated by \n.
*	@param {array}	An array with two dictionaries (key:value pairs).  The first 
*					dict will be english to lang, the second will be lang to english.
*	@return {None}	No return value.  Modifies passed dicts without return.
*/
function buildDicts(err, data, dict){
	if (err != null){
		console.log(err);
	}
	
	// Assumes lines are separated by \n
	var lines = data.split("\n");
	
	// For each line in the file, process
	for (var i = 0; i < lines.length; i++){
		
		// Assumes each line is two strings seperated by a \t
		var line = lines[i].split("\t");
		var word = line[0].trim().toLowerCase();
		
		// Skips comments and blank lines
		if (word.charAt(0) == '#' || !word){
			continue;
		}

		var translation = line[1].toLowerCase();
		
		// Attempt to only take portions of the line before any
		// forbidden characters.  Repeatedly splits line for each
		// character in splits.
		for (var j = 0; j < splits.length; j++) {
			var temp = translation.split(splits[j]);
			
			translation = temp[0];
		}
		
		// After getting the translation, make sure we have no whitespace leftover.
		translation = translation.trim();
		
		// Add the words to both the forward and backwards dictionary.
		// We allow the words to be continuously overwritten so that
		// the last entry in the lang file is the final translation.
		dict[0][word] = translation;
		dict[1][translation] = word;
	}
}

app.use(express.static('public_html'));

fs.readFile('./german.txt', 'utf8', (err, data) => buildDicts(err, data, german));
fs.readFile('./spanish.txt', 'utf8', (err, data) => buildDicts(err, data, spanish));
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
