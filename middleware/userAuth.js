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


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "imart_secret_key"
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