/*
==========================================
I MART Marketplace
Order Model
Version: 1.0
==========================================
*/

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    customer: {

        fullName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        }

    },

    products: [

        {

            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            seller: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seller"
            },

            name: String,

            image: String,

            quantity: Number,

            price: Number

        }

    ],

    total: {

        type: Number,
        required: true

    },

    paymentReference: {

        type: String,
        required: true,
        unique: true

    },

    paymentStatus: {

        type: String,

        enum: ["Pending", "Paid", "Failed"],

        default: "Pending"

    },

    orderStatus: {

        type: String,

        enum: [

            "Processing",

            "Confirmed",

            "Shipped",

            "Delivered",

            "Cancelled"

        ],

        default: "Processing"

    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Order", orderSchema);