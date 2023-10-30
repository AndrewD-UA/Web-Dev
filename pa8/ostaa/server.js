express = require("express");
app = express();
mongoose = require("mongoose");

const port = 80;

const db  = mongoose.connection;
const mongoDB = 'mongodb://127.0.0.1:27017/Ostaa';
mongoose.connect(mongoDB, { useNewUrlParser: true });
db.on('error', () => { console.log('MongoDB connection error:') });

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
    listings: [Number],
    purchases: [Number]
});

var user = mongoose.model('User', userSchema);

var itemSchema = new mongoose.Schema({
	title: String,
	description: String,
    image: String,
    price: Number,
    status: String
});

var item = mongoose.model('Item', itemSchema);

app.use(express.json());

app.get("/get/users", (req, res) =>{

});

app.get("/get/items", (req, res) =>{

});

app.get("/get/listings/:username", (req, res) =>{
    let username = req.params.username;
});

app.get("/get/purchases/:username", (req, res) =>{
    let username = req.params.username;
});

app.get("/search/users/:keyword", (req, res) =>{
    let keyword = req.params.keyword;
});

app.get("/search/items/:keyword", (req, res) =>{
    let keyword = req.params.keyword;
});

app.post("/add/user", (req, res) => {
    let newUser = new chat({
        username: req.body.username,
        password: req.body.password,
        listings: [],
        purchases: []
    });
});

app.post("/add/item/:username", (req, res) => {
    let newUser = new chat({
	    username: req.params.username,
	    password: req.body.password,
        listings: [Number],
        purchases: [Number]
    });
});

app.use(express.static("public_html"));

app.listen(port, () => console.log(`Listening on port ${port}`));