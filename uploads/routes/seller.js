const express = require("express");

const router = express.Router();

const {
    registerSeller,
    loginSeller
} = require("../controllers/sellerController");

// ===============================
// SELLER ROUTES
// ===============================

// Register Seller
router.post("/register", registerSeller);

// Login Seller
router.post("/login", loginSeller);

module.exports = router;