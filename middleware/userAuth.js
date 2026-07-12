/*
==========================================
I MART Marketplace
Customer Authentication Middleware
==========================================
*/

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;


        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });

        }


        const token = authHeader.split(" ")[1];

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

        req.user = {
            userId: decoded.userId
        };

        next();


    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }

};