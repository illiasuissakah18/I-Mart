/*
==========================================
I MART Fashion Marketplace
File: wishlist-page.js
Version: 1.0
Milestone: WISHLIST PAGE
==========================================
*/

// ============================
// LOAD PAGE
// ============================

document.addEventListener("DOMContentLoaded", () => {
    renderWishlist();
    updateWishlistCount();
});

// ============================
// RENDER WISHLIST
// ============================

function renderWishlist() {

    const container = document.getElementById("wishlist-container");

    let wishlist = getWishlist();

    container.innerHTML = "";

    if (wishlist.length === 0) {
        container.innerHTML = "<p>Your wishlist is empty ❤️</p>";
        return;
    }

    wishlist.forEach(item => {

        container.innerHTML += `
            <div class="wishlist-item">

                <img src="${item.image}" width="80">

                <div>
                    <h4>${item.name}</h4>
                    <p>GH₵ ${item.price}</p>

                    <button onclick="moveToCart(${item.id})">Add to Cart 🛒</button>
                    <button onclick="removeFromWishlist(${item.id})">Remove ❤️</button>
                </div>

            </div>
        `;
    });
}

// ============================
// MOVE TO CART
// ============================

function moveToCart(productId) {

    let wishlist = getWishlist();

    let item = wishlist.find(p => p.id === productId);

    if (!item) return;

    // Add to cart
    let cart = getCart();

    let existing = cart.find(p => p.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Remove from wishlist
    wishlist = wishlist.filter(p => p.id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    renderWishlist();
    updateCartCount();
    updateWishlistCount();
}

// ============================
// REMOVE ITEM
// ============================

function removeFromWishlist(productId) {

    let wishlist = getWishlist();

    wishlist = wishlist.filter(item => item.id !== productId);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    renderWishlist();
    updateWishlistCount();
}