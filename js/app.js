/* ==========================================
   I MART Fashion Marketplace
   app.js v1.0
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // Cart Counter
    // ===============================

    let cartCount = localStorage.getItem("cartCount") || 0;

    const cartBadge = document.querySelector(".cart-count");

    if (cartBadge) {
        cartBadge.textContent = cartCount;
    }

    // ===============================
    // Newsletter Form
    // ===============================

    const newsletterForm = document.querySelector(".newsletter form");

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const email = newsletterForm.querySelector("input").value.trim();

            if (email === "") {

                alert("Please enter your email address.");

                return;

            }

            alert("Thank you for subscribing to I MART!");

            newsletterForm.reset();

        });

    }

    // ===============================
    // Search Bar
    // ===============================

    const searchForm = document.querySelector(".search-bar");

    if (searchForm) {

        searchForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const keyword = searchForm.querySelector("input").value.trim();

            if (keyword === "") {

                alert("Please enter what you're looking for.");

                return;

            }

            alert("Search feature coming soon!\n\nYou searched for: " + keyword);

        });

    }

    // ===============================
    // Smooth Scroll
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
    // Product Buttons
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

});

console.log("I MART v1.0 Loaded Successfully");
document.addEventListener("DOMContentLoaded", () => {

    const user = getCurrentUser();

    const userArea = document.getElementById("user-area");

    if (userArea && user) {

        userArea.innerHTML = `
            <span>Hi, ${user.name}</span>
            <button onclick="logout()">Logout</button>
        `;
    }

});