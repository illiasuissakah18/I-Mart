/*
==========================================
I MART Marketplace
Seller Orders
Version: 3.0
==========================================
*/

const API = "https://illiasu-imart-api.onrender.com";

const token = localStorage.getItem("sellerToken");

const container = document.getElementById("ordersContainer");

async function loadOrders() {

    try {

        const res = await fetch(`${API}/api/orders/seller`, {

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

            if (order.orderStatus === "Pending") pending++;
            if (order.orderStatus === "Processing") processing++;
            if (order.orderStatus === "Delivered") delivered++;

            const product = order.products[0];

            container.innerHTML += `

<tr>

<td>${order._id.slice(-6)}</td>

<td>${order.customer.fullName}</td>

<td>${product.name}</td>

<td>${product.quantity}</td>

<td>GH₵${order.total}</td>

<td>${order.orderStatus}</td>

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

        const res = await fetch(`${API}/api/orders/${id}`, {

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