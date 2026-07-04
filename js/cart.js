const API_URL = "https://illiasu-imart-api.onrender.com/api/cart";

// ===============================
// ADD TO CART
// ===============================
async function addToCart(productId) {

    const token = localStorage.getItem("sellerToken");

    if (!token) {
        alert("Please login first");
        return;
    }

    try {

        const res = await fetch(`${API_URL}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productId,
                quantity: 1
            })
        });

        const data = await res.json();

        if (data.success) {
            alert("Added to cart");
            loadCartCount();
        }

    } catch (error) {
        console.error(error);
    }
}

// ===============================
// LOAD CART COUNT
// ===============================
async function loadCartCount() {

    const token = localStorage.getItem("sellerToken");

    if (!token) return;

    try {

        const res = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (data.success) {

            const count = data.cart.length;

            const cartBadge = document.querySelector(".cart-count");

            if (cartBadge) {
                cartBadge.textContent = count;
            }
        }

    } catch (error) {
        console.error(error);
    }
}

// auto load cart
document.addEventListener("DOMContentLoaded", loadCartCount);