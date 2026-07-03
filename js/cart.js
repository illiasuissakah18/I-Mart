/*
==========================================
I MART Marketplace
File: cart.js
Version: 3.0
Customer Cart System
==========================================
*/

// ============================
// CURRENT CUSTOMER
// ============================

function getCurrentCustomer() {
    return JSON.parse(localStorage.getItem("currentCustomer"));
}

// ============================
// CART KEY
// ============================

function getCartKey() {

    const customer = getCurrentCustomer();

    if (customer) {
        return `cart_${customer.id}`;
    }

    return "cart_guest";
}

// ============================
// GET CART
// ============================

function getCart() {

    return JSON.parse(
        localStorage.getItem(getCartKey())
    ) || [];

}

// ============================
// SAVE CART
// ============================

function saveCart(cart) {

    localStorage.setItem(
        getCartKey(),
        JSON.stringify(cart)
    );

}

// ============================
// ADD TO CART
// ============================

function addToCart(productId) {

    const product = products.find(
        p => p.id === productId
    );

    if (!product) {

        alert("Product not found.");

        return;

    }

    let cart = getCart();

    const existing = cart.find(
        item => item.id === productId
    );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }

    saveCart(cart);

    updateCartCount();

    alert(product.name + " added to cart.");

}

// ============================
// REMOVE ITEM
// ============================

function removeFromCart(productId) {

    let cart = getCart();

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart(cart);

    updateCartCount();

}

// ============================
// CHANGE QUANTITY
// ============================

function increaseQuantity(productId) {

    const cart = getCart();

    const item = cart.find(
        p => p.id === productId
    );

    if (!item) return;

    item.quantity++;

    saveCart(cart);

    updateCartCount();

    if (typeof loadCart === "function") {

        loadCart();

    }

}

function decreaseQuantity(productId) {

    const cart = getCart();

    const item = cart.find(
        p => p.id === productId
    );

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }

    saveCart(cart);

    updateCartCount();

    if (typeof loadCart === "function") {

        loadCart();

    }

}

// ============================
// CLEAR CART
// ============================

function clearCart() {

    localStorage.removeItem(
        getCartKey()
    );

    updateCartCount();

}

// ============================
// CART COUNT
// ============================

function updateCartCount() {

    const cart = getCart();

    const total = cart.reduce(

        (sum, item) => sum + item.quantity,

        0

    );

    const badge = document.querySelector(".cart-count");

    if (badge) {

        badge.textContent = total;

    }

}

// ============================
// INIT
// ============================

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    if (typeof loadOrderSummary === "function") {
        loadOrderSummary();
    }

});

// ============================
// GLOBAL FUNCTIONS
// ============================

window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.clearCart = clearCart;
window.updateCartCount = updateCartCount;
// ============================
// GO TO CHECKOUT
// ============================

function goToCheckout() {

    const cart = getCart();

    if (!cart || cart.length === 0) {
        alert("Your cart is empty 🛒");
        return;
    }

    window.location.href = "checkout.html";
}

// expose globally
window.goToCheckout = goToCheckout;