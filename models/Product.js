const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    // Product Name
    name: {
        type: String,
        required: true,
        trim: true
    },

    // Product Description
    description: {
        type: String,
        required: true,
        trim: true
    },

    // Product Price
    price: {
        type: Number,
        required: true,
        min: 0
    },

    // Product Category
    category: {
        type: String,
        required: true,
        trim: true
    },

    // Product Image
    image: {
        type: String,
        default: "default-product.png"
    },

    // Available Stock
    stock: {
        type: Number,
        default: 0,
        min: 0
    },

    // Seller ID
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },

    // Shop Name
    shopName: {
        type: String,
        required: true,
        trim: true
    },

    // Product Status
    status: {
        type: String,
        enum: ["Active", "Out of Stock", "Hidden"],
        default: "Active"
    },

    // Total Sales
    totalSales: {
        type: Number,
        default: 0
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Product", productSchema);