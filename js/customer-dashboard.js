/*
==========================================
I MART Marketplace
Customer Dashboard
Version: 1.0
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    loadCustomerDashboard();

});

// ===============================
// LOAD DASHBOARD
// ===============================

function loadCustomerDashboard() {

    const customer = getCurrentCustomer();

    if (!customer) {

        window.location.href = "customer-login.html";

        return;

    }

    // Welcome Message
    document.getElementById("welcomeMessage").textContent =
        `Welcome, ${customer.fullName}`;

    // Profile
    document.getElementById("profileName").textContent =
        customer.fullName;

    document.getElementById("profileEmail").textContent =
        customer.email;

    document.getElementById("profilePhone").textContent =
        customer.phone;

    document.getElementById("profileJoined").textContent =
        customer.joinedAt;

    loadDashboardStatistics(customer);

}

// ===============================
// DASHBOARD STATISTICS
// ===============================

function loadDashboardStatistics(customer) {

    // Customer Orders
    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    const myOrders = orders.filter(order =>
        order.customer &&
        order.customer.email === customer.email
    );

    document.getElementById("orderCount").textContent =
        myOrders.length;

    // Customer Wishlist
    const wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

    document.getElementById("wishlistCount").textContent =
        wishlist.length;

    // Customer Cart
    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let totalItems = 0;

    cart.forEach(item => {

        totalItems += Number(item.quantity) || 1;

    });

    document.getElementById("cartCount").textContent =
        totalItems;

}

// ===============================
// REFRESH DASHBOARD
// ===============================

function refreshDashboard() {

    loadCustomerDashboard();

}