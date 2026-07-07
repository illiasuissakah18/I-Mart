const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    role: {
        type: String,
        default: "customer"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);