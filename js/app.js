/* ==========================================
   I MART Fashion Marketplace
   app.js v2.0 (FIXED)
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // CART COUNTER
    // ===============================
    let cartCount = localStorage.getItem("cartCount") || 0;

    const cartBadge = document.querySelector(".cart-count");
    if (cartBadge) {
        cartBadge.textContent = cartCount;
    }

    // ===============================
    // NEWSLETTER FORM
    // ===============================
    const newsletterForm = document.querySelector(".newsletter form");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = newsletterForm.querySelector("input").value.trim();

            if (!email) {
                alert("Please enter your email address.");
                return;
            }

            alert("Thank you for subscribing to I MART!");
            newsletterForm.reset();
        });
    }

    // ===============================
    // SEARCH BAR
    // ===============================
    const searchForm = document.querySelector(".search-bar");

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const keyword = searchForm.querySelector("input").value.trim();

            if (!keyword) {
                alert("Please enter what you're looking for.");
                return;
            }

            alert("Search coming soon!\n\nYou searched: " + keyword);
        });
    }

    // ===============================
    // SMOOTH SCROLL
    // ===============================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // ===============================
    // PRODUCT BUTTON ANIMATION
    // ===============================
    const buttons = document.querySelectorAll(".product-card .btn");

    buttons.forEach(button => {
        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.05)";
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
        });
    });

    // ===============================
    // USER DISPLAY (FIXED)
    // ===============================

    const userArea = document.getElementById("user-area");

    // seller OR customer
    const seller = JSON.parse(localStorage.getItem("seller"));
    const customer = JSON.parse(localStorage.getItem("currentUser"));

    const user = seller || customer;

    if (userArea && user) {

        const name = user.fullName || user.name || "User";

        userArea.innerHTML = `
            <span>Hi, ${name}</span>
            <button id="logoutBtn">Logout</button>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => {

            localStorage.removeItem("seller");
            localStorage.removeItem("sellerToken");
            localStorage.removeItem("currentUser");

            window.location.href = "login.html";
        });
    }

});

console.log("I MART v2.0 Loaded Successfully");