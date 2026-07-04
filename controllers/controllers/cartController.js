/*
==========================================
I MART Marketplace
Cart Controller
Version: 1.0
==========================================
*/

const Cart = require("../models/Cart");

// ===============================
// ADD PRODUCT TO CART
// ===============================
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const userId = req.seller._id;

        let cartItem = await Cart.findOne({
            userId,
            productId
        });

        if (cartItem) {
            cartItem.quantity += quantity || 1;
            await cartItem.save();

            return res.status(200).json({
                success: true,
                message: "Cart updated successfully.",
                cartItem
            });
        }

        cartItem = await Cart.create({
            userId,
            productId,
            quantity: quantity || 1
        });

        res.status(201).json({
            success: true,
            message: "Product added to cart.",
            cartItem
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};


// ===============================
// GET USER CART
// ===============================
exports.getCart = async (req, res) => {

    try {

        const userId = req.seller._id;

        const cart = await Cart.find({ userId })
            .populate("productId");

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }

};


// ===============================
// REMOVE ITEM FROM CART
// ===============================
exports.removeFromCart = async (req, res) => {

    try {

        await Cart.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Item removed from cart."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }

};