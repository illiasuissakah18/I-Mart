/*
==========================================
I MART Fashion Marketplace
File: products.js
Version: 2.1 FIXED
Milestone: 2
==========================================
*/

let displayedProducts = [...getAllProducts()];

// ============================
// DISPLAY PRODUCTS
// ============================

function displayProducts(productList) {

    const productGrid = document.querySelector(".product-grid");

    if (!productGrid) {
        console.log("No product grid found");
        return;
    }

    productGrid.innerHTML = "";

    productList.forEach(product => {

        productGrid.innerHTML += `
        
        <div class="product-card">

            <span class="badge ${product.badge.toLowerCase()}">
                ${product.badge}
            </span>

            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">

                <h3>${product.name}</h3>

                <p>${product.category}</p>

                <div class="rating">
                    ⭐ ${product.rating} (${product.reviews})
                </div>

                <p class="price">
                    GH₵${product.price}
                    <span>GH₵${product.oldPrice}</span>
                </p>

                <div class="product-buttons">

                    <button onclick="addToWishlist(${product.id})">❤</button>

                    <button onclick="addToCart(${product.id})">🛒</button>

                    <a href="product-details.html?id=${product.id}" class="btn">
                        View
                    </a>

                </div>

            </div>

        </div>
        `;
    });
}

// ============================
// SEARCH
// ============================

function liveSearch() {

    const input = document.querySelector(".search-bar input");

    if (!input) return;

    input.addEventListener("input", function () {

        const keyword = this.value.toLowerCase();

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(keyword) ||
            p.category.toLowerCase().includes(keyword) ||
            p.brand.toLowerCase().includes(keyword)
        );

        displayProducts(filtered);
    });
}

// ============================
// CATEGORY FILTER
// ============================

function filterProducts() {

    const links = document.querySelectorAll(".sidebar ul li a");

    links.forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            const category = this.textContent.replace(/[^a-zA-Z ]/g, "").trim();

            const filtered = products.filter(p =>
                p.category.toLowerCase() === category.toLowerCase()
            );

            displayProducts(filtered);
        });
    });
}

// ============================
// INIT
// ============================

document.addEventListener("DOMContentLoaded", () => {

    displayProducts(displayedProducts);

    liveSearch();

    filterProducts();

});