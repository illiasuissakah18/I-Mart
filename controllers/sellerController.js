/*
==========================================
I MART Marketplace
Seller Controller
Version 6.0
==========================================
*/

const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// GENERATE JWT TOKEN
// ===============================
const generateToken = (sellerId) => {
    return jwt.sign(
        { sellerId },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

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

        // Validate required fields
        if (
            !fullName ||
            !shopName ||
            !email ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        // Check existing seller
        const existingSeller = await Seller.findOne({ email });

        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Create seller
        const seller = await Seller.create({
            fullName,
            shopName,
            email,
            phone,
            password
        });

        res.status(201).json({
            success: true,
            message: "Seller registered successfully.",
            token: generateToken(seller._id),
            seller: {
                id: seller._id,
                fullName: seller.fullName,
                shopName: seller.shopName,
                email: seller.email,
                phone: seller.phone,
                subscription: seller.subscription,
                status: seller.status
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error."
        });

    }

};

// ===============================
// LOGIN SELLER
// ===============================
exports.loginSeller = async (req, res) => {

    try {

        const { email, password } = req.body;

        const seller = await Seller
            .findOne({ email })
            .select("+password");

        if (!seller) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const match = await bcrypt.compare(
            password,
            seller.password
        );

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        res.json({
            success: true,
            token: generateToken(seller._id),
            seller: {
                id: seller._id,
                fullName: seller.fullName,
                shopName: seller.shopName,
                email: seller.email,
                phone: seller.phone,
                subscription: seller.subscription,
                status: seller.status,
                monthlyFee: seller.monthlyFee,
                billingStatus: seller.billingStatus,
                nextBillingDate: seller.nextBillingDate
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error."
        });

    }

};

// ===============================
// GET SELLER PROFILE
// ===============================
exports.getSellerProfile = async (req, res) => {

    try {

        const seller = await Seller.findById(req.seller.sellerId);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found."
            });
        }

        res.json({
            success: true,
            seller
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error."
        });

    }

};