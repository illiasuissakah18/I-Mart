/*
==========================================
I MART Marketplace
Customer Orders
Version: 1.0
==========================================
*/

const API = "https://i-mart-backend.onrender.com/api/orders";

const ordersList = document.getElementById("ordersList");

async function loadOrders() {

    try {

        const response = await fetch(`${API}/api/orders`);

        const data = await response.json();

        if (!data.success) {

            ordersList.innerHTML = "<p>Failed to load orders.</p>";

            return;

        }

        if (data.orders.length === 0) {

            ordersList.innerHTML = "<p>No orders found.</p>";

            return;

        }

        ordersList.innerHTML = "";

        data.orders.forEach(order => {

            ordersList.innerHTML += `

            <div class="order-card">

                <h3>Order #${order._id}</h3>

                <p><strong>Customer:</strong> ${order.customer.fullName}</p>

                <p><strong>Total:</strong> GH₵${order.total}</p>

                <p><strong>Payment:</strong> ${order.paymentStatus}</p>

                <p><strong>Status:</strong> ${order.orderStatus}</p>

                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>

            </div>

            <hr>

            `;

        });

    } catch (error) {

        console.error(error);

        ordersList.innerHTML = "<p>Server error.</p>";

    }

}

loadOrders();