/*
==========================================
I MART Marketplace
File: my-orders.js
Version: 2.0
Customer Orders
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    loadMyOrders();

});

// ===============================
// LOAD MY ORDERS
// ===============================

function loadMyOrders() {

    const container = document.getElementById("ordersList");

    if (!container) return;

    const currentCustomer = getCurrentCustomer();

    if (!currentCustomer) {

        window.location.href = "customer-login.html";

        return;

    }

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    const myOrders = orders.filter(order =>
        order.customerId === currentCustomer.id
    );

    if (myOrders.length === 0) {

        container.innerHTML = `

        <div class="empty-orders">

            <h2>No Orders Found</h2>

            <p>You haven't placed any orders yet.</p>

            <a href="products.html" class="btn">

                Start Shopping

            </a>

        </div>

        `;

        return;

    }

    myOrders.sort((a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    container.innerHTML = "";

    myOrders.forEach(order => {

        container.innerHTML += createOrderCard(order);

    });

}

// ===============================
// ORDER CARD
// ===============================

function createOrderCard(order) {

    let itemsHTML = "";

    order.items.forEach(item => {

        itemsHTML += `

        <div class="ordered-product">

            <img
                src="${item.image}"
                width="80"
                alt="${item.productName}"
            >

            <div>

                <h3>${item.productName}</h3>

                <p>

                    Seller:
                    ${item.sellerName}

                </p>

                <p>

                    Quantity:
                    ${item.quantity}

                </p>

                <p>

                    Price:
                    GH₵${Number(item.price).toFixed(2)}

                </p>

                <p>

                    Status:

                    <strong>

                        ${item.orderStatus}

                    </strong>

                </p>

            </div>

        </div>

        `;

    });

    return `

<div class="order-card">

    <div class="order-header">

        <h2>

            Order #${order.id}

        </h2>

        <span class="order-status">

            ${order.orderStatus}

        </span>

    </div>

    <p>

        <strong>Date:</strong>

        ${order.createdAt}

    </p>

    <p>

        <strong>Payment:</strong>

        ${order.paymentMethod}

    </p>

    <p>

        <strong>Payment Status:</strong>

        ${order.paymentStatus}

    </p>

    <hr>

    ${itemsHTML}

    <hr>

    <h3>

        Total:

        GH₵${Number(order.total).toFixed(2)}

    </h3>

</div>

`;

}

// ===============================
// REFRESH
// ===============================

function refreshOrders() {

    loadMyOrders();

}

// ===============================
// VERSION
// ===============================

console.log(
    "I MART My Orders v2.0 Loaded Successfully"
);