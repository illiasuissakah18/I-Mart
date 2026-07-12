const express = require("express");
const router = express.Router();

const {
    initializePayment,
    verifyPayment
} = require("../controllers/paymentController");

const userAuth = require("../middleware/userAuth");


// ===============================
// INITIALIZE PAYMENT
// Customer must be logged in
// ===============================
router.post(
    "/initialize",
    userAuth,
    initializePayment
);


// ===============================
// PAYSTACK WEBHOOK
// Public webhook endpoint, signed by Paystack
// ===============================
router.post(
    "/webhook",
    verifyPayment
);


module.exports = router;