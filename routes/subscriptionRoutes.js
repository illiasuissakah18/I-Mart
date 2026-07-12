const express = require("express");
const sellerAuth = require("../middleware/sellerAuth");
const {
    initializeSubscription
} = require("../controllers/subscriptionController");
const {
    verifySubscriptionWebhook
} = require("../controllers/subscriptionWebhookController");

const router = express.Router();

// ===============================
// INITIALIZE SUBSCRIPTION PAYMENT
// ===============================
router.post(
    "/initialize",
    sellerAuth,
    initializeSubscription
);

// ===============================
// PAYSTACK SUBSCRIPTION WEBHOOK
// ===============================
router.post(
    "/webhook",
    verifySubscriptionWebhook
);

module.exports = router;
