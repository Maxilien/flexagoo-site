// TAB SWITCHING
const tabs = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".tab-section");

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    sections.forEach(sec => {
      sec.style.display = sec.id === tab ? "block" : "none";
    });

    if (tab === "users") loadUsers();
    if (tab === "orders") loadOrders();
    if (tab === "escrow") loadEscrow();
    if (tab === "payouts") loadPayouts();
    if (tab === "revenue") loadRevenue();
    if (tab === "analytics") loadAnalytics();
  });
});

// LOGOUT
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
};

// API CALL HELPER
function adminFetch(url) {
  const token = localStorage.getItem("adminToken");

  return fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }).then(res => res.json());
}

// UTIL — Build HTML Table
function buildTable(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return "<p>No data found.</p>";
  }

  let keys = Object.keys(dataArray[0]);
  let html = "<table class='admin-table'><thead><tr>";

  keys.forEach(k => {
    html += `<th>${k}</th>`;
  });

  html += "</tr></thead><tbody>";

  dataArray.forEach(row => {
    html += "<tr>";
    keys.forEach(k => {
      html += `<td>${row[k]}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
}

/* ============================================================
   STEP 3 — VIEW ORDER DETAILS MODAL
   ============================================================ */

function loadOrders(page = 1, statusFilter = "", searchQuery = "") {
  adminFetch(`/api/admin/orders?page=${page}&status=${statusFilter}&search=${searchQuery}`)
    .then(data => {

      let html = `
        <div class="search-filter-bar">
          <input id="orderSearch" placeholder="Search orders..." />
          <select id="orderStatusFilter">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="delivered">Delivered</option>
          </select>
          <button onclick="applyOrderFilters()">Apply</button>
        </div>
      `;

      html += "<table class='admin-table'><thead><tr>";

      const keys = ["_id", "senderId", "travelerId", "status", "price", "createdAt", "view"];
      keys.forEach(k => html += `<th>${k}</th>`);
      html += "</tr></thead><tbody>";

      data.orders.forEach(order => {
        html += "<tr>";
        html += `<td>${order._id}</td>`;
        html += `<td>${order.senderId}</td>`;
        html += `<td>${order.travelerId}</td>`;
        html += `<td>${order.status}</td>`;
        html += `<td>${order.price}</td>`;
        html += `<td>${order.createdAt}</td>`;
        html += `<td><button onclick="viewOrder('${order._id}')">View</button></td>`;
        html += "</tr>";
      });

      html += "</tbody></table>";

      // Pagination
      html += `
        <div class="pagination">
          ${page > 1 ? `<button onclick="loadOrders(${page - 1})">Prev</button>` : ""}
          <button onclick="loadOrders(${page + 1})">Next</button>
        </div>
      `;

      document.getElementById("ordersTable").innerHTML = html;
    });
}

function applyOrderFilters() {
  const searchQuery = document.getElementById("orderSearch").value;
  const statusFilter = document.getElementById("orderStatusFilter").value;
  loadOrders(1, statusFilter, searchQuery);
}

function viewOrder(orderId) {
  adminFetch(`/api/admin/orders?id=${orderId}`).then(order => {

    document.getElementById("orderDetails").innerHTML = `
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Sender:</strong> ${order.senderId}</p>
      <p><strong>Traveler:</strong> ${order.travelerId}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Pickup:</strong> ${order.pickupAddress}</p>
      <p><strong>Dropoff:</strong> ${order.dropoffAddress}</p>
      <p><strong>Price:</strong> $${order.price}</p>
      <p><strong>Flexago Fee:</strong> $${order.flexagoFee}</p>
      <p><strong>Escrow Status:</strong> ${order.escrowStatus}</p>
      <p><strong>Created:</strong> ${order.createdAt}</p>
      <p><strong>Accepted:</strong> ${order.acceptedAt || "N/A"}</p>
      <p><strong>Delivered:</strong> ${order.deliveredAt || "N/A"}</p>
      ${order.deliveryPhoto ? `<img src="${order.deliveryPhoto}" width="200">` : ""}
    `;

    document.getElementById("orderModal").style.display = "flex";
  });
}

// Close modal
document.getElementById("closeModal").onclick = () => {
  document.getElementById("orderModal").style.display = "none";
};

/* ============================================================
   STEP 4 — SEARCH + FILTERING + PAGINATION (USERS)
   ============================================================ */

function loadUsers(page = 1, searchQuery = "") {
  adminFetch(`/api/admin/users?page=${page}&search=${searchQuery}`)
    .then(data => {

      const senders = data.senders || [];
      const travelers = data.travelers || [];

      let html = `
        <div class="search-filter-bar">
          <input id="userSearch" placeholder="Search users..." />
          <button onclick="applyUserSearch()">Search</button>
        </div>
      `;

      html += `
        <h3>Senders</h3>
        ${buildTable(senders)}
        <h3>Travelers</h3>
        ${buildTable(travelers)}
      `;

      html += `
        <div class="pagination">
          ${page > 1 ? `<button onclick="loadUsers(${page - 1})">Prev</button>` : ""}
          <button onclick="loadUsers(${page + 1})">Next</button>
        </div>
      `;

      document.getElementById("usersTable").innerHTML = html;
    });
}

function applyUserSearch() {
  const query = document.getElementById("userSearch").value;
  loadUsers(1, query);
}

/* ============================================================
   OTHER TABS
   ============================================================ */

function loadEscrow() {
  adminFetch("/api/admin/escrow").then(data => {
    document.getElementById("escrowTable").innerHTML = buildTable(data);
  });
}

function loadPayouts() {
  adminFetch("/api/admin/payouts").then(data => {
    document.getElementById("payoutsTable").innerHTML = buildTable(data);
  });
}

function loadRevenue() {
  adminFetch("/api/admin/revenue").then(data => {
    document.getElementById("revenueTable").innerHTML = `
      <h3>Total Revenue</h3>
      <p>$${data.totalRevenue}</p>
    `;
  });
}

function loadAnalytics() {
  adminFetch("/api/admin/analytics").then(data => {
    document.getElementById("analyticsTable").innerHTML = `
      <p><strong>Total Senders:</strong> ${data.senderCount}</p>
      <p><strong>Total Travelers:</strong> ${data.travelerCount}</p>
      <p><strong>Total Orders:</strong> ${data.orderCount}</p>
    `;
  });
}

// Load default tab
loadUsers();
