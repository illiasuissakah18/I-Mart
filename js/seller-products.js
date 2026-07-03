const productsContainer = document.getElementById("productsContainer");

const API_URL = "http://localhost:5000/api/products";

// Load all products
async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.success) {
            productsContainer.innerHTML = "<p>Failed to load products.</p>";
            return;
        }

        if (data.products.length === 0) {
            productsContainer.innerHTML = "<p>No products available.</p>";
            return;
        }

        productsContainer.innerHTML = "";

        data.products.forEach(product => {

            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <p><strong>Category:</strong> ${product.category}</p>

                    <p><strong>Price:</strong> GH₵${product.price}</p>

                    <p><strong>Stock:</strong> ${product.stock}</p>

                    <div class="actions">

                        <button class="edit" onclick="editProduct('${product._id}')">
                            ✏️ Edit
                        </button>

                        <button class="delete" onclick="deleteProduct('${product._id}')">
                            🗑️ Delete
                        </button>

                    </div>

                </div>
            `;

            productsContainer.appendChild(card);

        });

    } catch (error) {
        console.error(error);
        productsContainer.innerHTML = "<p>Server Error.</p>";
    }
}

// Delete product
async function deleteProduct(id) {

    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
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

        alert("❌ Failed to delete product.");

    }

}

// Placeholder for Day 24
function editProduct(id) {

    window.location.href = `edit-product.html?id=${id}`;

}

// Load products when page opens
loadProducts();