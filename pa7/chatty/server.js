const https = require('https');
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bp = require('body-parser');
const fs = require ('fs');

const port = 80;

const db  = mongoose.connection;
const mongoDB = 'mongodb://127.0.0.1:27017/Chat';
mongoose.connect(mongoDB, { useNewUrlParser: true });
db.on('error', () => { console.log('MongoDB connection error:') });

var chatSchema = new mongoose.Schema({
	alias: String,
	message: String
});

var chat = mongoose.model('Chat', chatSchema);

app.post('/chatSent', (req,res) => {
	console.log("Chat received");
	console.log(req.body);
	let inAlias = req.body.alias;
	let inMessage = req.body.chat;
	
	let newMessage = new chat({alias: inAlias, message: inMessage});
	newMessage.save().then(() => {
		console.log("New chat from " + inAlias + " received");
		res.end("Chat added");
	}).catch((err) => {		
		console.log(err);
	});
});

app.use(express.static("public_html"));

var privateKey = fs.readFileSync( 'domain.key' );
var certificate = fs.readFileSync( 'domain.crt' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port);

// app.listen(port, () => console.log(`Listening on port ${port}`));

// require('crypto');
// let h  = crypto.createHash('sha3-256');
// let data = h.update(toHash, 'utf-8');
// let sid = addSession(username);
// res.cookie("login",
//	{username:username, sID:sID, maxAge:maxAge}
