/*
==========================================
I MART Marketplace
Order Controller
Version: 1.0
==========================================
*/

const Order = require("../models/Order");

// ===============================
// GET ALL ORDERS
// ===============================
exports.getOrders = async (req, res) => {

    try {

        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,
            count: orders.length,
            orders

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};