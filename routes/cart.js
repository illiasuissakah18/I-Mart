const express = require("express");
const router = express.Router();

const auth = require("../middleware/userAuth");

const {
    addToCart,
    getCart,
    removeFromCart
} = require("../controllers/cartController");


// Add product to customer cart
router.post("/add", auth, addToCart);


// View customer cart
router.get("/", auth, getCart);


// Remove product from cart
router.delete("/:id", auth, removeFromCart);


module.exports = router;