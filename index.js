const express = require('express');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose')
const isUrlHttp = require('is-url-http')

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)

const linkSchema = new mongoose.Schema({
  original_url : String, 
  short_url : Number
})

const Link = mongoose.model("Link", linkSchema)

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

function countLinks() {
  // const query = Link.find()
  let numOfLinks;
  Link.countDocuments({}, async function(err, count) {

    try {
      numOfLinks = await count
    } catch (err) {
      console.log(err)
    }
    // if(err) {
    //   console.log(err)
    // }
    // else {
    //   console.log("count: ", count)
    //   numOfLinks = count
    // }
  })
  return numOfLinks
}




app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url

  if (isUrlHttp(original_url)) {
    res.json(
      { 
        original_url: original_url,
        short_url: countLinks()
      }
    )
  } else {
    res.json({ error: "invalid url"})
  }
  res.end()
})

// let numOfLinks
// const query = Link.find()
// query.count(function(err, count) {
//   if(err) {
//     console.log(err)
//   }
//   else {
//     console.log("Count is ", count)
//     numOfLinks = count
//     console.log("Num of links:", numOfLinks)
//   }
// })

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
