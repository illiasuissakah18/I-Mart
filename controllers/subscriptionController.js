const axios = require("axios");
const Seller = require("../models/Seller");

exports.initializeSubscription = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller.sellerId);

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
                amount: seller.monthlyFee * 100,
                currency: "GHS",
                metadata: {
                    sellerId: seller._id.toString(),
                    type: "subscription"
                },
                callback_url: process.env.PAYSTACK_CALLBACK_URL
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            authorization_url: response.data.data.authorization_url,
            reference: response.data.data.reference
        });
    } catch (error) {
        console.error("Initialize Subscription Error:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Subscription initialization failed."
        });
    }
};
