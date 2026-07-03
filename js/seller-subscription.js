/*
==========================================
I MART Marketplace
Seller Subscription System
Version 1.0
==========================================
*/

// ===============================
// GET CURRENT SELLER
// ===============================

function getCurrentSeller() {
    return JSON.parse(localStorage.getItem("currentSeller"));
}

// ===============================
// CHECK SUBSCRIPTION STATUS
// ===============================

function checkSubscription() {

    const seller = getCurrentSeller();

    if (!seller) return false;

    const sub = seller.subscription;

    if (!sub) return false;

    const today = new Date();
    const expiry = new Date(sub.expiryDate);

    if (today > expiry) {

        seller.subscription.status = "Expired";

        localStorage.setItem(
            "currentSeller",
            JSON.stringify(seller)
        );

        updateSellerInDatabase(seller);

        return false;
    }

    return true;
}

// ===============================
// ACTIVATE SUBSCRIPTION
// ===============================

function activateSubscription(days = 30, amount = 50) {

    const seller = getCurrentSeller();

    if (!seller) return;

    const startDate = new Date();
    const expiryDate = new Date();

    expiryDate.setDate(startDate.getDate() + days);

    seller.subscription = {
        status: "Active",
        plan: "Basic",
        amount: amount,
        startDate: startDate.toISOString(),
        expiryDate: expiryDate.toISOString()
    };

    localStorage.setItem(
        "currentSeller",
        JSON.stringify(seller)
    );

    updateSellerInDatabase(seller);

    alert("Subscription Activated Successfully!");
}

// ===============================
// BLOCK SELLER IF EXPIRED
// ===============================

function protectSubscription() {

    const seller = getCurrentSeller();

    if (!seller) {
        window.location.href = "seller-login.html";
        return false;
    }

    if (!checkSubscription()) {

        alert("Your subscription has expired. Please renew.");

        window.location.href = "subscription.html";

        return false;
    }

    return true;
}

// ===============================
// UPDATE SELLER IN DATABASE
// ===============================

function updateSellerInDatabase(updatedSeller) {

    let sellers =
        JSON.parse(localStorage.getItem("sellers")) || [];

    const index = sellers.findIndex(
        s => s.id === updatedSeller.id
    );

    if (index !== -1) {
        sellers[index] = updatedSeller;
    }

    localStorage.setItem(
        "sellers",
        JSON.stringify(sellers)
    );
}

// ===============================
// GET SUBSCRIPTION INFO
// ===============================

function getSubscriptionInfo() {

    const seller = getCurrentSeller();

    if (!seller || !seller.subscription) {
        return null;
    }

    return seller.subscription;
}