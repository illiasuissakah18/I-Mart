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

        const userId = req.user.userId;
        const { items, totalAmount, paymentStatus = "Pending", status = "Pending" } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item."
            });
        }

        const order = await Order.create({
            user: userId,
            items,
            totalAmount,
            paymentStatus,
            status
        });

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

            "items.seller": sellerId

        })
            .populate("user", "fullName")
            .populate("items.product", "name")
            .sort({

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

        const orderSeller = order.items.find(item => item.seller?.toString() === req.seller.sellerId);

        if (!orderSeller) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this order."
            });
        }

        order.status = req.body.orderStatus;

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