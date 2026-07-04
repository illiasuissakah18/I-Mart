/*
==========================================
I MART Marketplace
Seller Model
Version: 3.0 (Secure + Production Ready)
==========================================
*/

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
        required: true,
        minlength: 6,
        select: false // hides password when querying DB
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
    // MONTHLY BILLING SYSTEM
    // ===============================

    monthlyFee: {
        type: Number,
        default: 20 // GH₵
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
            const next = new Date();
            next.setMonth(next.getMonth() + 1);
            return next;
        }
    },

    gracePeriodDays: {
        type: Number,
        default: 7
    }

}, {
    timestamps: true
});


// ===============================
// HASH PASSWORD BEFORE SAVE
// ===============================
sellerSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});


// ===============================
// PASSWORD MATCH METHOD
// ===============================
sellerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Seller", sellerSchema);