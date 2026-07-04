/*
==========================================
I MART Marketplace
Product Routes
Version: 2.0 (Image Upload Enabled)
==========================================
*/

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    addProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");


// ===============================
// ADD PRODUCT (WITH IMAGE UPLOAD)
// ===============================
router.post(
    "/add",
    auth,
    upload.single("image"),
    addProduct
);


// ===============================
// GET ALL PRODUCTS
// ===============================
router.get("/", getProducts);


// ===============================
// GET SINGLE PRODUCT
// ===============================
router.get("/:id", getSingleProduct);


// ===============================
// UPDATE PRODUCT (OPTIONAL AUTH)
// ===============================
router.put("/:id", auth, updateProduct);


// ===============================
// DELETE PRODUCT (PROTECTED)
// ===============================
router.delete("/:id", auth, deleteProduct);


module.exports = router;