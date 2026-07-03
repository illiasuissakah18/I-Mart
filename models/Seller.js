/*
==========================================
I MART Marketplace
Seller Model
Version: 2.0
==========================================
*/

const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({

    // ===============================
    // SELLER INFORMATION
    // ===============================

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    shopName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    // ===============================
    // SUBSCRIPTION
    // ===============================

    subscription: {
        type: String,
        default: "Basic"
    },

    // ===============================
    // ACCOUNT STATUS
    // ===============================

    status: {
        type: String,
        enum: ["Active", "Suspended"],
        default: "Active"
    },

    // ===============================
    // MONTHLY BILLING
    // ===============================

    monthlyFee: {
        type: Number,
        default: 20 // Change to your preferred monthly fee (GH₵)
    },

    billingStatus: {
        type: String,
        enum: ["Paid", "Unpaid"],
        default: "Paid"
    },

    lastPaymentDate: {
        type: Date,
        default: Date.now
    },

    nextBillingDate: {
        type: Date,
        default: () => {
            const nextDate = new Date();
            nextDate.setMonth(nextDate.getMonth() + 1);
            return nextDate;
        }
    },

    gracePeriodDays: {
        type: Number,
        default: 7
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Seller", sellerSchema);