const express =require('express');
const app =express()
require('dotenv').config()
const cors =require('cors')
const port =process.env.PORT || 5000;

//midelware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('bistro boss is runnig ..........')    
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khyx0yo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
   // get the all menu data from database
   const menuCollection =client.db('bristroDb').collection('menu')
   const reviewCollection =client.db('bristroDb').collection('reviews')
   app.get('/menu', async(req,res)=>{
    const result = await menuCollection.find().toArray();
    res.send(result)
   })
   app.get('/reviews', async(req,res)=>{
    const result = await reviewCollection.find().toArray();
    res.send(result)
   })
  //send the particular data to mongodb
  const cartCollection =client.db('bristroDb').collection('carts')
  app.post('/carts',async(req,res)=>{
    const doc =req.body;
    const result = await cartCollection.insertOne(doc);
    res.send(result)
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
  console.log(`bristo boss is running on the ${port}`)
})