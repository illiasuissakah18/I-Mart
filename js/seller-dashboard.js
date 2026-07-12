const API_BASE = (function() {
    if (window.location.protocol === "file:") {
        return "http://localhost:5000/api";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://localhost:5000/api";
    }
    return `${window.location.origin}/api`;
})();

const sellerNameEl = document.getElementById("seller-name");
const shopNameEl = document.getElementById("shop-name");
const sellerEmailEl = document.getElementById("seller-email");
const productsCountEl = document.getElementById("stat-products");
const ordersCountEl = document.getElementById("stat-orders");
const revenueEl = document.getElementById("stat-revenue");
const pendingEl = document.getElementById("stat-pending");
const recentProductsEl = document.getElementById("recent-products");
const recentOrdersEl = document.getElementById("recent-orders");

function showLoadingState() {
    if (productsCountEl) productsCountEl.textContent = "...";
    if (ordersCountEl) ordersCountEl.textContent = "...";
    if (revenueEl) revenueEl.textContent = "...";
    if (pendingEl) pendingEl.textContent = "...";
    if (recentProductsEl) recentProductsEl.innerHTML = "<p>Loading products...</p>";
    if (recentOrdersEl) recentOrdersEl.innerHTML = "<p>Loading orders...</p>";
}

function showErrorState() {
    if (productsCountEl) productsCountEl.textContent = "0";
    if (ordersCountEl) ordersCountEl.textContent = "0";
    if (revenueEl) revenueEl.textContent = "GH₵0.00";
    if (pendingEl) pendingEl.textContent = "0";
    if (recentProductsEl) recentProductsEl.innerHTML = "<p>Unable to load products.</p>";
    if (recentOrdersEl) recentOrdersEl.innerHTML = "<p>Unable to load orders.</p>";
}

async function fetchJson(url, headers) {
    const response = await fetch(url, { headers });
    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || "Request failed.");
    }

    return data;
}

async function fetchSellerStats() {
    return fetchJson(`${API_BASE}/sellers/stats`, getAuthHeaders());
}

async function fetchSellerProducts() {
    return fetchJson(`${API_BASE}/products/seller/my-products`, getAuthHeaders());
}

async function fetchSellerOrders() {
    return fetchJson(`${API_BASE}/orders/seller`, getAuthHeaders());
}

function renderProfile() {
    const seller = getCurrentSeller();
    if (!seller) return;

    sellerNameEl.textContent = seller.fullName || "Seller";
    shopNameEl.textContent = seller.shopName || "-";
    sellerEmailEl.textContent = seller.email || "-";
}

function renderStats(stats) {
    productsCountEl.textContent = stats.productsCount ?? "0";
    ordersCountEl.textContent = stats.ordersCount ?? "0";
    revenueEl.textContent = stats.totalRevenue != null ? `GH₵${stats.totalRevenue.toFixed(2)}` : "GH₵0.00";
    pendingEl.textContent = stats.pendingOrders ?? "0";
}

function renderProducts(products) {
    if (!products.length) {
        recentProductsEl.innerHTML = `<p>No recent products yet.</p>`;
        return;
    }

    recentProductsEl.innerHTML = products.slice(0, 5).map(product => {
        const imageUrl = product.image
            ? `${API_BASE.replace("/api", "")}${product.image}`
            : "images/placeholder.png";

        return `
            <div class="dashboard-item" style="display:flex;align-items:center;margin-bottom:0.85rem;">
                <img src="${imageUrl}" alt="${product.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;margin-right:0.85rem;" />
                <div style="min-width:0;">
                    <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px;">${product.name}</div>
                    <div style="font-size:12px;color:#666">GH₵${product.price} · ${product.category || "Uncategorized"}</div>
                </div>
            </div>
        `;
    }).join("");
}

function renderOrders(orders) {
    if (!orders.length) {
        recentOrdersEl.innerHTML = `<p>No recent orders yet.</p>`;
        return;
    }

    recentOrdersEl.innerHTML = orders.slice(0, 5).map(order => {
        const orderId = order._id ? order._id.slice(-6) : "—";
        const status = order.status || order.orderStatus || "Pending";
        const total = order.totalAmount != null ? `GH₵${order.totalAmount.toFixed(2)}` : "GH₵0.00";
        const customerName = order.user?.fullName || order.user?.name || "Customer";
        const firstItem = order.items?.[0] || {};
        const productName = firstItem.product?.name || firstItem.product || "Product";
        const quantity = firstItem.quantity ?? 0;

        return `
            <div class="dashboard-item" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.85rem;gap:0.85rem;">
                <div style="min-width:0;">
                    <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px;">Order #${orderId}</div>
                    <div style="font-size:12px;color:#666">${productName} × ${quantity}</div>
                    <div style="font-size:12px;color:#666">${customerName}</div>
                </div>
                <div style="text-align:right;min-width:110px;">
                    <div style="font-weight:700">${total}</div>
                    <div style="font-size:12px;color:#0077cc">${status}</div>
                </div>
            </div>
        `;
    }).join("");
}

async function loadSellerDashboard() {
    protectSellerDashboard();
    showLoadingState();
    renderProfile();

    try {
        const [statsData, productsData, ordersData] = await Promise.all([
            fetchSellerStats(),
            fetchSellerProducts(),
            fetchSellerOrders()
        ]);

        renderStats(statsData.stats || {});
        renderProducts(productsData.products || []);
        renderOrders(ordersData.orders || []);
    } catch (error) {
        console.error("Dashboard load failed:", error);
        showErrorState();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSellerDashboard);
} else {
    loadSellerDashboard();
}
