const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("./jobs/billingJob");

const connectDatabase = require("./config/database");

const app = express();

// Enforce proxy awareness in production
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

const requiredEnvVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "PAYSTACK_SECRET_KEY",
    "PAYSTACK_CALLBACK_URL"
];

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
    console.error("Missing required environment variables:", missingEnvVars.join(", "));
    process.exit(1);
}

// ===============================
// MIDDLEWARE
// ===============================
app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    : [
        "https://illiasuissakah18.github.io",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ];

app.use(cors({
    origin: allowedOrigins,
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE"
    ],
    credentials: true
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
    }
});

app.use("/api", apiLimiter);
app.use(express.json({
    limit: "10kb",
    verify: (req, res, buf) => {
        if (req.headers["content-type"]?.includes("application/json")) {
            req.rawBody = buf.toString();
        }
    }
}));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Test API Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "I MART Backend is running 🚀"
    });
});

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

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Server error."
            : err.message || "Internal server error."
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