const Cart = require("../models/Cart");
const Order = require("../models/Order");


// ===============================
// CREATE ORDER FROM CUSTOMER CART
// ===============================
exports.checkout = async (req, res) => {

    try {

        const userId = req.user.userId;


        const cart = await Cart.findOne({
            user: userId
        }).populate("items.product");


        if (!cart || cart.items.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });

        }


        let totalAmount = 0;


        const orderItems = cart.items.map(item => {


            totalAmount += item.product.price * item.quantity;


            return {

                product: item.product._id,

                quantity: item.quantity,

                price: item.product.price,

                seller: item.product.seller

            };


        });



        const order = await Order.create({

            user: userId,

            items: orderItems,

            totalAmount,

            paymentStatus: "Pending",

            status: "Pending"

        });



        // Clear cart after creating order

        cart.items = [];

        await cart.save();



        res.status(201).json({

            success: true,

            message: "Order created successfully",

            order

        });



    } catch (error) {


        console.error("Checkout Error:", error);


        res.status(500).json({

            success: false,

            message: "Checkout failed"

        });


    }

};