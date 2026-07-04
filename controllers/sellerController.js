const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// REGISTER SELLER
// ===============================
exports.registerSeller = async (req, res) => {

    try {

        const {
            fullName,
            shopName,
            email,
            phone,
            password
        } = req.body;

        // Check if email already exists
        const existingSeller = await Seller.findOne({ email });

        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create seller
        const seller = await Seller.create({
            fullName,
            shopName,
            email,
            phone,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Seller registered successfully.",
            seller
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ===============================
// LOGIN SELLER
// ===============================
exports.loginSeller = async (req, res) => {

    try {

        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });

        if (!seller) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, seller.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
    {
        _id: seller._id,
        email: seller.email,
        shopName: seller.shopName,
        role: "seller"
    },
    process.env.JWT_SECRET || "imart_secret_key",
    {
        expiresIn: "7d"
    }
);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            seller: {
                id: seller._id,
                fullName: seller.fullName,
                shopName: seller.shopName,
                email: seller.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ===============================
// GET CURRENT SELLER
// ===============================

exports.getSellerProfile = async (req, res) => {

    try {

        const seller = await Seller.findById(req.seller._id)
            .select("-password");

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found."
            });
        }

        res.status(200).json({
            success: true,
            seller
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};