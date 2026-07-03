/*
==========================================
I MART Marketplace
File: wishlist.js
Version: 2.0
Customer Wishlist System
==========================================
*/

// ============================
// CURRENT CUSTOMER
// ============================

function getCurrentCustomer() {

    return JSON.parse(
        localStorage.getItem("currentCustomer")
    );

}

// ============================
// WISHLIST KEY
// ============================

function getWishlistKey() {

    const customer = getCurrentCustomer();

    if (customer) {

        return `wishlist_${customer.id}`;

    }

    return "wishlist_guest";

}

// ============================
// GET WISHLIST
// ============================

function getWishlist() {

    return JSON.parse(
        localStorage.getItem(getWishlistKey())
    ) || [];

}

// ============================
// SAVE WISHLIST
// ============================

function saveWishlist(wishlist) {

    localStorage.setItem(
        getWishlistKey(),
        JSON.stringify(wishlist)
    );

}

// ============================
// ADD TO WISHLIST
// ============================

function addToWishlist(productId) {

    const product = products.find(
        p => p.id === productId
    );

    if (!product) {

        alert("Product not found.");

        return;

    }

    let wishlist = getWishlist();

    const exists = wishlist.find(
        item => item.id === productId
    );

    if (exists) {

        alert("This product is already in your wishlist.");

        return;

    }

    wishlist.push({

        ...product,

        addedAt: new Date().toLocaleString()

    });

    saveWishlist(wishlist);

    updateWishlistCount();

    alert(product.name + " added to your wishlist.");

}

// ============================
// REMOVE FROM WISHLIST
// ============================

function removeFromWishlist(productId) {

    let wishlist = getWishlist();

    wishlist = wishlist.filter(
        item => item.id !== productId
    );

    saveWishlist(wishlist);

    updateWishlistCount();

    if (typeof loadWishlist === "function") {

        loadWishlist();

    }

}

// ============================
// CLEAR WISHLIST
// ============================

function clearWishlist() {

    localStorage.removeItem(
        getWishlistKey()
    );

    updateWishlistCount();

    if (typeof loadWishlist === "function") {

        loadWishlist();

    }

}

// ============================
// CHECK PRODUCT
// ============================

function isInWishlist(productId) {

    const wishlist = getWishlist();

    return wishlist.some(
        item => item.id === productId
    );

}

// ============================
// WISHLIST COUNTER
// ============================

function updateWishlistCount() {

    const wishlist = getWishlist();

    const badge = document.querySelector(
        ".wishlist-count"
    );

    if (badge) {

        badge.textContent = wishlist.length;

    }

}

// ============================
// INIT
// ============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateWishlistCount();

    }
);

// ============================
// GLOBAL FUNCTIONS
// ============================

window.getWishlist = getWishlist;
window.saveWishlist = saveWishlist;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.clearWishlist = clearWishlist;
window.isInWishlist = isInWishlist;
window.updateWishlistCount = updateWishlistCount;