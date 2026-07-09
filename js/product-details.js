/*
==========================================
I MART Marketplace
Product Details
Version: 1.0
==========================================
*/

const API_URL = "https://i-mart-backend.onrender.com/api/products";

// Get Product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Load Product
async function loadProduct() {

    if (!productId) {

        document.querySelector(".product-details").innerHTML =
            "<h2>Product not found.</h2>";

        return;

    }

    try {

        const response = await fetch(`${API_URL}/${productId}`);

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const product = data.product;

        document.getElementById("productImage").src =
            "https://i-mart-backend.onrender.com" + product.image;

        document.getElementById("productName").textContent =
            product.name;

        document.getElementById("productPrice").textContent =
            "GH₵" + product.price;

        document.getElementById("productDescription").textContent =
            product.description;

        document.getElementById("productCategory").textContent =
            product.category;

        document.getElementById("productStock").textContent =
            product.stock;

        document.getElementById("shopName").textContent =
            product.shopName || product.seller?.shopName || "Unknown Seller";

        // Add To Cart
        document.getElementById("addCartBtn").onclick = () => {

            addToCart(product);

        };

        // Wishlist
        document.getElementById("wishlistBtn").onclick = () => {

            addToWishlist(product);

        };

    } catch (error) {

        console.error(error);

        alert("Unable to load product.");

    }

}

// ===============================
// ADD TO CART
// ===============================

function addToCart(product) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item._id === product._id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("✅ Product added to cart.");

}

// ===============================
// ADD TO WISHLIST
// ===============================

function addToWishlist(product) {

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.find(item => item._id === product._id);

    if (exists) {

        alert("Already in wishlist.");

        return;

    }

    wishlist.push(product);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    alert("❤️ Added to wishlist.");

}

// Load
loadProduct();