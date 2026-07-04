/*
==========================================
I MART Marketplace
Order Controller
Version: 2.0
==========================================
*/

const Order = require("../models/Order");

// ===============================
// CREATE ORDER
// ===============================
exports.createOrder = async (req, res) => {

    try {

        const order = await Order.create(req.body);

        res.status(201).json({

            success: true,
            message: "Order created successfully.",
            order

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
// GET SELLER ORDERS
// ===============================
exports.getSellerOrders = async (req, res) => {

    try {

        const sellerId = req.seller.sellerId;

        const orders = await Order.find({

            "products.seller": sellerId

        }).sort({

            createdAt: -1

        });

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

// ===============================
// UPDATE ORDER STATUS
// ===============================
exports.updateOrderStatus = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,
                message: "Order not found."

            });

        }

        order.orderStatus = req.body.orderStatus;

        await order.save();

        res.status(200).json({

            success: true,
            message: "Order updated successfully.",
            order

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};