/* Server.js by Andrew Dennison
 * Last updated 08 NOV 23
 * This file contains the GET and POST request handling for the OSTAA website.
 * It also manages the MongoDB storing all of the information for the site.
 * The following assumptions are made based off the client code:
 *      - The username entered does not already exist in the DB
 *      - Valid requests for searches that have no results return nothing
 *      - The response is processed by the client and displayed to the user
 *      - Users may attempt to access the website via domain name or IP *
*/

// Initial requirements
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const port = 80;

// MongoDB connections
const db  = mongoose.connection;
const mongoDB = 'mongodb://127.0.0.1:27017/Ostaa';
mongoose.connect(mongoDB, { useNewUrlParser: true });
db.on('error', () => { console.log('MongoDB connection error:') });

// Initialize active sessions
let sessions = {};

// Create our user schema per the spec
var userSchema = new mongoose.Schema({
	username: String,
	password: String,
    listings: [String],
    purchases: [String]
});

// Create an index of usernames
// Lastly, create our model
userSchema.index({username: "text"});
var user = mongoose.model("User", userSchema);

// Create our item schema per the spec
var itemSchema = new mongoose.Schema({
	title: String,
	description: String,
    imgPath: String,
    price: Number,
    status: String,
    username: String
});

// Create an index of title and descriptions, and our model
itemSchema.index({title: "text", description: "text"});
var item = mongoose.model("Item", itemSchema);

// Check for inactive sessions and remove them
function removeSessions() {
    // Get all current users and the time
    let now = Date.now();
    let usernames = Object.keys(sessions);

    // For each user, check if the time exceeds the allotment.  If so, delete it.
    for (let i = 0; i < usernames.length; i++) {
      let last = sessions[usernames[i]].time;
      if (last + 2000000000 < now) {
        delete sessions[usernames[i]];
      }
    }
}

// Every 2 seconds, check if we should remove active sessions
setInterval(removeSessions, 2000);

// App usages
app.use(cookieParser());
app.use(express.json());

// Check if any request is valid.  Other requests will default to index.html, or the login page.
app.use("/app/*", (req, res, next) => {    
    let cookies = req.cookies;

    // If we received a user with no cookies, redirect
    if (cookies == undefined){
        return res.redirect('/index.html');
    }
    
    // If they don't have our cookie, redirect
    if (cookies.login == undefined){
        return res.redirect('/index.html');
    }
    
    // If we aren't tracking them in our active sessions, redirect
    if (sessions[cookies.login.username] == undefined){
        return res.redirect('/index.html');
    }

    // If they have the same username but not session ID, redirect
    if (sessions[cookies.login.username].id != cookies.login.sessionID){
        return res.redirect('/index.html');
    }

    // Otherwise, allow them to continue onto the website
    next();
});

// By default, use the static files
app.use(express.static("public_html"));

// Request handling for login validation
app.post("/account/login", (req, res) => {

    // Check if the provided user exists
    let userFound = user.find({username: req.body.username, password: req.body.password}).exec();

    userFound.then((results) => {
        // If we cannot find any user with that username/password, return
        if (results.length == 0) {
            return "ERROR";
        }

        // We have now validated login
        // Generate the cookie and let the client know
        let sid = Math.floor(Math.random() * 1000000000);
        sessions[req.body.username] = {id: sid, time: Date.now()};
        res.cookie("login",
            {username: req.body.username, sessionID: sid},
            //{maxAge: 60000 ^ 2});
            {maxAge: 14 * 24 * 3600000});

        return "SUCCESS";
    }).then((message) => {
        res.end(message);
    });
});

// Returns the username of the user
app.get("/app/get/username", (req, res) => {
    res.end(req.cookies.login.username.toString());
});

// Request handling for one user's listings and displays the list
// Returns an array of IDs
app.get("/app/get/listings/", (req, res) =>{
    let listingsFound = user.find({username: req.cookies.login.username}).exec();
    
    listingsFound.then((results) => {
        res.end(results[0].listings.toString());
    }).catch((error) => {
        res.end("Username not found");
    });
});

// Request handling for one user's purchases and displays the list
app.get("/app/get/purchases/", (req, res) => {
    let purchases = user.find({username: req.cookies.login.username}).exec();
    
    purchases.then((results) => {
        res.end(results[0].purchases.toString());
    }).catch((error) => {
        res.end("Username not found");
    });
});

// Search through the list of items by keyword
// Searches title and description with regular expression
// Returns an array of items
app.get("/app/get/search/items/:keyword", (req, res) =>{
    // Collect our search word
    let keyword = decodeURIComponent(req.params.keyword);

    // Search for that keyword in either title or description
    let list = item.find( {$or :
        [
            { title: {$regex: keyword}},
            { description: {$regex: keyword}}
        ]}).exec();

    // Return the results in JSON format
    list.then((results) => {
        res.json(results);
    });
});

// Search through the list of items by ID
app.get("/app/get/items/:id", (req, res) =>{
    let itemList = item.find({_id: req.params.id}).exec();

    itemList.then((users) => {
        res.end(JSON.stringify(users[0]));
    }).catch((error) => {
        res.end("Items not found!");
    });
});

// POST handling for new users
app.post("/add/user", (req, res) => {
    let name = req.body.username;
    let checkName = user.find({username: name}).exec();

    // Check the database to ensure the username is not already tied to a user
    checkName.then((results) => {
        return (results.length > 0);
    }).then((found) => {
        if (found){
            return `Username ${name} already exists!  Select another name.`;
        } 
        
        // We assume now the user does not already exist
        //Then make a new user and save it, and alert the end user
        let newUser = new user({
            username: name,
            password: req.body.password,
            listings: [],
            purchases: []
        });
    
        newUser.save();
        return `Username ${name} created`;
    }).then((message) => {
        res.end(message);
    });    
});

// POST handling for adding a new listing
app.post("/app/add/item/", (req, res) => {

    // Collect and format the required information
    theUser = req.cookies.login.username;
    let newItem = new item({
        title: req.body.title,
        description: req.body.description,
        imgPath: req.body.imgPath,
        price: req.body.price,
        status: req.body.status,
        username: theUser
    });

    // Save the item, then update the appropriate user's listings
    newItem.save().then(() => {
        return user.findOneAndUpdate(
            {username: theUser},
            {$push: {listings: [newItem._id]}});
    }).then((userFound) => {
        res.end("Successful addition");
    }).catch(() => {
        res.end("Unsuccessful addition");
    });
});

// Route handling for purchases
app.get("/app/purchase/:id", (req, res) => {

    // Collect and format required information
    let id = decodeURIComponent(req.params.id);

    // Update the username attached to the original item
    item.findOneAndUpdate(
        {_id: id},
        {   status: "SOLD",
            username: req.cookies.login.username})
    
    // Then, update the purchaser's purchases
    .then((originalItem) => {
        return user.findOneAndUpdate(
            {username: req.cookies.login.username},
            {$push: {purchases: [originalItem._id]}});

    // Then, update the original user's listings       
    }).then((origOwner) => {
        return user.findOneAndUpdate(
            {username: origOwner.username},
            {$pull: {listings: [id]}});
    }).then(() => {
        res.end("Successful Purchase");
    }).catch((error) => {
        res.end(error);
    })
})

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`));