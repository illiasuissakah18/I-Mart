/*
==========================================
I MART Marketplace
Authentication Middleware
Version 6.0
==========================================
*/

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        // Check Authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });

        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server misconfiguration: JWT secret missing."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Save seller info to request
        req.seller = {
            sellerId: decoded.sellerId
        };

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }

};