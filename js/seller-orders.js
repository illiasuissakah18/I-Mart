/*
==========================================
I MART Marketplace
Seller Orders
Version: 3.0
==========================================
*/

const API_BASE = (function() {
    if (window.location.protocol === "file:") {
        return "http://localhost:5000/api";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://localhost:5000/api";
    }
    return `${window.location.origin}/api`;
})();

const token = localStorage.getItem("sellerToken");

const container = document.getElementById("ordersContainer");

async function loadOrders() {

    try {

        const res = await fetch(`${API_BASE}/orders/seller`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await res.json();

        if (!data.success) {

            container.innerHTML =
                "<tr><td colspan='7'>No orders found.</td></tr>";

            return;

        }

        container.innerHTML = "";

        let pending = 0;
        let processing = 0;
        let delivered = 0;

        data.orders.forEach(order => {

            const orderStatus = order.status || order.orderStatus || "Pending";
            if (orderStatus === "Pending") pending++;
            if (orderStatus === "Processing") processing++;
            if (orderStatus === "Delivered") delivered++;

            const item = order.items?.[0] || {};
            const product = item.product || {};
            const customerName = order.user?.fullName || order.customer?.fullName || "Customer";
            const quantity = item.quantity ?? 0;

            container.innerHTML += `

<tr>

<td>${order._id.slice(-6)}</td>

<td>${customerName}</td>

<td>${product.name || "—"}</td>

<td>${quantity}</td>

<td>GH₵${order.totalAmount?.toFixed(2) ?? "0.00"}</td>

<td>${orderStatus}</td>

<td>

<button onclick="markDelivered('${order._id}')">

Delivered

</button>

</td>

</tr>

`;

        });

        document.getElementById("totalOrders").textContent =
            data.orders.length;

        document.getElementById("pendingOrders").textContent =
            pending;

        document.getElementById("processingOrders").textContent =
            processing;

        document.getElementById("deliveredOrders").textContent =
            delivered;

    } catch (err) {

        console.error(err);

        container.innerHTML =
            "<tr><td colspan='7'>Server Error.</td></tr>";

    }

}

async function markDelivered(id) {

    try {

        const res = await fetch(`${API_BASE}/orders/${id}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                orderStatus: "Delivered"

            })

        });

        const data = await res.json();

        alert(data.message);

        loadOrders();

    } catch (err) {

        console.error(err);

    }

}

loadOrders();