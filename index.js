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
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send(`Hello from asg_10`)
})

app.listen(port, ()=>{
    console.log(`asg_10_server is running on ${port}`)
})