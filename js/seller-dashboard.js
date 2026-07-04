/*
==========================================
I MART Marketplace
Seller Dashboard
Version 5.0
==========================================
*/

const API = "https://illiasu-imart-api.onrender.com";

// ===============================
// LOAD DASHBOARD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

});

// ===============================
// LOAD SELLER DATA
// ===============================

async function loadDashboard() {

    const token = localStorage.getItem("sellerToken");

    if (!token) {

        window.location.href = "seller-login.html";
        return;

    }

    try {

        const response = await fetch(`${API}/api/sellers/profile`, {

            method: "GET",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (!response.ok) {

            logoutSeller();
            return;

        }

        const seller = data.seller;

        // Save latest seller data
        localStorage.setItem("seller", JSON.stringify(seller));

        // ===============================
        // BASIC DETAILS
        // ===============================

        document.getElementById("seller-name").textContent =
            seller.fullName;

        document.getElementById("shop-name").textContent =
            seller.shopName;

        document.getElementById("seller-email").textContent =
            seller.email;

        // ===============================
        // PROFILE
        // ===============================

        document.getElementById("shopName").textContent =
            seller.shopName;

        document.getElementById("sellerEmail").textContent =
            seller.email;

        document.getElementById("sellerStatus").textContent =
            seller.status;

        document.getElementById("subscriptionPlan").textContent =
            seller.subscription;

        // ===============================
        // BILLING
        // ===============================

        document.getElementById("monthlyFee").textContent =
            "GH₵" + seller.monthlyFee.toFixed(2);

        document.getElementById("billingStatus").textContent =
            seller.billingStatus;

        document.getElementById("accountStatus").textContent =
            seller.status;

        document.getElementById("subscriptionStatus").textContent =
            seller.subscription;

        if (seller.nextBillingDate) {

            document.getElementById("nextBillingDate").textContent =
                new Date(seller.nextBillingDate).toLocaleDateString();

        }

    } catch (error) {

        console.error(error);

        alert("Unable to load seller dashboard.");

    }

}

// ===============================
// LOGOUT
// ===============================

function logoutSeller() {

    localStorage.removeItem("sellerToken");
    localStorage.removeItem("seller");

    window.location.href = "seller-login.html";

}