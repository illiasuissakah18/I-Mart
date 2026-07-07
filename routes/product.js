/*
==========================================
I MART Marketplace
Product Routes
Version: 3.0
==========================================
*/

const express = require("express");
const router = express.Router();

const auth = require("../middleware/sellerAuth");
const upload = require("../middleware/upload");

const {
    addProduct,
    getProducts,
    getSingleProduct,
    getSellerProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all marketplace products
router.get("/", getProducts);

// Get single product
router.get("/:id", getSingleProduct);

// ==========================================
// SELLER ROUTES
// ==========================================

// Add product
router.post(
    "/add",
    auth,
    upload.single("image"),
    addProduct
);

// Get logged-in seller products
router.get(
    "/seller/my-products",
    auth,
    getSellerProducts
);

// Update product
router.put(
    "/:id",
    auth,
    upload.single("image"),
    updateProduct
);

// Delete product
router.delete(
    "/:id",
    auth,
    deleteProduct
);

module.exports = router;