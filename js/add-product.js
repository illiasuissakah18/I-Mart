/*
==========================================
I MART Marketplace
Add Product
Version: 4.0
==========================================
*/

const API_URL = "http://localhost:5000/api/products";

const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    // Get JWT token
    const token = localStorage.getItem("sellerToken");

    if (!token) {
        alert("Please login first.");
        window.location.href = "seller-login.html";
        return;
    }

    // Create FormData
    const formData = new FormData();

    formData.append(
        "name",
        document.getElementById("name").value.trim()
    );

    formData.append(
        "description",
        document.getElementById("description").value.trim()
    );

    formData.append(
        "category",
        document.getElementById("category").value.trim()
    );

    formData.append(
        "price",
        document.getElementById("price").value
    );

    formData.append(
        "stock",
        document.getElementById("stock").value
    );

    // Product Image
    const image = document.getElementById("image").files[0];

    if (image) {
        formData.append("image", image);
    }

    try {

        const response = await fetch(`${API_URL}/add`, {

            method: "POST",

            headers: {

                Authorization: `Bearer ${token}`

            },

            body: formData

        });

        const data = await response.json();

        if (data.success) {

            alert("✅ Product added successfully!");

            productForm.reset();

            window.location.href = "seller-products.html";

        } else {

            alert(data.message || "Failed to add product.");

        }

    } catch (error) {

        console.error("Add Product Error:", error);

        alert("❌ Server error. Please try again.");

    }

});