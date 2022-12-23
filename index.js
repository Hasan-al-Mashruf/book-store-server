const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = 5000

//middlewere
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0e8wm8t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const booksCollection = client.db("Books_Library").collection("books")

        app.get('/books', async (req, res) => {
            const book = req.query.book
            const writer = req.query.writer
            let price = parseInt(req.query.price)

            console.log(price, book, writer)
            let query;

            // if (book) {
            //     query = { name: book }
            // } else { 
            //     query = {}
            // }

            if (price) {
                query = { 'price': { $lt: price } }
            } else { 
                query = {}
            }

            // if (price) {
            //     query = { 'price': { $lt: price } }
            // }
            // else if (book) {
            //     query = { name: book }
            // } else if (writer) {
            //     query = { writer: writer }
            // }
            // if (!price) {
            //     query = {}
            // }

            const order = req.query.order === 'asc' ? 1 : -1
            const result = await booksCollection.find(query).sort({ 'price': order }).toArray()
            res.send(result)
        })

        app.get('/details_books/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectID(id) };
            const result = await booksCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/newBooks', async (req, res) => {
            const query = {};
            const newBooks = await booksCollection.find(query).toArray()
            const result = newBooks.find(book => book.new == 'selected')
            res.send(result)
        })

        app.post('/books', async (req, res) => {
            const newBook = req.body
            console.log(newBook)
            const result = await booksCollection.insertOne(newBook);
            res.send(result)
        })


    } finally {

    }
}
run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})