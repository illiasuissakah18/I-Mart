const express = require("express");
const axios = require("axios");
const Seller = require("../models/Seller");

const router = express.Router();

// ===============================
// INITIALIZE SUBSCRIPTION PAYMENT
// ===============================
router.post("/initialize", async (req, res) => {

    try {

        const { sellerId } = req.body;

        const seller = await Seller.findById(sellerId);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: seller.email,
                amount: seller.monthlyFee * 100, // Paystack uses pesewas
                callback_url: "http://localhost:5000/api/subscription/verify"
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            success: true,
            authorization_url: response.data.data.authorization_url
        });

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({
            success: false,
            message: "Payment initialization failed."
        });

    }

});

// ===============================
// VERIFY PAYMENT
// ===============================
router.get("/verify", async (req, res) => {

    try {

        const reference = req.query.reference;

        const response = await axios.get(

            `https://api.paystack.co/transaction/verify/${reference}`,

            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

        );

        const payment = response.data.data;

        if (payment.status === "success") {

            const seller = await Seller.findOne({
                email: payment.customer.email
            });

            if (seller) {

                seller.billingStatus = "Paid";
                seller.status = "Active";

                seller.lastPaymentDate = new Date();

                const nextDate = new Date();
                nextDate.setMonth(nextDate.getMonth() + 1);

                seller.nextBillingDate = nextDate;

                await seller.save();

            }

            return res.send("Subscription payment successful.");

        }

        res.send("Payment verification failed.");

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).send("Verification failed.");

    }

});

module.exports = router;