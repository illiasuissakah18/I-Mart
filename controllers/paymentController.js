/*
==========================================
I MART Marketplace
Payment Controller
Version: 1.0
==========================================
*/

const axios = require("axios");
const Order = require("../models/Order");

// ===============================
// VERIFY PAYSTACK PAYMENT
// ===============================
exports.verifyPayment = async (req, res) => {

    try {

        const { reference, order } = req.body;

        if (!reference || !order) {

            return res.status(400).json({

                success: false,
                message: "Missing payment reference."

            });

        }

        // Verify payment with Paystack
        const response = await axios.get(

            `https://api.paystack.co/transaction/verify/${reference}`,

            {

                headers: {

                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`

                }

            }

        );

        const payment = response.data.data;

        if (payment.status !== "success") {

            return res.status(400).json({

                success: false,
                message: "Payment verification failed."

            });

        }

        // Prevent duplicate orders
        const existingOrder = await Order.findOne({

            paymentReference: reference

        });

        if (existingOrder) {

            return res.json({

                success: true,
                message: "Order already exists."

            });

        }

        // Save Order
        const newOrder = await Order.create({

            customer: order.customer,

            products: order.products,

            total: order.total,

            paymentReference: reference,

            paymentStatus: "Paid",

            orderStatus: "Processing"

        });

        res.status(200).json({

            success: true,
            message: "Payment verified successfully.",

            order: newOrder

        });

    } catch (error) {

        console.error("❌ Payment Verification Error");

        console.error(error.response?.data || error.message);

        res.status(500).json({

            success: false,

            message: "Payment verification failed."

        });

    }

};