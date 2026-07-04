const Cart = require("../models/Cart");

// ===============================
// ADD TO CART
// ===============================
exports.addToCart = async (req, res) => {

    try {

        const { productId, quantity } = req.body;

        const userId = req.seller._id;

        const existingItem = await Cart.findOne({ userId, productId });

        if (existingItem) {

            existingItem.quantity += quantity || 1;
            await existingItem.save();

            return res.json({
                success: true,
                message: "Cart updated"
            });
        }

        const cartItem = await Cart.create({
            userId,
            productId,
            quantity: quantity || 1
        });

        res.json({
            success: true,
            message: "Added to cart",
            cartItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// GET CART ITEMS
// ===============================
exports.getCart = async (req, res) => {

    try {

        const userId = req.seller._id;

        const cart = await Cart.find({ userId })
            .populate("productId");

        res.json({
            success: true,
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// REMOVE FROM CART
// ===============================
exports.removeFromCart = async (req, res) => {

    try {

        const { id } = req.params;

        await Cart.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Removed from cart"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};