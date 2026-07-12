const express = require("express");
const router = express.Router();

const auth = require("../middleware/sellerAuth");
const userAuth = require("../middleware/userAuth");

const {
    createOrder,
    getSellerOrders,
    updateOrderStatus
} = require("../controllers/orderController");

// Customer places an order
router.post("/", userAuth, createOrder);

// Seller views all orders
router.get("/seller", auth, getSellerOrders);

// Seller updates order status
router.put("/:id", auth, updateOrderStatus);

module.exports = router;