/*
==========================================
I MART Marketplace
Customer Routes
==========================================
*/

const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/userController");


// ===============================
// CUSTOMER REGISTER
// ===============================
router.post(
    "/register",
    registerUser
);


// ===============================
// CUSTOMER LOGIN
// ===============================
router.post(
    "/login",
    loginUser
);


module.exports = router;