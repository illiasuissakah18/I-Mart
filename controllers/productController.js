const Product = require("../models/Product");
const Seller = require("../models/Seller");

exports.addProduct = async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller.sellerId);
        if (!seller) return res.status(404).json({ success:false, message:"Seller not found." });
        const product = await Product.create({ name:req.body.name, description:req.body.description, price:Number(req.body.price), category:req.body.category, image:req.file ? `/uploads/products/${req.file.filename}` : "/uploads/products/default-product.png", stock:Number(req.body.stock), seller:seller._id, shopName:seller.shopName });
        res.status(201).json({ success:true, message:"Product added successfully.", product });
    } catch (error) { console.error("❌ Add Product Error:", error); res.status(500).json({ success:false, message:error.message }); }
};

exports.getProducts = async (req, res) => {
    try { const products = await Product.find(); res.status(200).json({ success:true, count:products.length, products }); }
    catch (error) { console.error("GET PRODUCTS ERROR:", error); res.status(500).json({ success:false, message:error.message }); }
};

exports.getSellerProducts = async (req, res) => {
    try { const products = await Product.find({ seller:req.seller.sellerId }).sort({ createdAt:-1 }); res.status(200).json({ success:true, count:products.length, products }); }
    catch (error) { console.error("❌ Seller Products Error:", error); res.status(500).json({ success:false, message:error.message }); }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller", "shopName fullName");
        if (!product) return res.status(404).json({ success:false, message:"Product not found." });
        res.status(200).json({ success:true, product });
    } catch (error) { console.error("❌ Get Product Error:", error); res.status(500).json({ success:false, message:error.message }); }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success:false, message:"Product not found." });
        if (product.seller.toString() !== req.seller.sellerId.toString()) return res.status(403).json({ success:false, message:"Unauthorized." });
        if (req.body.name !== undefined) product.name = req.body.name;
        if (req.body.description !== undefined) product.description = req.body.description;
        if (req.body.category !== undefined) product.category = req.body.category;
        if (req.body.price !== undefined) product.price = Number(req.body.price);
        if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
        if (req.body.status !== undefined) {
            const allowedStatuses = ["Active", "Out of Stock", "Hidden"];
            if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ success:false, message:"Invalid product status." });
            product.status = req.body.status;
        }
        if (req.file) product.image = `/uploads/products/${req.file.filename}`;
        if (product.stock <= 0 && req.body.status === undefined) product.status = "Out of Stock";
        if (product.stock > 0 && product.status === "Out of Stock" && req.body.status === undefined) product.status = "Active";
        await product.save();
        res.status(200).json({ success:true, message:"Product updated successfully.", product });
    } catch (error) { console.error("❌ Update Product Error:", error); res.status(500).json({ success:false, message:error.message }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success:false, message:"Product not found." });
        if (product.seller.toString() !== req.seller.sellerId.toString()) return res.status(403).json({ success:false, message:"Unauthorized." });
        await product.deleteOne();
        res.status(200).json({ success:true, message:"Product deleted successfully." });
    } catch (error) { console.error("❌ Delete Product Error:", error); res.status(500).json({ success:false, message:error.message }); }
};
