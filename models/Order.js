const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number,
            price: Number,
            seller: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seller"
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        default: "Pending"
    },

    status: {
        type: String,
        default: "Pending"
    },

    paymentReference: String

}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);