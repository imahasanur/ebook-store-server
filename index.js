const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
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
  const booksOrderCollection = client.db("book-store").collection("orders");
  
  // to set all books in database
  app.post('/addBooks', (req, res) => {
    const newBooks = req.body;
    booksCollection.insertMany(newBooks)
    .then(result =>{
      res.send(result.insertedCount > 0);
    })
  })

  // To get all books from database
  app.get('/books', (req, res)=>{
    booksCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // To get a book from database
  app.get('/book/:bookId', (req, res)=>{
    booksCollection.find({_id:ObjectId(req.params.bookId)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  // to get some books
  app.post('/getBooks', (req, res)=>{
    console.log(req.body);
    let chosenBooks = req.body;
    booksCollection.find({image:{$in:chosenBooks}})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  // to inset book orders of a person
  app.post('/addBookOrders', (req, res) => {
    const newOrders = req.body;
    booksOrderCollection.insertMany(newOrders)
    .then(result =>{
      res.send(result.insertedCount > 0);
    })
  })

  // to view orders of a login person
  app.get('/showOrders', (req, res) =>{
    booksOrderCollection.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // to view  all books by admin
  app.get('/showAllBooks', (req, res)=>{
    booksCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // to delete a order by admin
  app.delete('/deleteBook/:id', (req, res)=>{
    booksCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then((result)=>{
      res.send(result.deletedCount > 0);
    })
  })

  // to add book to home
  app.post('/addBook', (req, res)=>{
    const book = req.body;
    booksCollection.insertOne(book)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  //   client.close();
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})