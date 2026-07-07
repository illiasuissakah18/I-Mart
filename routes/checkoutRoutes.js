const express = require("express");
const router = express.Router();

const userAuth = require("../middleware/userAuth");

const {
    checkout
} = require("../controllers/checkoutController");


// Create order from cart
router.post(
    "/",
    userAuth,
    checkout
);


module.exports = router;