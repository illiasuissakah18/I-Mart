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
// VERIFY PAYMENT
// Paystack callback
// ===============================
router.get(
    "/verify",
    verifyPayment
);


module.exports = router;