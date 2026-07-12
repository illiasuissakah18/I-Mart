const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ===============================
// ADD PRODUCT TO CART
// ===============================
exports.addToCart = async (req, res) => {

    try {

        const userId = req.user.userId;

        const { productId, quantity } = req.body;
        const qty = Number(quantity) || 1;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        let cart = await Cart.findOne({
            user: userId
        });


        if (!cart) {

            cart = await Cart.create({

                user: userId,

                items: [
                    {
                        product: productId,
                        quantity: qty
                    }
                ]

            });

        } else {


            const existingItem = cart.items.find(

                item =>
                item.product.toString() === productId

            );


            if (existingItem) {

                existingItem.quantity += qty;

            } else {

                cart.items.push({

                    product: productId,
                    quantity: quantity || 1

                });

            }


            await cart.save();

        }


        res.status(200).json({

            success: true,
            message: "Product added to cart",
            cart

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success:false,
            message:"Cart error"

        });

    }

};



// ===============================
// GET CUSTOMER CART
// ===============================
exports.getCart = async (req,res)=>{

    try{

        const cart = await Cart.findOne({

            user:req.user.userId

        }).populate("items.product");


        res.json({

            success:true,
            cart

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// ===============================
// REMOVE FROM CART
// ===============================
exports.removeFromCart = async(req,res)=>{

    try{

        const cart = await Cart.findOne({

            user:req.user.userId

        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        cart.items = cart.items.filter(

            item =>
            item.product.toString() !== req.params.id

        );


        await cart.save();


        res.json({

            success:true,
            message:"Product removed",
            cart

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};