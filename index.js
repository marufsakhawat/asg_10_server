const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;


const app = express();
app.use(cors());


const uri = "mongodb+srv://db_asg_10:QdBbhOFqoSe0RW8I@cluster0.piltxgj.mongodb.net/?appName=Cluster0";

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

    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();  // default but I make it commented
  }
}

 // HomePage er Jonno 6 Listing limit Set Kora
  app.get("/listings-recent", async (req, res) => {
    const result = await listingsCollection
      .find()
      .sort({ _id: -1 })
      .limit(6)
      .toArray();
    res.send(result);
  });

  // Notun listing add to DB

  app.post("/listings", async (req, res) => {
    const newListing = req.body;
    const result = await listingsCollection.insertOne(newListing);
    res.send(result);
  });

  //  ALL listings Pets & Supplies page e add kora

  app.get("/all-listings", async (req, res) => {
    const result = await listingsCollection.find().toArray();
    res.send(result);
  });

  // Get single listing by ID details page Er Jonno

  app.get("/listing/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await listingsCollection.findOne(query);
    res.send(result);
  });

  // Database e Order Save Kora

  app.post("/orders", async (req, res) => {
    const newOrder = req.body;
    const result = await ordersCollection.insertOne(newOrder);
    res.send(result);
  });






run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send(`Hello from asg_10`)
})

app.listen(port, ()=>{
    console.log(`asg_10_server is running on ${port}`)
})