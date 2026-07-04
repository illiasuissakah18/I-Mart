/*
==========================================
I MART Marketplace
Seller Dashboard
Version 2.0
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    protectSeller();

    protectSubscription(); // 👈 ADD THIS

    loadDashboard();

});

// ==========================
// LOAD DASHBOARD
// ==========================

function loadDashboard() {

    const seller = getCurrentSeller();

    if (!seller) {

        window.location.href = "seller-login.html";

        return;

    }

    loadSellerInfo(seller);

    loadStatistics(seller);

}

// ==========================
// SELLER INFO
// ==========================

function loadSellerInfo(seller) {

    const welcome =
        document.getElementById("sellerName");

    if (welcome) {

        welcome.innerHTML =
            "Welcome, " + seller.shopName;

    }

}

// ==========================
// STATISTICS
// ==========================

function loadStatistics(seller) {

    const products =
        JSON.parse(localStorage.getItem("products")) || [];

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    const myProducts = products.filter(product =>
        product.sellerId === seller.id
    );

    let totalOrders = 0;

    let totalSales = 0;

    orders.forEach(order => {

        order.items.forEach(item => {

            if (item.sellerId === seller.id) {

                totalOrders++;

                totalSales += Number(item.subtotal);

            }

        });

    });

    const totalProducts =
        myProducts.length;

    document.getElementById("totalProducts").innerText =
        totalProducts;

    document.getElementById("totalOrders").innerText =
        totalOrders;

    document.getElementById("totalSales").innerText =
        "GH₵" + totalSales.toFixed(2);

    document.getElementById("subscriptionStatus").innerText =
        seller.subscriptionStatus || "Inactive";

}

// ==========================
// LOGOUT
// ==========================

function sellerLogout() {

    localStorage.removeItem("currentSeller");

    window.location.href =
        "seller-login.html";

}

console.log("Seller Dashboard v2.0 Loaded");

// ======================================
// PAY MONTHLY SUBSCRIPTION
// ======================================

async function paySubscription() {

    try {

        // Get logged in seller
        const seller = JSON.parse(localStorage.getItem("seller"));

        if (!seller) {
            alert("Please login again.");
            return;
        }

        const response = await fetch(
            "https://illiasu-imart-api.onrender.com/api/subscription/initialize",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sellerId: seller._id
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            // Redirect to Paystack
            window.location.href = data.authorization_url;

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

        alert("Unable to initialize payment.");

    }

}