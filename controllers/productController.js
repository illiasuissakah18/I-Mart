const Product = require("../models/Product");
const Seller = require("../models/Seller");

// ===============================
// ADD PRODUCT
// ===============================
exports.addProduct = async (req, res) => {

    try {

        const seller = await Seller.findById(req.seller.sellerId);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found."
            });
        }

        const product = await Product.create({

            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,

            image: req.file
                ? `/uploads/products/${req.file.filename}`
                : "/uploads/products/default-product.png",

            stock: Number(req.body.stock),

            seller: seller._id,
            shopName: seller.shopName

        });

        res.status(201).json({

            success: true,
            message: "Product added successfully.",
            product

        });

    } catch (error) {

        console.error("❌ Add Product Error:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===============================
// GET ALL PRODUCTS
// ===============================
exports.getProducts = async (req, res) => {

    try {

        const products = await Product.find();

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        console.error("GET PRODUCTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ===============================
// GET SELLER PRODUCTS
// ===============================
exports.getSellerProducts = async (req, res) => {

    try {

        const products = await Product.find({

            seller: req.seller.sellerId

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,
            count: products.length,
            products

        });

    } catch (error) {

        console.error("❌ Seller Products Error:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===============================
// GET SINGLE PRODUCT
// ===============================
exports.getSingleProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id)
            .populate("seller", "shopName fullName");

        if (!product) {

            return res.status(404).json({

                success: false,
                message: "Product not found."

            });

        }

        res.status(200).json({

            success: true,
            product

        });

    } catch (error) {

        console.error("❌ Get Product Error:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===============================
// UPDATE PRODUCT
// ===============================
exports.updateProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                success: false,
                message: "Product not found."

            });

        }

        // Only owner can update
        if (product.seller.toString() !== req.seller.sellerId) {

            return res.status(403).json({

                success: false,
                message: "Unauthorized."

            });

        }

        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
        product.stock = req.body.stock || product.stock;

        if (req.file) {

            product.image = `/uploads/products/${req.file.filename}`;

        }

        await product.save();

        res.status(200).json({

            success: true,
            message: "Product updated successfully.",
            product

        });

    } catch (error) {

        console.error("❌ Update Product Error:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ===============================
// DELETE PRODUCT
// ===============================
exports.deleteProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                success: false,
                message: "Product not found."

            });

        }

        // Only owner can delete
        if (product.seller.toString() !== req.seller.sellerId) {

            return res.status(403).json({

                success: false,
                message: "Unauthorized."

            });

        }

        await product.deleteOne();

        res.status(200).json({

            success: true,
            message: "Product deleted successfully."

        });

    } catch (error) {

        console.error("❌ Delete Product Error:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};