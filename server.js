const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./jobs/billingJob");

const connectDatabase = require("./config/database");

const app = express();

// ===============================
// DATABASE CONNECTION
// ===============================
connectDatabase();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors({
    origin: [
        "https://illiasuissakah18.github.io",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (product images)
app.use("/uploads", express.static("uploads"));

// ===============================
// ROUTES
// ===============================
const paymentRoutes = require("./routes/payment");
const productRoutes = require("./routes/product");
const sellerRoutes = require("./routes/seller");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const checkoutRoutes = require("./routes/checkoutRoutes");
const userRoutes = require("./routes/user");

// ===============================
// HOME ROUTE
// ===============================
app.get("/", (req, res) => {
    res.send("🚀 I MART Server is Running Successfully");
});

// ===============================
// API ROUTE MIDDLEWARE
// ===============================
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/users", userRoutes);

// ===============================
// ERROR HANDLING (optional but good)
// ===============================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

async function startServer() {

    try {

        await connectDatabase();

        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error("Server failed to start:", error.message);
        process.exit(1);

    }

}

startServer();