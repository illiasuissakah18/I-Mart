from pathlib import Path

html_path = Path(r'C:\Users\OH JAH\Desktop\I MART\seller-dashboard.html')
js_path = Path(r'C:\Users\OH JAH\Desktop\I MART\js\seller-dashboard.js')

html_content = html_path.read_text(encoding='utf-8')
if 'dashboard-lists' not in html_content:
    html_content = html_content.replace(
        '<div class="dashboard-actions">\n\n\n<a href="seller-products.html" class="btn">\n📦 Manage Products\n</a>\n\n\n<a href="seller-orders.html" class="btn">\n🛒 View Orders\n</a>\n\n\n<a href="add-product.html" class="btn">\n➕ Add Product\n</a>\n\n\n<a href="#" onclick="logoutSeller()" class="btn">\n🚪 Logout\n</a>\n\n\n</div>\n\n\n</section>',
        '<div class="dashboard-actions">\n\n\n<a href="seller-products.html" class="btn">\n📦 Manage Products\n</a>\n\n\n<a href="seller-orders.html" class="btn">\n🛒 View Orders\n</a>\n\n\n<a href="add-product.html" class="btn">\n➕ Add Product\n</a>\n\n\n<a href="#" onclick="logoutSeller()" class="btn">\n🚪 Logout\n</a>\n\n\n</div>\n\n\n<!-- Recent Products and Orders -->\n<div class="dashboard-lists" style="margin-top:1.5rem;display:flex;gap:1rem;flex-wrap:wrap;">\n  <div class="list-card" style="flex:1;min-width:280px;border:1px solid #eaeaea;padding:1rem;border-radius:6px;">\n    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">\n      <strong>Recent Products</strong>\n      <a href="seller-products.html">View all</a>\n    </div>\n    <div id="recent-products">\n      <p>Loading products...</p>\n    </div>\n  </div>\n\n  <div class="list-card" style="flex:1;min-width:320px;border:1px solid #eaeaea;padding:1rem;border-radius:6px;">\n    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">\n      <strong>Recent Orders</strong>\n      <a href="seller-orders.html">View all</a>\n    </div>\n    <div id="recent-orders">\n      <p>Loading orders...</p>\n    </div>\n  </div>\n</div>\n\n\n</section>'
    )
    html_path.write_text(html_content, encoding='utf-8')

js_content = '''// js/seller-dashboard.js
const token = localStorage.getItem('sellerToken');

async function fetchJson(path, opts = {}) {
  const headers = opts.headers || {};
  if (token) headers.Authorization = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';
  const res = await fetch(path, { ...opts, headers });
  return res.json();
}

async function loadDashboard() {
  if (!token) {
    window.location.href = 'seller-login.html';
    return;
  }

  try {
    const profile = await fetchJson('/api/sellers/profile');
    if (profile.success) {
      document.getElementById('seller-name').textContent = profile.seller.fullName;
      document.getElementById('shop-name').textContent = profile.seller.shopName;
      document.getElementById('seller-email').textContent = profile.seller.email;
    }

    const statsResp = await fetchJson('/api/sellers/stats');
    if (statsResp.success) {
      const s = statsResp.stats;
      document.getElementById('stat-products').textContent = s.productsCount ?? 0;
      document.getElementById('stat-orders').textContent = s.ordersCount ?? 0;
      document.getElementById('stat-revenue').textContent = (s.totalRevenue ?? 0).toFixed(2);
      document.getElementById('stat-pending').textContent = s.pendingOrders ?? 0;
    }

    await loadRecentProducts();
    await loadRecentOrders();
  } catch (err) {
    console.error('Dashboard Error:', err);
  }
}

async function loadRecentProducts() {
  const container = document.getElementById('recent-products');
  if (!container) return;

  try {
    const res = await fetchJson('/api/products/seller/my-products');
    if (!res.success || !res.products || !res.products.length) {
      container.innerHTML = '<p>No products found.</p>';
      return;
    }

    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '0.75rem';

    res.products.slice(0, 6).forEach(p => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'space-between';
      item.style.gap = '0.75rem';
      item.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.75rem;flex:1;">
          <img src="${p.image || 'images/placeholder.png'}" alt="${(p.name || '').slice(0, 30)}" style="width:52px;height:52px;object-fit:cover;border-radius:6px;border:1px solid #eee;" />
          <div>
            <div style="font-weight:600">${p.name}</div>
            <div style="font-size:12px;color:#666">GHS ${Number(p.price || 0).toFixed(2)} · Stock: ${p.stock ?? 0}</div>
          </div>
        </div>
        <div style="min-width:80px;text-align:right;font-size:13px;">
          <a href="edit-product.html?id=${p._id}">Edit</a>
        </div>
      `;
      list.appendChild(item);
    });

    container.innerHTML = '';
    container.appendChild(list);
  } catch (err) {
    console.error('Load Recent Products error:', err);
    container.innerHTML = '<p>Error loading products.</p>';
  }
}

async function loadRecentOrders() {
  const container = document.getElementById('recent-orders');
  if (!container) return;

  try {
    const res = await fetchJson('/api/orders/seller');
    if (!res.success || !res.orders || !res.orders.length) {
      container.innerHTML = '<p>No orders yet.</p>';
      return;
    }

    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '0.75rem';

    res.orders.slice(0, 6).forEach(o => {
      const total = Number(o.totalAmount ?? o.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0) || 0);
      const status = o.status || o.orderStatus || o.paymentStatus || 'Pending';
      const date = o.createdAt ? new Date(o.createdAt).toLocaleString() : '';
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'space-between';
      item.style.gap = '0.75rem';
      item.innerHTML = `
        <div style="flex:1;">
          <div style="font-weight:600">Order ${String(o._id).slice(0, 8)}</div>
          <div style="font-size:12px;color:#666">${date} · ${(o.items?.length) ?? 0} items · GHS ${total.toFixed(2)}</div>
        </div>
        <div style="min-width:110px;text-align:right;">
          <div style="font-weight:600">${status}</div>
          <a href="seller-orders.html#order-${o._id}" style="font-size:13px;">View</a>
        </div>
      `;
      list.appendChild(item);
    });

    container.innerHTML = '';
    container.appendChild(list);
  } catch (err) {
    console.error('Load Recent Orders error:', err);
    container.innerHTML = '<p>Error loading orders.</p>';
  }
}

window.addEventListener('DOMContentLoaded', loadDashboard);
'''
js_path.write_text(js_content, encoding='utf-8')
print('dashboard js rewritten')
