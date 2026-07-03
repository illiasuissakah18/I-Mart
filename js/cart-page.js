/*
==========================================
I MART Fashion Marketplace
File: cart-page.js
Version: 1.0
Milestone: CART PAGE
==========================================
*/

// ============================
// LOAD CART PAGE
// ============================

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    updateCartCount();
});

// ============================
// RENDER CART
// ============================

function renderCart() {

    const container = document.getElementById("cart-container");

    let cart = getCart();

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty</p>";
        document.getElementById("cart-total").innerText = "0";
        return;
    }

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}" width="80">

                <div>
                    <h4>${item.name}</h4>
                    <p>GH₵ ${item.price}</p>

                    <div>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>

                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </div>

            </div>
        `;
    });

    document.getElementById("cart-total").innerText = total;
}

// ============================
// RELOAD CART AFTER CHANGES
// ============================

function refreshCart() {
    renderCart();
}

// Hook into existing cart updates
window.removeFromCart = function(id) {
    let cart = getCart().filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
};

window.updateQuantity = function(id, qty) {

    let cart = getCart();

    let item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity = qty;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
    updateCartCount();
};