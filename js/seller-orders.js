/*
==========================================
I MART Marketplace
File: seller-orders.js
Version: 2.0
Seller Orders System
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    protectSeller();

    loadSellerOrders();

});

// ===============================
// PROTECT PAGE
// ===============================

function protectSeller() {

    const seller = getCurrentSeller();

    if (!seller) {

        window.location.href = "seller-login.html";

    }

}

// ===============================
// LOAD ORDERS
// ===============================

function loadSellerOrders() {

    const container =
        document.getElementById("sellerOrders");

    if (!container) return;

    const seller =
        getCurrentSeller();

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let sellerOrders = [];

    orders.forEach(order => {

        order.items.forEach(item => {

            if (item.sellerId === seller.id) {

                sellerOrders.push({

                    orderId: order.id,

                    customer: order.customer,

                    paymentMethod: order.paymentMethod,

                    paymentStatus: order.paymentStatus,

                    createdAt: order.createdAt,

                    total: item.subtotal,

                    product: item

                });

            }

        });

    });

    if (sellerOrders.length === 0) {

        container.innerHTML = `

        <div class="empty-orders">

            <h2>No Orders Yet</h2>

            <p>

                Your products have not been ordered yet.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    sellerOrders.forEach(order => {

        container.innerHTML += createSellerOrderCard(order);

    });

}

// ===============================
// ORDER CARD
// ===============================

function createSellerOrderCard(order) {

    return `

<div class="seller-order-card">

    <div class="seller-order-header">

        <h2>

            Order #${order.orderId}

        </h2>

    </div>

    <img
        src="${order.product.image}"
        width="90"
        alt="${order.product.productName}"
    >

    <h3>

        ${order.product.productName}

    </h3>

    <p>

        Customer:
        ${order.customer.name}

    </p>

    <p>

        Phone:
        ${order.customer.phone}

    </p>

    <p>

        Address:
        ${order.customer.address}

    </p>

    <p>

        Quantity:
        ${order.product.quantity}

    </p>

    <p>

        Total:
        GH₵${Number(order.total).toFixed(2)}

    </p>

    <p>

        Payment:
        ${order.paymentMethod}

    </p>

    <p>

        Payment Status:
        ${order.paymentStatus}

    </p>

    <p>

        Order Status:

        <strong id="status-${order.orderId}-${order.product.productId}">

            ${order.product.orderStatus}

        </strong>

    </p>

    <select
        onchange="changeStatus('${order.orderId}',${order.product.productId},this.value)"
    >

        <option value="">Update Status</option>

        <option>Pending</option>

        <option>Confirmed</option>

        <option>Processing</option>

        <option>Shipped</option>

        <option>Delivered</option>

        <option>Cancelled</option>

    </select>

</div>

`;

}

// ===============================
// UPDATE STATUS
// ===============================

function changeStatus(orderId, productId, status) {

    if (!status) return;

    updateOrderItemStatus(
        orderId,
        productId,
        status
    );

    loadSellerOrders();

    alert("Order status updated.");

}

// ===============================
// REFRESH
// ===============================

function refreshSellerOrders() {

    loadSellerOrders();

}

console.log(
    "Seller Orders v2.0 Loaded"
);