// ===============================
// INITIALIZE PAYMENT
// ===============================
exports.initializePayment = async (req, res) => {
    try {

        const { orderId } = req.body;

        // Find order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Create Paystack payload
        const params = {
            email: req.body.email,
            amount: order.totalAmount * 100, // convert to pesewas
            currency: "GHS",
            metadata: {
                orderId: order._id.toString()
            },
            callback_url: process.env.PAYSTACK_CALLBACK_URL
        };

        // Call Paystack
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            params,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payment initialized",
            authorization_url: response.data.data.authorization_url,
            reference: response.data.data.reference
        });

    } catch (error) {
        console.error("Init Payment Error:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Payment initialization failed"
        });
    }
};
const axios = require("axios");
const Order = require("../models/Order");

// ===============================
// VERIFY PAYMENT
// ===============================
exports.verifyPayment = async (req, res) => {
    try {

        const { reference } = req.query;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message: "No payment reference provided"
            });
        }

        // Verify transaction with Paystack
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const paymentData = response.data.data;

        // Check payment status
        if (paymentData.status !== "success") {
            return res.status(400).json({
                success: false,
                message: "Payment not successful"
            });
        }

        // Get order ID from metadata
        const orderId = paymentData.metadata.orderId;

        const order = await Order.findById(orderId);

if (!order) {
    return res.status(404).json({
        success: false,
        message: "Order not found"
    });
}


// Check order ownership
if (order.user.toString() !== req.user.userId) {

    return res.status(403).json({
        success: false,
        message: "You cannot pay for this order"
    });

}

        // Prevent double updates
        if (order.paymentStatus === "Paid") {
            return res.status(200).json({
                success: true,
                message: "Order already paid",
                order
            });
        }

        // Update order
        order.paymentStatus = "Paid";
        order.status = "Processing";
        order.paymentReference = reference;

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order
        });

    } catch (error) {
        console.error("Verify Payment Error:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};