const express = require("express");
const router = express.Router();

const auth = require("../middleware/sellerAuth");

const {
    registerSeller,
    loginSeller,
    getSellerProfile,
    getSellerStats
} = require("../controllers/sellerController");

// ===============================
// PUBLIC ROUTES
// ===============================

// Register Seller
router.post("/register", registerSeller);

// Login Seller
router.post("/login", loginSeller);

// ===============================
// PROTECTED ROUTES
// ===============================

// Get Logged-in Seller Profile
router.get("/profile", auth, getSellerProfile);

// Get seller dashboard stats
router.get("/stats", auth, getSellerStats);

module.exports = router;