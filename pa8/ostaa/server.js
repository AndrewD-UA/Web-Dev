/* Server.js by Andrew Dennison
 * Last updated 30 OCT 23
 * This file contains the GET and POST request handling for the OSTAA website.
 * It also manages the MongoDB storing all of the information for the site.
 * The following assumptions are made based off the client code:
 *      - The password entered is valid (at least four characters)
 *      - The username entered does not already exist in the DB
 *      - Valid requests for searches that have no results return nothing
 *      - The response is processed by the client and displayed to the user
 *      - Users may attempt to access the website via domain name or IP
 *
*/

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const port = 80;

// MongoDB connections
const db  = mongoose.connection;
const mongoDB = 'mongodb://127.0.0.1:27017/Ostaa';
mongoose.connect(mongoDB, { useNewUrlParser: true });
db.on('error', () => { console.log('MongoDB connection error:') });

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
    status: String
});

// Create an index of title and descriptions
// Lastly, create our model
itemSchema.index({title: "text", description: "text"});
var item = mongoose.model("Item", itemSchema);

// We will format everything with JSON
app.use(express.json());

// Allows usage of my domain name
app.use(cors({
    origin: 'http://fifthprinciple.net',
    exposedHeaders: ['Origin, X-Requested-With, Content-Type, Accept']
}));

// Request handling for all users displays a full list of all users
app.get("/get/users", (req, res) =>{
    let usersFound = user.find({}).exec();
    usersFound.then((users) => {
        res.end(users.toString());
    });
});

// Request handling for all items displays a full list of all items
app.get("/get/items", (req, res) =>{
    let itemsFound = item.find({}).exec();
    itemsFound.then((users) => {
        res.end(users.toString());
    });
});

// Request handling for one user's listings and displays the list
app.get("/get/listings/:username", (req, res) =>{
    let listingsFound = user.find({username: req.params.username}).exec();
    
    listingsFound.then((results) => {
        res.end(results[0].listings.toString());
    }).catch((error) => {
        res.end("Username not found");
    });
});

// Request handling for one user's purchases and displays the list
app.get("/get/purchases/:username", (req, res) => {
    let purchases = user.find({username: req.params.username}).exec();
    
    purchases.then((results) => {
        res.end(results[0].purchases.toString());
    }).catch((error) => {
        res.end("Username not found");
    });
});

// Search through the list of users using our earlier created index.
// Performs keyword search, so whole-word matches are included, but 
// partial-word matches are not (For example, searching for "in" does not include "tin")
app.get("/search/users/:keyword", (req, res) =>{
    let list = user.find({$text: {$search: req.params.keyword}}).exec();

    list.then((results) => {
        res.end(results.toString());
    }).catch((error) => {
        console.log(error);
        res.end("Username not found!");
    });
});

// Search through the list of items using our earlier created index.
// Performs keyword search of name and description.  Whole-word matches are included,
// but partial-word matches are not (For example, searching for "in" does not include "tin")
app.get("/search/items/:keyword", (req, res) =>{
    let itemList = item.find({$text: {$search: req.params.keyword}}).exec();

    itemList.then((users) => {
        res.end(users.toString());
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
        return `Username ${name} added`;
    }).then((message) => {
        res.end(message);
    });    
});

// POST handling for new items
app.post("/add/item/:username", (req, res) => {
    let checkName = user.find({username: req.params.username}).exec();

    // Check to make sure a valid user has been entered
    checkName.then((checkName) => {
        return (checkName.length > 0);
    }).then((found) => {
        if (!found){
            return `${req.params.username} not found!`;
        }

        // We assume now the user does already exist
        // Add the item to both the list of items and
        // the user's listings.  Alert the end user after
        let newItem = new item({
            title: req.body.title,
            description: req.body.description,
            imgPath: req.body.imgPath,
            price: req.body.price,
            status: req.body.status
        });

        user.updateOne({username: req.params.username}, { $push: {listings: newItem._id.toString()}}).catch((error) => {
            console.log(error);
        });
        newItem.save();

        return `${req.body.title} added to ${req.params.username}'s listings`;
    }).then((result) => {
        res.end(result);
    }).catch((error) => {
        console.log(error);
    })
});

// If the request does not match anything else, use our public_html folder
app.use(express.static("public_html"));

app.listen(port, () => console.log(`Listening on port ${port}`));