/*
==========================================
I MART Fashion Marketplace
File: admin.js
Version: 1.0
Milestone: ADMIN DASHBOARD
==========================================
*/

// ============================
// GET PRODUCTS
// ============================

function getProducts() {
    return JSON.parse(localStorage.getItem("admin-products")) || [];
}

// ============================
// SAVE PRODUCTS
// ============================

function saveProducts(list) {
    localStorage.setItem("admin-products", JSON.stringify(list));
}

// ============================
// ADD PRODUCT
// ============================

function addProduct() {

    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const brand = document.getElementById("brand").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;

    if (!name || !category || !brand || !price || !image) {
        alert("Fill all fields");
        return;
    }

    let list = getProducts();

    const newProduct = {
        id: Date.now(),
        name,
        category,
        brand,
        price: Number(price),
        oldPrice: Number(price) + 50,
        rating: 4.5,
        reviews: 0,
        image,
        badge: "New",
        stock: 10
    };

    list.push(newProduct);

    saveProducts(list);

    renderAdmin();

    clearForm();
}

// ============================
// DELETE PRODUCT
// ============================

function deleteProduct(id) {

    let list = getProducts();

    list = list.filter(p => p.id !== id);

    saveProducts(list);

    renderAdmin();
}

// ============================
// RENDER PRODUCTS
// ============================

function renderAdmin() {

    const container = document.getElementById("admin-product-list");

    let list = getProducts();

if (list.length === 0) {
    list = defaultProducts;
}

    container.innerHTML = "";

    list.forEach(product => {

        container.innerHTML += `
            <div class="admin-card">

                <img src="${product.image}" width="60">

                <div>
                    <h4>${product.name}</h4>
                    <p>${product.category} | GH₵${product.price}</p>

                    <button onclick="deleteProduct(${product.id})">Delete</button>
                </div>

            </div>
        `;
    });
}

// ============================
// CLEAR FORM
// ============================

function clearForm() {

    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";
}

// ============================
// INIT
// ============================

document.addEventListener("DOMContentLoaded", () => {
    renderAdmin();
});