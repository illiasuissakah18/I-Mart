/*
==========================================
I MART Marketplace
Shopping Cart
Version: 3.0
==========================================
*/

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const API = "https://illiasu-imart-api.onrender.com";

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

        updateCartBadge();

        return;
    }

    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach((product, index) => {

        const subtotal = product.price * product.quantity;

        total += subtotal;

        const imageUrl = product.image.startsWith("http")
            ? product.image
            : `${API}${product.image}`;

        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `

            <img src="${imageUrl}" alt="${product.name}">

            <div class="cart-info">

                <h3>${product.name}</h3>

                <p><strong>Price:</strong> GH₵${product.price.toFixed(2)}</p>

                <p><strong>Seller:</strong> ${product.shopName || "I MART Seller"}</p>

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
// ADD PRODUCT TO CART
// ===============================
function addToCart(product) {

    const existing = cart.find(item => item._id === product._id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            _id: product._id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            shopName: product.shopName,
            quantity: 1

        });

    }

    saveCart();

    alert("✅ Product added to cart.");

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

    if (!confirm("Remove this item?")) return;

    cart.splice(index, 1);

    saveCart();

}

// ===============================
// CLEAR CART
// ===============================
function clearCart() {

    if (!confirm("Clear your cart?")) return;

    cart = [];

    saveCart();

}

// ===============================
// UPDATE BADGE
// ===============================
function updateCartBadge() {

    const badge = document.querySelector(".cart-count");

    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    if (badge) {

        badge.textContent = count;

    }

    localStorage.setItem("cartCount", count);

}

// ===============================
// CHECKOUT
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