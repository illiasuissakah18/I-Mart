require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./jobs/billingJob");

const connectDatabase = require("./config/database");

// Routes
const paymentRoutes = require("./routes/payment");
const productRoutes = require("./routes/product");
const sellerRoutes = require("./routes/seller");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const app = express();

// Connect Database
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Home Route
app.get("/", (req, res) => {
    res.send("I MART Server is Running 🚀");
});

// API Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});