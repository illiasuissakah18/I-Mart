/*
==========================================
I MART Fashion Marketplace
File: products-data.js
Version: 2.0 SYNC SYSTEM
==========================================
*/

// ============================
// DEFAULT PRODUCTS
// ============================

const defaultProducts = [

{
    id: 1,
    name: "Premium Men's T-Shirt",
    category: "Men",
    brand: "Nike",
    price: 120,
    oldPrice: 160,
    rating: 4.8,
    reviews: 124,
    image: "images/products/product1.jpg",
    badge: "Sale"
},

{
    id: 2,
    name: "Elegant Ladies Dress",
    category: "Women",
    brand: "Zara",
    price: 240,
    oldPrice: 300,
    rating: 4.9,
    reviews: 86,
    image: "images/products/product2.jpg",
    badge: "New"
},

{
    id: 3,
    name: "Classic Sneakers",
    category: "Shoes",
    brand: "Adidas",
    price: 350,
    oldPrice: 420,
    rating: 4.7,
    reviews: 210,
    image: "images/products/product3.jpg",
    badge: "Hot"
}

];

// ============================
// GET ACTIVE PRODUCTS (SYNC)
// ============================

function getAllProducts() {

    const adminProducts = JSON.parse(localStorage.getItem("admin-products"));

    if (adminProducts && adminProducts.length > 0) {
        return adminProducts;
    }

    return defaultProducts;
}

// GLOBAL PRODUCT LIST
const products = getAllProducts();