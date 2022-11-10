require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)

const linkSchema = new mongoose.Schema({
  original_url : String, 
  short_url : Number
})

mongoose.model("Link", linkSchema)

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url
  try {
    const providedURL = new URL(req.body.url)
    const validURL = providedURL.href
    console.log("valid", validURL)
  } catch {
    console.log("Invalid URL")
  }
  console.log("Original", original_url)
  console.log("-----------------")
  console.log()
  res.end()
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


// Check if URL is valid
//  if it is,
//    post to /api/shorturl
//    get JSON obj with orginal URL & short URL
//    match original URL with with /api/shorturl/<short_url>
//  if it is not
//    respond with error msg.
