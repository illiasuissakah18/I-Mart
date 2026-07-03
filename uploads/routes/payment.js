/*
==========================================
I MART Marketplace
routes/payment.js
Version: CLEAN FIXED
==========================================
*/

const express = require("express");
const axios = require("axios");

const router = express.Router();

// ======================================
// INITIATE PAYMENT
// ======================================

router.post("/pay", async (req, res) => {

    const {

        customerName,
        phone,
        amount,
        description

    } = req.body;

    try {

        // ===============================
        // HUBTEL PAYMENT REQUEST (SANDBOX)
        // ===============================

        const paymentData = {

            totalAmount: amount,

            description: description || "I MART Purchase",

            callbackUrl: process.env.CALLBACK_URL,

            returnUrl: "http://localhost:5500/order-success.html",

            cancellationUrl: "http://localhost:5500/checkout.html",

            merchantAccountNumber:
                process.env.HUBTEL_MERCHANT_ACCOUNT,

            clientReference:
                "IM" + Date.now(),

            customerName: customerName,

            customerMsisdn: phone

        };

        // ===============================
        // SEND REQUEST TO HUBTEL
        // ===============================

        const response = await axios.post(

            `${process.env.HUBTEL_BASE_URL}/items/initiate`,

            paymentData,

            {

                auth: {

                    username:
                        process.env.HUBTEL_CLIENT_ID,

                    password:
                        process.env.HUBTEL_CLIENT_SECRET

                },

                headers: {

                    "Content-Type": "application/json"

                }

            }

        );

        // ===============================
        // RETURN RESPONSE TO FRONTEND
        // ===============================

        res.json({

            success: true,

            payment: response.data

        });

    } catch (error) {

        console.error(
            "Payment Error:",
            error.response?.data || error.message
        );

        res.status(500).json({

            success: false,

            message: "Payment initialization failed"

        });

    }

});

// ======================================
// CALLBACK (HUBTEL NOTIFICATION)
// ======================================

router.post("/callback", (req, res) => {

    console.log(
        "Payment Callback Received:",
        req.body
    );

    // Later we will:
    // ✔ verify payment
    // ✔ update order status
    // ✔ notify seller

    res.sendStatus(200);
});

// ======================================
// STATUS CHECK
// ======================================

router.get("/status/:reference", (req, res) => {

    res.json({

        success: true,

        reference: req.params.reference,

        status: "Pending"

    });

});

module.exports = router;