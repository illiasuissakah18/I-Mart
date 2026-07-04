const API_URL = "https://illiasu-imart-api.onrender.com/api/products";

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

// ===============================
// FETCH PRODUCTS FROM BACKEND
// ===============================
async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!data.success) {
            console.log("Failed to load products");
            return;
        }

        renderProducts(data.products);

    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// ===============================
// DISPLAY PRODUCTS
// ===============================
function renderProducts(products) {

    const grid = document.querySelector(".product-grid");

    if (!grid) return;

    grid.innerHTML = "";

    products.forEach(product => {

        const imageURL = product.image
            ? `https://illiasu-imart-api.onrender.com/uploads/${product.image}`
            : "images/default-product.png";

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${imageURL}" alt="${product.name}">

            <div class="product-info">
                <h3>${product.name}</h3>

                <div class="rating">⭐⭐⭐⭐⭐</div>

                <p class="price">
                    GH₵ ${product.price}
                </p>

                <div class="product-buttons">

                    <a href="product-details.html?id=${product._id}" class="btn">
                        View
                    </a>

                    <button class="btn wishlist-btn" onclick="addToWishlist('${product._id}')">
                        ❤
                    </button>

                    <button class="btn cart-btn" onclick="addToCart('${product._id}')">
                        🛒
                    </button>

                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}