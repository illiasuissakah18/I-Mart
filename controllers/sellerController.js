const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const Order = require("../models/Order");

const generateToken = (sellerId) => jwt.sign({ sellerId }, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.registerSeller = async (req, res) => {
    try {
        const { fullName, shopName, email, phone, password } = req.body;
        if (!fullName || !shopName || !email || !phone || !password) return res.status(400).json({ success:false, message:"Please fill in all fields." });
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) return res.status(400).json({ success:false, message:"Email already registered." });
        const seller = await Seller.create({ fullName, shopName, email, phone, password });
        res.status(201).json({ success:true, message:"Seller registered successfully.", token:generateToken(seller._id), seller:{ id:seller._id, fullName:seller.fullName, shopName:seller.shopName, email:seller.email, phone:seller.phone, subscription:seller.subscription, status:seller.status } });
    } catch (error) { console.error(error); res.status(500).json({ success:false, message:"Server Error." }); }
};

exports.loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Seller.findOne({ email }).select("+password");
        if (!seller) return res.status(401).json({ success:false, message:"Invalid email or password." });
        const match = await bcrypt.compare(password, seller.password);
        if (!match) return res.status(401).json({ success:false, message:"Invalid email or password." });
        res.json({ success:true, token:generateToken(seller._id), seller:{ id:seller._id, fullName:seller.fullName, shopName:seller.shopName, email:seller.email, phone:seller.phone, subscription:seller.subscription, status:seller.status, monthlyFee:seller.monthlyFee, billingStatus:seller.billingStatus, lastPaymentDate:seller.lastPaymentDate, nextBillingDate:seller.nextBillingDate } });
    } catch (error) { console.error(error); res.status(500).json({ success:false, message:"Server Error." }); }
};

exports.getSellerProfile = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller.sellerId);
        if (!seller) return res.status(404).json({ success:false, message:"Seller not found." });
        res.json({ success:true, seller });
    } catch (error) { console.error(error); res.status(500).json({ success:false, message:"Server Error." }); }
};

exports.updateSellerProfile = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller.sellerId);
        if (!seller) return res.status(404).json({ success:false, message:"Seller not found." });
        const { fullName, shopName, email, phone } = req.body;
        if (!fullName || !shopName || !email || !phone) return res.status(400).json({ success:false, message:"Full name, shop name, email and phone are required." });
        const normalizedEmail = email.trim().toLowerCase();
        const duplicate = await Seller.findOne({ email:normalizedEmail, _id:{ $ne:seller._id } });
        if (duplicate) return res.status(409).json({ success:false, message:"That email is already registered to another seller." });
        seller.fullName = fullName.trim(); seller.shopName = shopName.trim(); seller.email = normalizedEmail; seller.phone = phone.trim();
        await seller.save();
        res.json({ success:true, message:"Seller profile updated successfully.", seller });
    } catch (error) { console.error("Update Seller Profile Error:", error); res.status(500).json({ success:false, message:"Unable to update seller profile." }); }
};

exports.getSellerStats = async (req, res) => {
    try {
        const sellerId = req.seller.sellerId;
        const productsCount = await Product.countDocuments({ seller:sellerId });
        const orders = await Order.find({ "items.seller":sellerId });
        let totalRevenue = 0, pendingOrders = 0;
        orders.forEach(order => {
            let hasSellerItem = false;
            order.items.forEach(item => { if (item.seller && item.seller.toString() === sellerId.toString()) { hasSellerItem=true; totalRevenue += (item.price||0)*(item.quantity||0); } });
            if (hasSellerItem && order.status === "Pending") pendingOrders += 1;
        });
        res.json({ success:true, stats:{ productsCount, ordersCount:orders.length, totalRevenue, pendingOrders } });
    } catch (error) { console.error("Get Seller Stats Error:", error); res.status(500).json({ success:false, message:"Server Error." }); }
};
