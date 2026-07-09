// ===============================
// I MART Products Data
// ===============================

const API_URL = "https://illiasu-imart-api.onrender.com/api/products";

let products = [];

// Load all products
async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        products = await response.json();

        console.log("Products loaded:", products);

        return products;

    } catch (error) {
        console.error("Error loading products:", error);
        return [];
    }
}

// Get products
function getProducts() {
    return products;
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product._id === id);
}

// Load automatically when the page opens
loadProducts();