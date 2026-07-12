const { verifyPaystackSignature } = require("../utils/paystack");
const Seller = require("../models/Seller");

exports.verifySubscriptionWebhook = async (req, res) => {
    try {
        verifyPaystackSignature(req);

        const event = req.body.event;
        const paymentData = req.body.data;

        if (!paymentData || !paymentData.metadata) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook payload."
            });
        }

        if (event !== "charge.success") {
            return res.status(200).json({
                success: true,
                message: "Event ignored."
            });
        }

        if (paymentData.metadata.type !== "subscription") {
            return res.status(200).json({
                success: true,
                message: "Webhook event not for subscription."
            });
        }

        const sellerId = paymentData.metadata.sellerId;
        const seller = await Seller.findById(sellerId);

        if (!seller) {
            console.error("Verify Subscription Error: seller not found", sellerId);
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        if (seller.billingStatus === "Paid") {
            return res.status(200).json({
                success: true,
                message: "Seller subscription already updated.",
                seller
            });
        }

        seller.billingStatus = "Paid";
        seller.status = "Active";
        seller.lastPaymentDate = new Date();

        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 1);
        seller.nextBillingDate = nextDate;

        await seller.save();

        return res.status(200).json({
            success: true,
            message: "Subscription payment verified successfully.",
            seller
        });
    } catch (error) {
        console.error("Verify Subscription Error:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Subscription verification failed."
        });
    }
};
