require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri =
  "mongodb+srv://Restaurant:TnZcs3W2oNH4vzOo@cluster0.s0sni.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("equisportsDB");
    const foodCollection = db.collection("foods");
    const purchaseCollection = db.collection("purchases");
    const ordersCollection = db.collection("orders");
    const usersCollection = db.collection("users");

    /** Food Routes */
    // Fetch all foods with optional search and limit
    app.get("/foods", async (req, res) => {
      const { name } = req.query;
      const query = name ? { foodName: { $regex: name, $options: "i" } } : {};
      try {
        const foods = await foodCollection.find(query).toArray();
        res.status(200).json(foods);
      } catch (error) {
        console.error("Error fetching foods:", error);
        res.status(500).json({ error: "Failed to fetch foods" });
      }
    });

    app.put("/foods/:id", async (req, res) => {
      const { id } = req.params;
      const updatedFood = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      try {
        const result = await foodCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedFood }
        );

        if (result.modifiedCount > 0) {
          res.status(200).json({ message: "Food updated successfully." });
        } else {
          res
            .status(400)
            .json({ error: "No changes were made to the food details." });
        }
      } catch (error) {
        console.error("Error updating food:", error);
        res.status(500).json({ error: "Failed to update food." });
      }
    });

    app.get("/foods/:id", async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      try {
        const food = await foodCollection.findOne({ _id: new ObjectId(id) });
        if (!food) {
          return res.status(404).json({ error: "Food not found" });
        }
        res.status(200).json(food);
      } catch (error) {
        console.error("Error fetching food by ID:", error);
        res.status(500).json({ error: "Failed to fetch food by ID" });
      }
    });

    // Fetch single food by ID
    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ID format" });
      }
      try {
        const food = await foodCollection.findOne({ _id: new ObjectId(id) });
        if (!food) {
          return res.status(404).send({ error: "Food not found" });
        }
        res.send(food);
      } catch (error) {
        console.error("Error fetching food by ID:", error);
        res.status(500).send({ error: "Failed to fetch food by ID" });
      }
    });
    app.get("/top-foods", async (req, res) => {
      const limit = parseInt(req.query.limit) || 5;
      try {
        const topFoods = await foodCollection
          .find({ purchaseCount: { $gt: 0 } })
          .sort({ purchaseCount: -1 })
          .limit(limit)
          .toArray();
        res.status(200).json(topFoods);
      } catch (error) {
        console.error("Error fetching top foods:", error);
        res.status(500).json({ error: "Failed to fetch top foods" });
      }
    });

    // Add new food
    app.post("/foods", async (req, res) => {
      const newFood = req.body;
      try {
        const result = await foodCollection.insertOne(newFood);
        res.status(201).json(result);
      } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ error: "Failed to add food" });
      }
    });

    // Save orders
    app.post("/orders", async (req, res) => {
      const order = req.body;
      try {
        const result = await ordersCollection.insertOne(order);
        res.status(201).send({ insertedId: result.insertedId });
      } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).send({ error: "Failed to save order" });
      }
    });
    app.delete("/orders/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      try {
        const result = await ordersCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount > 0) {
          res.status(200).json({ message: "Order deleted successfully." });
        } else {
          res.status(404).json({ error: "Order not found." });
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Failed to delete the order." });
      }
    });

    // Fetch orders for the logged-in user
    app.get("/orders", async (req, res) => {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      try {
        const orders = await ordersCollection
          .find({ buyerEmail: email })
          .toArray();
        res.status(200).json(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
      }
    });

    console.log("Backend setup complete!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

// Base Route
app.get("/", (req, res) => {
  res.send(" API is running...");
});
app.get("/", (req, res) => {
  res.send(" API is running...");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
