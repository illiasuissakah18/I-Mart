/*
==========================================
I MART Marketplace
Seller Products
Version 3.0
==========================================
*/

const API_BASE = (function() {
    if (window.location.protocol === "file:") {
        return "http://localhost:5000/api";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://localhost:5000/api";
    }
    return `${window.location.origin}/api`;
})();

const productsContainer = document.getElementById("productsContainer");

// ===============================
// LOAD SELLER PRODUCTS
// ===============================

async function loadProducts() {

    const token = localStorage.getItem("sellerToken");

    if (!token) {

        window.location.href = "seller-login.html";
        return;

    }

    try {

        const response = await fetch(`${API_BASE}/products/seller/my-products`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!data.success) {

            productsContainer.innerHTML =
                "<p>No products found.</p>";

            return;

        }

        if (data.products.length === 0) {

            productsContainer.innerHTML = `
                <div class="empty-products">
                    <h3>No Products Yet</h3>
                    <p>You haven't added any products.</p>

                    <a href="add-product.html" class="btn">
                        ➕ Add Your First Product
                    </a>
                </div>
            `;

            return;

        }

        productsContainer.innerHTML = "";

        data.products.forEach(product => {

            productsContainer.innerHTML += `

            <div class="product-card">

                <img src="${API_BASE.replace('/api', '')}${product.image}"
                     alt="${product.name}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <p><strong>Category:</strong> ${product.category}</p>

                    <p><strong>Price:</strong> GH₵${product.price}</p>

                    <p><strong>Stock:</strong> ${product.stock}</p>

                    <div class="actions">

                        <button
                            class="edit"
                            onclick="editProduct('${product._id}')">

                            ✏️ Edit

                        </button>

                        <button
                            class="delete"
                            onclick="deleteProduct('${product._id}')">

                            🗑️ Delete

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    } catch (error) {

        console.error(error);

        productsContainer.innerHTML =
            "<p>Unable to load products.</p>";

    }

}

// ===============================
// DELETE PRODUCT
// ===============================

async function deleteProduct(id) {

    if (!confirm("Delete this product?")) return;

    const token = localStorage.getItem("sellerToken");

    try {

        const response = await fetch(`${API_BASE}/products/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (data.success) {

            alert("✅ Product deleted successfully.");

            loadProducts();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Server error.");

    }

}

// ===============================
// EDIT PRODUCT
// ===============================

function editProduct(id) {

    window.location.href =
        `edit-product.html?id=${id}`;

}

// ===============================
// START
// ===============================

loadProducts();