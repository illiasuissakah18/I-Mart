/*
==========================================
I MART Marketplace
File: checkout.js
Version: 4.0
Hubtel Integration Edition
==========================================
*/

// ===============================
// API URL
// ===============================

// ===============================
// INITIALIZE
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    console.log("checkout.js loaded successfully");

    const button = document.getElementById("place-order-btn");

    if (!button) {
        console.error("❌ Place order button not found");
        return;
    }

    console.log("✅ Place order button found");

    button.addEventListener("click", function () {

        console.log("🟢 Place order clicked");

        placeOrder();

    });

});

// ===============================
// CUSTOMER CART
// ===============================

function getCartItems() {
    return getCart();
}

// ===============================
// CUSTOMER
// ===============================

function getLoggedInCustomer() {
    return getCurrentCustomer();
}

// ===============================
// ORDERS
// ===============================

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// ===============================
// ORDER ID
// ===============================

function generateOrderId() {
    return "IM" + Date.now().toString().slice(-8);
}

// ===============================
// LOAD ORDER SUMMARY
// ===============================

function loadOrderSummary() {

    const cart = getCartItems();

    const container =
        document.getElementById("order-items");

    const totalElement =
        document.getElementById("order-total");

    if (!container || !totalElement) return;

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
        <div class="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Add products before checking out.</p>
        </div>
        `;

        totalElement.innerText = "0.00";
        return;
    }

    let total = 0;

    cart.forEach(item => {

        const subtotal =
            Number(item.price) *
            Number(item.quantity);

        total += subtotal;

        container.innerHTML += `
        <div class="order-item">

            <div class="order-left">
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    width="70">
            </div>

            <div class="order-right">
                <h4>${item.name}</h4>

                <p>Quantity: ${item.quantity}</p>

                <p>
                    Price:
                    GH₵${Number(item.price).toFixed(2)}
                </p>

                <strong>
                    GH₵${subtotal.toFixed(2)}
                </strong>
            </div>

        </div>
        `;
    });

    totalElement.innerText = total.toFixed(2);
}

// ===============================
// BUTTON
// ===============================



// ===============================
// CUSTOMER DETAILS
// ===============================

function getCustomerDetails() {

    const loggedCustomer =
        getLoggedInCustomer();

    return {

        name:
            document.getElementById("name").value.trim(),

        phone:
            document.getElementById("phone").value.trim(),

        address:
            document.getElementById("address").value.trim(),

        email:
            document.getElementById("email")
                ? document.getElementById("email").value.trim()
                : (loggedCustomer ? loggedCustomer.email : "")

    };
}

// ===============================
// VALIDATE CUSTOMER
// ===============================

function validateCustomer(customer) {

    if (
        !customer.name ||
        !customer.phone ||
        !customer.address
    ) {

        alert("Please complete all required fields.");
        return false;
    }

    return true;
}

// ===============================
// PLACE ORDER
// ===============================

async function placeOrder() {

    const customer = getCustomerDetails();

    if (!validateCustomer(customer)) {
        return;
    }

    const cart = getCartItems();

    if (!validateCart(cart)) {
        return;
    }

    const order = createMarketplaceOrder(customer, cart);

    saveMarketplaceOrder(order);

    const paymentMethod = getSelectedPaymentMethod();

    if (paymentMethod === "Cash on Delivery") {

        completeCheckout(order);

    } else {

        await startPayment(order);

    }

}
// ===============================
// CREATE MARKETPLACE ORDER
// ===============================

function createMarketplaceOrder(customer, cart) {

    const currentCustomer = getLoggedInCustomer();

    const orderItems = [];

    let grandTotal = 0;

    cart.forEach(item => {

        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const subtotal = quantity * price;

        grandTotal += subtotal;

        orderItems.push({

            productId: item.id,

            productName: item.name,

            image: item.image || "",

            category: item.category || "",

            sellerId: item.sellerId || null,

            sellerName: item.seller || "I MART",

            quantity,

            price,

            subtotal,

            orderStatus: "Pending"

        });

    });

    return {

        id: generateOrderId(),

        customerId: currentCustomer ? currentCustomer.id : null,

        customerName: customer.name,

        customerEmail: currentCustomer
            ? currentCustomer.email
            : customer.email,

        customerPhone: customer.phone,

        customer,

        items: orderItems,

        total: grandTotal,

        paymentMethod: getSelectedPaymentMethod(),

        paymentStatus: "Pending",

        orderStatus: "Pending",

        createdAt: new Date().toLocaleString(),

        updatedAt: new Date().toLocaleString()

    };

}

// ===============================
// SAVE MARKETPLACE ORDER
// ===============================

function saveMarketplaceOrder(order) {

    const orders = getOrders();

    orders.push(order);

    saveOrders(orders);

}

// ===============================
// START HUBTEL PAYMENT
// ===============================

async function startPayment(order) {

    try {

        const response = await fetch(
            `${API_URL}/payment/pay`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    customerName:
                        order.customerName,

                    phone:
                        order.customerPhone,

                    amount:
                        order.total,

                    description:
                        `I MART Order ${order.id}`

                })

            }
        );

        const data = await response.json();

        if (!data.success) {

            alert("Unable to initialize payment.");

            return;

        }

        // Save pending order

        localStorage.setItem(
            "pendingOrder",
            JSON.stringify(order)
        );

        // Redirect customer to Hubtel

        if (data.payment.checkoutUrl) {

            window.location.href =
                data.payment.checkoutUrl;

            return;

        }

        if (data.payment.data &&
            data.payment.data.checkoutUrl) {

            window.location.href =
                data.payment.data.checkoutUrl;

            return;

        }

        alert("Payment link not received.");

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to payment server.");

    }

}

// ===============================
// PAYMENT SUCCESS
// ===============================

function paymentSuccessful() {

    const order = JSON.parse(
        localStorage.getItem("pendingOrder")
    );

    if (!order) return;

    order.paymentStatus = "Paid";

    order.orderStatus = "Paid";

    const orders = getOrders();

    const saved = orders.find(
        o => o.id === order.id
    );

    if (saved) {

        saved.paymentStatus = "Paid";

        saved.orderStatus = "Paid";

        saved.updatedAt =
            new Date().toLocaleString();

        saveOrders(orders);

    }

    localStorage.removeItem(
        "pendingOrder"
    );

    completeCheckout(order);

}
// ===============================
// GET ORDER
// ===============================

function getOrder(orderId) {

    const orders = getOrders();

    return orders.find(order =>
        order.id === orderId
    );

}

// ===============================
// GET CUSTOMER ORDERS
// ===============================

function getCustomerOrders() {

    const currentCustomer =
        getLoggedInCustomer();

    if (!currentCustomer) {

        return [];

    }

    return getOrders().filter(order =>
        order.customerId === currentCustomer.id
    );

}

// ===============================
// COMPLETE CHECKOUT
// ===============================

function completeCheckout(order) {

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );

    updateSellerStatistics(order);

    clearCart();

    showOrderSuccess(order);

    window.location.href =
        "order-success.html";

}

// ===============================
// UPDATE SELLER STATISTICS
// ===============================

function updateSellerStatistics(order) {

    let sellers =
        JSON.parse(localStorage.getItem("sellers")) || [];

    let changed = false;

    sellers.forEach(seller => {

        let totalOrders = 0;
        let totalSales = 0;

        order.items.forEach(item => {

            if (item.sellerId === seller.id) {

                totalOrders++;

                totalSales += item.subtotal;

            }

        });

        if (totalOrders > 0) {

            seller.totalOrders =
                (seller.totalOrders || 0) +
                totalOrders;

            seller.totalSales =
                (seller.totalSales || 0) +
                totalSales;

            changed = true;

        }

    });

    if (changed) {

        localStorage.setItem(
            "sellers",
            JSON.stringify(sellers)
        );

        if (typeof getCurrentSeller === "function") {

            const currentSeller =
                getCurrentSeller();

            if (currentSeller) {

                const updatedSeller =
                    sellers.find(
                        seller => seller.id === currentSeller.id
                    );

                if (updatedSeller) {

                    localStorage.setItem(
                        "currentSeller",
                        JSON.stringify(updatedSeller)
                    );

                }

            }

        }

    }

}

// ===============================
// LAST ORDER
// ===============================

function getLastOrder() {

    return JSON.parse(
        localStorage.getItem("lastOrder")
    );

}

function clearLastOrder() {

    localStorage.removeItem(
        "lastOrder"
    );

}

// ===============================
// FORMATTERS
// ===============================

function formatCurrency(amount) {

    return "GH₵" +
        Number(amount).toFixed(2);

}

function formatOrderDate(dateString) {

    return new Date(dateString)
        .toLocaleString();

}
// ===============================
// PAYMENT METHOD
// ===============================

function getSelectedPaymentMethod() {

    const selected = document.querySelector(
        'input[name="payment-method"]:checked'
    );

    return selected
        ? selected.value
        : "Cash on Delivery";

}

// ===============================
// VALIDATE CART
// ===============================

function validateCart(cart) {

    if (!Array.isArray(cart)) {

        alert("Invalid cart.");

        return false;

    }

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return false;

    }

    return true;

}

// ===============================
// VALIDATE ORDER ITEMS
// ===============================

function validateOrderItems(items) {

    return items.every(item => {

        return (

            item.productId &&

            item.productName &&

            item.quantity > 0 &&

            item.price >= 0

        );

    });

}

// ===============================
// UPDATE ORDER STATUS
// ===============================

function updateOrderStatus(orderId, status) {

    const orders = getOrders();

    const order = orders.find(
        o => o.id === orderId
    );

    if (!order) return;

    order.orderStatus = status;
    order.updatedAt = new Date().toLocaleString();

    saveOrders(orders);

}

// ===============================
// UPDATE PRODUCT STATUS
// ===============================

function updateOrderItemStatus(orderId, productId, status) {

    const orders = getOrders();

    const order = orders.find(
        o => o.id === orderId
    );

    if (!order) return;

    const item = order.items.find(
        i => i.productId === productId
    );

    if (!item) return;

    item.orderStatus = status;

    order.updatedAt = new Date().toLocaleString();

    saveOrders(orders);

}

// ===============================
// SUCCESS MESSAGE
// ===============================

function showOrderSuccess(order) {

    alert(

`🎉 Order Placed Successfully!

Order ID: ${order.id}

Total: ${formatCurrency(order.total)}

Thank you for shopping with I MART!`

    );

}

// ===============================
// RESET FORM
// ===============================

function resetCheckoutForm() {

    const form =
        document.getElementById("checkoutForm");

    if (form) {

        form.reset();

    }

}

// ===============================
// GLOBAL FUNCTIONS
// ===============================

window.getOrders = getOrders;
window.getOrder = getOrder;
window.getCustomerOrders = getCustomerOrders;
window.placeOrder = placeOrder;
window.paymentSuccessful = paymentSuccessful;
window.updateOrderStatus = updateOrderStatus;
window.updateOrderItemStatus = updateOrderItemStatus;
window.formatCurrency = formatCurrency;
window.formatOrderDate = formatOrderDate;
window.getLastOrder = getLastOrder;
window.clearLastOrder = clearLastOrder;

// ===============================
// VERSION
// ===============================

console.log(
    "I MART Marketplace Checkout v4.0 Loaded Successfully"
);

// ===============================
// END OF FILE
// ===============================