/*
==========================================
I MART Marketplace
Seller Dashboard
Version 6.0
Production Ready
==========================================
*/

const API = "https://illiasu-imart-api.onrender.com";

// ===============================
// INITIALIZE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});

// ===============================
// LOAD SELLER DASHBOARD
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

        if (!response.ok || !data.success) {
            logoutSeller();
            return;
        }

        const seller = data.seller;

        // Save latest seller data
        localStorage.setItem("seller", JSON.stringify(seller));

        // ===============================
        // HELPER FUNCTION
        // ===============================
        function setText(id, value) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }

        // ===============================
        // BASIC DETAILS
        // ===============================
        setText("seller-name", seller.fullName);
        setText("shop-name", seller.shopName);
        setText("seller-email", seller.email);

        // ===============================
        // PROFILE
        // ===============================
        setText("shopName", seller.shopName);
        setText("sellerEmail", seller.email);
        setText("sellerStatus", seller.status);
        setText("subscriptionPlan", seller.subscription);

        // ===============================
        // BILLING
        // ===============================
        setText(
            "monthlyFee",
            "GH₵" + Number(seller.monthlyFee || 0).toFixed(2)
        );

        setText("billingStatus", seller.billingStatus);
        setText("accountStatus", seller.status);
        setText("subscriptionStatus", seller.subscription);

        if (seller.nextBillingDate) {
            setText(
                "nextBillingDate",
                new Date(seller.nextBillingDate).toLocaleDateString()
            );
        }

    } catch (error) {

        console.error("Dashboard Error:", error);

        alert("Unable to connect to the server.");

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