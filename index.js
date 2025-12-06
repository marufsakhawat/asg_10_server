const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.piltxgj.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  await client.connect();
  console.log("You successfully connected to MongoDB!");

  const database = client.db("pawMartDB");
  const listingsCollection = database.collection("listings");
  const ordersCollection = database.collection("orders");

  app.get("/", (req, res) => {
    res.send("PawMart Server is running fine!");
  });

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

  // Get all listings post by specific user (email)

  app.get("/my-listings/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const result = await listingsCollection.find(query).toArray();
    res.send(result);
  });

  // Delete listing by ID

  app.delete("/listing/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await listingsCollection.deleteOne(query);
    res.send(result);
  });

  // Update listing by ID

  app.put("/listing/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const updatedListing = req.body;
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        name: updatedListing.name,
        category: updatedListing.category,
        price: parseFloat(updatedListing.price),
        location: updatedListing.location,
        description: updatedListing.description,
        image: updatedListing.image,
        date: updatedListing.date,
      },
    };
    const result = await listingsCollection.updateOne(
      query,
      updateDoc,
      options
    );
    res.send(result);
  });

  // Get all orders by specific user (email)

  app.get("/my-orders/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const result = await ordersCollection.find(query).toArray();
    res.send(result);
  });

  app.listen(port, () => {
    console.log(`PawMart server is sitting on port ${port}`);
  });
}
run().catch(console.dir);
