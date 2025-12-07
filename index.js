const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.piltxgj.mongodb.net/?appName=Cluster0`;

// MongoDB client 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db("pawMartDB");
  const listingsCollection = db.collection("listings");
  const ordersCollection = db.collection("orders");

  // Root route — server health check
  app.get("/", (req, res) => {
    res.send("Server is running fine!");
  });

  // Get latest 6 listings
  app.get("/listings-recent", async (req, res) => {
    const result = await listingsCollection
      .find()
      .sort({ _id: -1 })
      .limit(6)
      .toArray();
    res.send(result);
  });

  // Add new listing
  app.post("/listings", async (req, res) => {
    const newListing = req.body;
    const result = await listingsCollection.insertOne(newListing);
    res.send(result);
  });

  // Get all listings
  app.get("/all-listings", async (req, res) => {
    const result = await listingsCollection.find().toArray();
    res.send(result);
  });
 
  // Get a single listing by ID
  app.get("/listing/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await listingsCollection.findOne(query);
    res.send(result);
  });

  // Save a new order
  app.post("/orders", async (req, res) => {
    const newOrder = req.body;
    const result = await ordersCollection.insertOne(newOrder);
    res.send(result);
  });

  // Get all listings posted by a specific user
  app.get("/my-listings/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email };
    const result = await listingsCollection.find(query).toArray();
    res.send(result);
  });

  // Delete a listing by ID
  app.delete("/listing/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await listingsCollection.deleteOne(query);
    res.send(result);
  });

  // Update listing by ID
  app.put("/listing/:id", async (req, res) => {
    const id = req.params.id;
    const updatedListing = req.body;
    const query = { _id: new ObjectId(id) };

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

    const result = await listingsCollection.updateOne(query, updateDoc, {
      upsert: true,
    });

    res.send(result);
  });

  // Get all orders for a specific user
  app.get("/my-orders/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email };
    const result = await ordersCollection.find(query).toArray();
    res.send(result);
  });

  // Start server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

run().catch(console.dir);
