/*
==========================================
I MART Marketplace
Seller Authentication System
MongoDB + JWT Version 2.0
==========================================
*/

const API_URL = "http://localhost:5000/api/sellers";

/* ==========================
   REGISTER SELLER
========================== */

async function registerSeller() {

    const fullName = document.getElementById("fullName").value.trim();
    const shopName = document.getElementById("shopName").value.trim();
    const email = document.getElementById("sellerEmail").value.trim().toLowerCase();
    const phone = document.getElementById("sellerPhone").value.trim();
    const password = document.getElementById("sellerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (
        !fullName ||
        !shopName ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
    ) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                fullName,
                shopName,
                email,
                phone,
                password

            })

        });

        const data = await response.json();

        if (data.success) {

            alert("Registration successful. Please login.");

            window.location.href = "seller-login.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to register seller.");

    }

}

/* ==========================
   LOGIN SELLER
========================== */

async function loginSeller() {

    const email = document.getElementById("sellerEmail").value.trim().toLowerCase();
    const password = document.getElementById("sellerPassword").value;

    try {

        const response = await fetch(`${API_URL}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email,
                password

            })

        });

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        // Save login information
        localStorage.setItem("sellerToken", data.token);

        localStorage.setItem(
            "currentSeller",
            JSON.stringify(data.seller)
        );

        alert("Login successful.");

        window.location.href = "seller-dashboard.html";

    } catch (error) {

        console.error(error);

        alert("Unable to login.");

    }

}
/* ==========================
   GET CURRENT SELLER
========================== */

function getCurrentSeller() {

    const seller = localStorage.getItem("currentSeller");

    if (!seller) {
        return null;
    }

    return JSON.parse(seller);

}

/* ==========================
   GET TOKEN
========================== */

function getSellerToken() {

    return localStorage.getItem("sellerToken");

}

/* ==========================
   CHECK LOGIN
========================== */

function isSellerLoggedIn() {

    return !!getSellerToken();

}

/* ==========================
   LOGOUT
========================== */

function sellerLogout() {

    localStorage.removeItem("sellerToken");
    localStorage.removeItem("currentSeller");

    window.location.href = "seller-login.html";

}

/* ==========================
   PROTECT DASHBOARD
========================== */

function protectSellerDashboard() {

    if (!isSellerLoggedIn()) {

        window.location.href = "seller-login.html";
        return;

    }

}

/* ==========================
   LOAD SELLER DETAILS
========================== */

function loadSellerProfile() {

    const seller = getCurrentSeller();

    if (!seller) return;

    const sellerName = document.getElementById("sellerName");
    const shopName = document.getElementById("shopName");
    const sellerEmail = document.getElementById("sellerEmail");

    if (sellerName) {
        sellerName.textContent = `Welcome ${seller.fullName}`;
    }

    if (shopName) {
        shopName.textContent = seller.shopName;
    }

    if (sellerEmail) {
        sellerEmail.textContent = seller.email;
    }

}

/* ==========================
   AUTHORIZATION HEADER
========================== */

function getAuthHeaders() {

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${getSellerToken()}`

    };

}
/* ==========================
   LOAD DASHBOARD
========================== */

function loadDashboard() {

    protectSellerDashboard();

    loadSellerProfile();

}

/* ==========================
   REGISTER FORM
========================== */

const registerForm = document.getElementById("sellerRegisterForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        registerSeller();

    });

}

/* ==========================
   LOGIN FORM
========================== */

const loginForm = document.getElementById("sellerLoginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        loginSeller();

    });

}

/* ==========================
   AUTO LOAD DASHBOARD
========================== */

document.addEventListener("DOMContentLoaded", () => {

    if (window.location.pathname.includes("seller-dashboard")) {

        loadDashboard();

    }

});