/*
==========================================
I MART Marketplace
Shopping Cart
Version: 3.0
==========================================
*/

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cartItems");
const totalElement = document.getElementById("cartTotal");

// ===============================
// DISPLAY CART
// ===============================
function displayCart() {

    if (!cartContainer) return;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Start shopping and add products.</p>
                <a href="products.html" class="btn">
                    Continue Shopping
                </a>
            </div>
        `;

        if (totalElement) {
            totalElement.textContent = "GH₵0.00";
        }

        return;
    }

    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach((product, index) => {

        const subtotal = product.price * product.quantity;

        total += subtotal;

        const imageUrl = product.image.startsWith("http")
            ? product.image
            : `https://illiasu-imart-api.onrender.com${product.image}`;

        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `

            <img src="${imageUrl}" alt="${product.name}">

            <div class="cart-info">

                <h3>${product.name}</h3>

                <p>GH₵${product.price.toFixed(2)}</p>

                <p>Seller: ${product.shopName || "I MART Seller"}</p>

                <div class="quantity-controls">

                    <button onclick="decreaseQuantity(${index})">−</button>

                    <span>${product.quantity}</span>

                    <button onclick="increaseQuantity(${index})">+</button>

                </div>

                <h4>Subtotal: GH₵${subtotal.toFixed(2)}</h4>

                <button
                    class="remove-btn"
                    onclick="removeItem(${index})">

                    Remove

                </button>

            </div>

        `;

        cartContainer.appendChild(item);

    });

    if (totalElement) {
        totalElement.textContent = `GH₵${total.toFixed(2)}`;
    }

    updateCartBadge();

}

// ===============================
// SAVE CART
// ===============================
function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();

}

// ===============================
// INCREASE QUANTITY
// ===============================
function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();

}

// ===============================
// DECREASE QUANTITY
// ===============================
function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

}

// ===============================
// REMOVE ITEM
// ===============================
function removeItem(index) {

    if (!confirm("Remove this product from your cart?")) return;

    cart.splice(index, 1);

    saveCart();

}

// ===============================
// UPDATE CART BADGE
// ===============================
function updateCartBadge() {

    const badge = document.querySelector(".cart-count");

    if (!badge) return;

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    badge.textContent = count;

    localStorage.setItem("cartCount", count);

}

// ===============================
// CHECKOUT BUTTON
// ===============================
const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", () => {

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;

        }

        window.location.href = "checkout.html";

    });

}

// ===============================
// INITIALIZE
// ===============================
displayCart();