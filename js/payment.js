/*
==========================================
I MART Marketplace
File: payment.js
Version: 1.0 CLEAN
==========================================
*/

// ===============================
// API URL (YOUR BACKEND)
// ===============================

const API_URL = "http://localhost:5000/api/payment";

// ===============================
// START PAYMENT
// ===============================

async function startPayment(order) {

    try {

        const response = await fetch(`${API_URL}/pay`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                customerName: order.customer.name,
                phone: order.customer.phone,
                amount: order.total,
                description: "I MART Marketplace Order"

            })

        });

        const data = await response.json();

        console.log("Payment Response:", data);

        // ===============================
        // CHECK RESPONSE
        // ===============================

        if (!data.success) {
            alert("Payment failed to start.");
            return false;
        }

        // ===============================
        // HUBTEL REDIRECT (SANDBOX)
        // ===============================

        if (
            data.payment &&
            data.payment.data &&
            data.payment.data.checkoutUrl
        ) {

            window.location.href =
                data.payment.data.checkoutUrl;

            return true;
        }

        alert("No payment link received from server.");

        return false;

    } catch (error) {

        console.error("Payment Error:", error);

        alert("Cannot connect to payment server.");

        return false;
    }
}

// ===============================
// CHECK PAYMENT STATUS
// ===============================

async function checkPayment(reference) {

    try {

        const res = await fetch(
            `${API_URL}/status/${reference}`
        );

        return await res.json();

    } catch (error) {

        console.error(error);
        return null;
    }
}

// ===============================
// SUCCESS HANDLER
// ===============================

function paymentSuccess(order) {

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";

    let orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    const index = orders.findIndex(
        o => o.id === order.id
    );

    if (index !== -1) {
        orders[index] = order;
    }

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );

    localStorage.removeItem("cart");

    window.location.href = "order-success.html";
}

// ===============================
// FAILED PAYMENT
// ===============================

function paymentFailed() {

    alert("Payment was cancelled or failed.");

    window.location.href = "checkout.html";
}

// ===============================
// GLOBAL EXPORTS
// ===============================

window.startPayment = startPayment;
window.checkPayment = checkPayment;
window.paymentSuccess = paymentSuccess;
window.paymentFailed = paymentFailed;

console.log("I MART Payment System Loaded");