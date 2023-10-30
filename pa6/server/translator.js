const express = require("express")
const app = express()
const port = 80

app.use(express.static('public_html'))
app.listen(port, () => console.log('App listening at http://localhost:${port}'))

app.get('/:request/:language/:phrase', function (req, res) {
	var funct = req.params.request;
	var lang = req.params.language;
	var phrase = req.params.phrase;
}