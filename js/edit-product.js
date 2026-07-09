const API_URL = "https://i-mart-backend.onrender.com/api/products";

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Form
const form = document.getElementById("editProductForm");

// Load product details
async function loadProduct() {

    if (!productId) {
        alert("No product selected.");
        window.location.href = "seller-products.html";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${productId}`);
        const data = await response.json();

        if (!data.success) {
            alert("Product not found.");
            window.location.href = "seller-products.html";
            return;
        }

        const product = data.product;

        document.getElementById("name").value = product.name;
        document.getElementById("description").value = product.description;
        document.getElementById("category").value = product.category;
        document.getElementById("price").value = product.price;
        document.getElementById("stock").value = product.stock;
        document.getElementById("image").value = product.image;

    } catch (error) {

        console.error(error);
        alert("Failed to load product.");

    }

}

// Update product
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const updatedProduct = {

        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim(),
        category: document.getElementById("category").value.trim(),
        price: Number(document.getElementById("price").value),
        stock: Number(document.getElementById("stock").value),
        image: document.getElementById("image").value.trim()

    };

    try {

        const response = await fetch(`${API_URL}/${productId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedProduct)

        });

        const data = await response.json();

        if (data.success) {

            alert("✅ Product updated successfully!");

            window.location.href = "seller-products.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Server Error.");

    }

});

// Load product when page opens
loadProduct();