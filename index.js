const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser')
require('dotenv').config()

const port = 5000

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfsjf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("dailyShop").collection("products");
  const orderCollection = client.db("dailyShop").collection("orders");

  console.log('database is connected ')
  app.post('/addProduct',(req,res)=>{
      const product = req.body;
      productCollection.insertOne(product)
      .then(result=>{
        res.send(result.insertedCount >0 )
      })
  })

    app.post('/order',(req,res)=>{
      const order = req.body;
      orderCollection.insertOne(order)
      .then(result =>{
        console.log(result)
        res.send('Ordered successfully')
      })
    })


    app.get('/orders',(req,res)=>{
      orderCollection.find({email : req.query.email})
      .toArray((err,documents)=>{
        res.send(documents)
      })
    })



  app.get('/products',(req,res)=>{
    productCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get('/product/:id',(req,res)=>{
    // console.log('id',req.params.id)
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  app.delete('/delete/:id',(req,res)=>{
    productCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
      res.redirect('/')
    })
  })
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})