const express = require("express");
const router = express.Router();

const auth = require("../middleware/sellerAuth");

const {
    registerSeller,
    loginSeller,
    getSellerProfile
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

module.exports = router;