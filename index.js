const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hey I am!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8pwx7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("book-store").collection("books");

  // to set all books in database
  app.post('/addBooks', (req, res) => {
    const newBooks = req.body;
    booksCollection.insertMany(newBooks)
    .then(result =>{
      console.log(result);
    })
    res.send(newBooks)
  })

  // To get all books from database
  app.get('/books', (req, res)=>{
    booksCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  //   client.close();
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})