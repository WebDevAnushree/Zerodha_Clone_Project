
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const authRouter = require("./router/auth-router");
const errorMiddleware = require("./middlewares/error-middleware");

const PORT = process.env.PORT || 3006;
const uri = process.env.MONGO_URL;

const app = express();

// ✅ Allow all origins — fixes CORS error from localhost:3000
app.use(cors());
app.use(express.json());

/* ---------------- AUTH ROUTES ---------------- */
app.use("/api/auth", authRouter);

/* ---------------- OTHER ROUTES ---------------- */

app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching holdings" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching positions" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    console.log("Order received:", req.body); // ✅ debug
    const newOrder = new OrdersModel({
      name: req.body.name,
      qty: Number(req.body.qty),
      price: Number(req.body.price),
      mode: req.body.mode,
    });
    await newOrder.save();
    console.log("Order saved successfully"); // ✅ debug
    res.status(201).json({ message: "Order saved!" });
  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});
app.get("/", (req, res) => {
    res.send("Zerodha Backend is Running Successfully 🚀");
});

/* ---------------- ERROR MIDDLEWARE ---------------- */
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log("Server running on port", PORT);
  await mongoose.connect(uri);
  console.log("DB connected");
});