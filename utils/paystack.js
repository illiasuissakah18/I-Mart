const crypto = require("crypto");

const verifyPaystackSignature = (req) => {
    const signature = req.headers["x-paystack-signature"] || req.headers["paystack-signature"];

    if (!signature) {
        throw new Error("Paystack signature header missing.");
    }

    const rawBody = req.rawBody || JSON.stringify(req.body);
    const expectedSignature = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(rawBody)
        .digest("hex");

    if (signature !== expectedSignature) {
        throw new Error("Invalid Paystack signature.");
    }
};

module.exports = {
    verifyPaystackSignature
};
