const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000" , "https://inventory-client-sjt1.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());

console.log("DB User:", process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.at16f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    // strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const usersCollection = client.db("InventoryUserDB").collection("users");
    const productsCollection = client.db("InventoryUserDB").collection("products");



    // Register a new user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const existingUser = await usersCollection.findOne({ email: user.email });

      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      const result = await usersCollection.insertOne(user);
      const newUser = await usersCollection.findOne({ _id: result.insertedId });

      res.send({
        message: "User created successfully",
        data: newUser,
      });
    });

    // Get all users
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // Check if the user is an admin
    app.get("/isAdmin/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        res.send({ isAdmin: user.role === "admin" });
      } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // Get current user by email
    app.post("/currentUser", async (req, res) => {
      const { email } = req.body;

      if (!email) {
        return res
          .status(400)
          .send({ message: "Email is required.", data: null });
      }

      const user = await usersCollection.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .send({ message: "User doesn't exist.", data: null });
      }

      res.send({
        message: "User found successfully.",
        data: user,
      });
    });

    // **Add a new product**
    app.post("/products", async (req, res) => {
      const product = req.body;
      
      if (!product.name || !product.price) {
        return res.status(400).send({ message: "Product name and price are required." });
      }

      // Check if product already exists
      const existingProduct = await productsCollection.findOne({ name: product.name });

      if (existingProduct) {
        return res.send({ message: "Product already exists", insertedId: null });
      }

      const result = await productsCollection.insertOne(product);
      const newProduct = await productsCollection.findOne({ _id: result.insertedId });

      res.send({
        message: "Product added successfully",
        data: newProduct,
      });
    });

    // Get all products
    app.get("/products", async (req, res) => {

      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 1;
      const search = req.query.search || "";
      console.log(search)
      const searchQuery = {
        name: { $regex: search , $options: "i" },
      };

      const total = await productsCollection.countDocuments();

      const products = await productsCollection.find(searchQuery).skip((page-1) * size).limit(size).toArray() || [];
      res.send({
        products,
        meta: {
            currentPage: page,
            pageSize: size,
            totalItems: total,
            totalPages: Math.ceil(total / size),
        },
    });
    });

    // Search products by word
    // app.get("/products/search", async (req, res) => {
    //   try {
    //     const { query } = req.query; 

    //     // If the query is empty, return a bad request
    //     if (!query) {
    //       return res.status(400).send({ message: "Search query is required" });
    //     }

    //     // Search using the $text operator for the text index
    //     const products = await productsCollection.find({
    //       $text: { $search: query }, 
    //     }).toArray();

    //     if (products.length === 0) {
    //       return res.status(404).send({ message: "No products found" });
    //     }

    //     res.send(products); // Return the found products
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: "Server error" });
    //   }
    // });

    app.get("/", (req, res) => {
      res.send("Inventory server is running");
    });

    app.listen(port, () => {
      console.log(`Inventory server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);
