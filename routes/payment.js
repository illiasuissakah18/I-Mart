const express = require("express");
const router = express.Router();

const {
    verifyPayment
} = require("../controllers/paymentController");

// Verify Paystack payment
router.post("/verify", verifyPayment);

module.exports = router;