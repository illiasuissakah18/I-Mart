const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    addProduct,
    getProducts,
    getSingleProduct,
    getSellerProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// ====================================
// PUBLIC ROUTES
// ====================================

// Get all marketplace products
router.get("/", getProducts);

// Get all products belonging to the logged-in seller
router.get("/seller/my-products", auth, getSellerProducts);

// Get one product
router.get("/:id", getSingleProduct);

// ====================================
// PROTECTED SELLER ROUTES
// ====================================

// Add product with image upload
router.post(
    "/add",
    auth,
    upload.single("image"),
    addProduct
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