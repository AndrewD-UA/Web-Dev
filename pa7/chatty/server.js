/* By: Andrew Dennison
	This JS file functions as the primary parser of requests to this server.
	The first major request is "/chats/post", which is a POST with the Chat
	message in the body:
		- Expects a time, alias (name), and message
		- Creates a new chat message, saves it to MongoDB, and exits.
	The second major request is "/chats", which is a GET to get all Chat
	messages from mongoDB.
		- Does not expect any input other than the URL
		- Returns all current messages on the db
		- Formats the return in HTML for display
	Finally, the public_html folder is served as a static file
*/

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bp = require('body-parser');
const fs = require ('fs');
const cors = require('cors');

const port = 80;

// Connect to the mongo database
const db  = mongoose.connection;
const mongoDB = 'mongodb://127.0.0.1:27017/Chat';
mongoose.connect(mongoDB, { useNewUrlParser: true });
db.on('error', () => { console.log('MongoDB connection error:') });

// Define the schema for chats
var chatSchema = new mongoose.Schema({
	time: Number,
	alias: String,
	message: String
});

// Define the model based off the schema
var chat = mongoose.model('Chat', chatSchema);

// Receive this post request, expecting JSON information
app.post('/chats/post', bp.json(), (req,res) => {	
	
	// Allow my requests from my domain name to access the appropriate resources
	res.setHeader("Access-Control-Allow-Origin", "http://fifthprinciple.net");
    res.header("Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type, Accept");
				
	// Create a new instance of Chat
	let newMessage = new chat({
		time: req.body.time,
		alias: req.body.alias, 
		message: req.body.message
	});
	
	// Save the Chat
	// Either error, or end if no error
	newMessage.save().then(() => {
		res.end();
	}).catch((err) => {		
		console.log(err);
	});
});

// Receive this get request
app.get('/chats', (req, res) => {
	
	// Allow my requests from my domain name to access the appropriate resources
	res.setHeader("Access-Control-Allow-Origin", "http://fifthprinciple.net");
    res.header("Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type, Accept");
				
	// Find all available chats
	let p = chat.find({}).exec();

	// Make a promise once the chats are retrieved
	p.then((chats) => {
		let result = "";
		let messages = [chats.length];
		
		// Store all of the chat messages in the messages array
		for (let i = 0; i < chats.length; i++){
			messages[i] = chats[i];
		}
		
		// Sort the messages array based off of the dates of the messages
		messages.sort((ele1, ele2) => {
			ele1.date - ele2.date;
		});
		
		// Append each message in HTML format to the result
		messages.forEach((ele) => {
			let alias = ele.alias;
			let message = ele.message;
			
			result += `<p><strong>${alias}</strong>: ${message}</p>`;	
		});
		
		// Return the formatted HTML code
		res.end(result);				
	});
});

// If not a specific request, serve public_html
app.use(express.static("public_html"));
app.use(bp.json());

// Allows me to made cross-origin requests from my domain to the IP
app.use(cors({
        origin: 'http://fifthprinciple.net'
}));

app.listen(port, () => console.log(`Listening on port ${port}`));
