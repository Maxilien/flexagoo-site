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
    if (tab === "deliveries") loadDeliveries();
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

/* ============================================================
   DELIVERIES TAB (REPLACES ORDERS)
   ============================================================ */

function loadDeliveries(page = 1, statusFilter = "", searchQuery = "") {
  adminFetch(`/api/admin/deliveries?page=${page}&status=${statusFilter}&search=${searchQuery}`)
    .then(data => {

      let html = `
        <div class="search-filter-bar">
          <input id="deliverySearch" placeholder="Search deliveries..." />
          <select id="deliveryStatusFilter">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="accepted">Accepted</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="payout_pending">Payout Pending</option>
            <option value="payout_completed">Payout Completed</option>
          </select>
          <button onclick="applyDeliveryFilters()">Apply</button>
        </div>
      `;

      html += `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>ID</th>
              <th>Sender</th>
              <th>Traveler</th>
              <th>Status</th>
              <th>Price</th>
              <th>Payout</th>
              <th>Type</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Created</th>
              <th>Accepted</th>
              <th>Picked Up</th>
              <th>Delivered</th>
              <th>Payout Completed</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.deliveries.forEach(d => {
        const photo = d.proofPhoto || d.package?.photoUrl || "";
        const senderName = d.sender?.name || "N/A";
        const travelerName = d.travelerDetails
          ? `${d.travelerDetails.firstName} ${d.travelerDetails.lastName}`
          : "N/A";

        html += `
          <tr>
            <td>${photo ? `<img src="${photo}" width="60" height="60" style="border-radius:6px;">` : "—"}</td>
            <td>${d._id}</td>
            <td>${senderName} <br><small>${d.senderId}</small></td>
            <td>${travelerName} <br><small>${d.travelerId || "—"}</small></td>
            <td>${d.status}</td>
            <td>$${d.price}</td>
            <td>$${d.payoutAmount}</td>
            <td>${d.package?.deliveryType || "—"}</td>
            <td>${d.pickup?.address || "—"}</td>
            <td>${d.dropoff?.address || "—"}</td>
            <td>${d.createdAt || "—"}</td>
            <td>${d.acceptedAt || "—"}</td>
            <td>${d.pickedUpAt || "—"}</td>
            <td>${d.deliveredAt || "—"}</td>
            <td>${d.payoutCompletedAt || "—"}</td>
            <td><button onclick="viewDelivery('${d._id}')">View</button></td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
        <div class="pagination">
          ${page > 1 ? `<button onclick="loadDeliveries(${page - 1})">Prev</button>` : ""}
          <button onclick="loadDeliveries(${page + 1})">Next</button>
        </div>
      `;

      document.getElementById("deliveriesTable").innerHTML = html;
    });
}

function applyDeliveryFilters() {
  const searchQuery = document.getElementById("deliverySearch").value;
  const statusFilter = document.getElementById("deliveryStatusFilter").value;
  loadDeliveries(1, statusFilter, searchQuery);
}

/* ============================================================
   VIEW DELIVERY DETAILS MODAL
   ============================================================ */

function viewDelivery(id) {
  adminFetch(`/api/admin/deliveries?id=${id}`).then(d => {

    const photo = d.proofPhoto || d.package?.photoUrl || "";

    document.getElementById("deliveryDetails").innerHTML = `
      <p><strong>ID:</strong> ${d._id}</p>
      <p><strong>Sender:</strong> ${d.sender?.name} (${d.senderId})</p>
      <p><strong>Traveler:</strong> ${d.travelerDetails?.firstName || ""} ${d.travelerDetails?.lastName || ""} (${d.travelerId || "—"})</p>
      <p><strong>Status:</strong> ${d.status}</p>
      <p><strong>Pickup:</strong> ${d.pickup?.address}</p>
      <p><strong>Dropoff:</strong> ${d.dropoff?.address}</p>
      <p><strong>Price:</strong> $${d.price}</p>
      <p><strong>Payout:</strong> $${d.payoutAmount}</p>
      <p><strong>Delivery Type:</strong> ${d.package?.deliveryType}</p>
      <p><strong>Description:</strong> ${d.package?.description}</p>
      <p><strong>Created:</strong> ${d.createdAt}</p>
      <p><strong>Accepted:</strong> ${d.acceptedAt || "N/A"}</p>
      <p><strong>Picked Up:</strong> ${d.pickedUpAt || "N/A"}</p>
      <p><strong>Delivered:</strong> ${d.deliveredAt || "N/A"}</p>
      <p><strong>Payout Completed:</strong> ${d.payoutCompletedAt || "N/A"}</p>
      ${photo ? `<img src="${photo}" width="250" style="margin-top:10px;border-radius:8px;">` : ""}
    `;

    document.getElementById("deliveryModal").style.display = "flex";
  });
}

document.getElementById("closeModal").onclick = () => {
  document.getElementById("deliveryModal").style.display = "none";
};

/* ============================================================
   USERS TAB
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
    if (tab === "deliveries") loadDeliveries();
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

/* ============================================================
   DELIVERIES TAB (REPLACES ORDERS)
   ============================================================ */

function loadDeliveries(page = 1, statusFilter = "", searchQuery = "") {
  adminFetch(`/api/admin/deliveries?page=${page}&status=${statusFilter}&search=${searchQuery}`)
    .then(data => {

      let html = `
        <div class="search-filter-bar">
          <input id="deliverySearch" placeholder="Search deliveries..." />
          <select id="deliveryStatusFilter">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="accepted">Accepted</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="payout_pending">Payout Pending</option>
            <option value="payout_completed">Payout Completed</option>
          </select>
          <button onclick="applyDeliveryFilters()">Apply</button>
        </div>
      `;

      html += `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>ID</th>
              <th>Sender</th>
              <th>Traveler</th>
              <th>Status</th>
              <th>Price</th>
              <th>Payout</th>
              <th>Type</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Created</th>
              <th>Accepted</th>
              <th>Picked Up</th>
              <th>Delivered</th>
              <th>Payout Completed</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.deliveries.forEach(d => {
        const photo = d.proofPhoto || d.package?.photoUrl || "";
        const senderName = d.sender?.name || "N/A";
        const travelerName = d.travelerDetails
          ? `${d.travelerDetails.firstName} ${d.travelerDetails.lastName}`
          : "N/A";

        html += `
          <tr>
            <td>${photo ? `<img src="${photo}" width="60" height="60" style="border-radius:6px;">` : "—"}</td>
            <td>${d._id}</td>
            <td>${senderName} <br><small>${d.senderId}</small></td>
            <td>${travelerName} <br><small>${d.travelerId || "—"}</small></td>
            <td>${d.status}</td>
            <td>$${d.price}</td>
            <td>$${d.payoutAmount}</td>
            <td>${d.package?.deliveryType || "—"}</td>
            <td>${d.pickup?.address || "—"}</td>
            <td>${d.dropoff?.address || "—"}</td>
            <td>${d.createdAt || "—"}</td>
            <td>${d.acceptedAt || "—"}</td>
            <td>${d.pickedUpAt || "—"}</td>
            <td>${d.deliveredAt || "—"}</td>
            <td>${d.payoutCompletedAt || "—"}</td>
            <td><button onclick="viewDelivery('${d._id}')">View</button></td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
        <div class="pagination">
          ${page > 1 ? `<button onclick="loadDeliveries(${page - 1})">Prev</button>` : ""}
          <button onclick="loadDeliveries(${page + 1})">Next</button>
        </div>
      `;

      document.getElementById("deliveriesTable").innerHTML = html;
    });
}

function applyDeliveryFilters() {
  const searchQuery = document.getElementById("deliverySearch").value;
  const statusFilter = document.getElementById("deliveryStatusFilter").value;
  loadDeliveries(1, statusFilter, searchQuery);
}

/* ============================================================
   VIEW DELIVERY DETAILS MODAL
   ============================================================ */

function viewDelivery(id) {
  adminFetch(`/api/admin/deliveries?id=${id}`).then(d => {

    const photo = d.proofPhoto || d.package?.photoUrl || "";

    document.getElementById("deliveryDetails").innerHTML = `
      <p><strong>ID:</strong> ${d._id}</p>
      <p><strong>Sender:</strong> ${d.sender?.name} (${d.senderId})</p>
      <p><strong>Traveler:</strong> ${d.travelerDetails?.firstName || ""} ${d.travelerDetails?.lastName || ""} (${d.travelerId || "—"})</p>
      <p><strong>Status:</strong> ${d.status}</p>
      <p><strong>Pickup:</strong> ${d.pickup?.address}</p>
      <p><strong>Dropoff:</strong> ${d.dropoff?.address}</p>
      <p><strong>Price:</strong> $${d.price}</p>
      <p><strong>Payout:</strong> $${d.payoutAmount}</p>
      <p><strong>Delivery Type:</strong> ${d.package?.deliveryType}</p>
      <p><strong>Description:</strong> ${d.package?.description}</p>
      <p><strong>Created:</strong> ${d.createdAt}</p>
      <p><strong>Accepted:</strong> ${d.acceptedAt || "N/A"}</p>
      <p><strong>Picked Up:</strong> ${d.pickedUpAt || "N/A"}</p>
      <p><strong>Delivered:</strong> ${d.deliveredAt || "N/A"}</p>
      <p><strong>Payout Completed:</strong> ${d.payoutCompletedAt || "N/A"}</p>
      ${photo ? `<img src="${photo}" width="250" style="margin-top:10px;border-radius:8px;">` : ""}
    `;

    document.getElementById("deliveryModal").style.display = "flex";
  });
}

document.getElementById("closeModal").onclick = () => {
  document.getElementById("deliveryModal").style.display = "none";
};

/* ============================================================
   USERS TAB
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
   ESCROW TAB
   ============================================================ */

function loadEscrow() {
  adminFetch("/api/admin/escrow").then(data => {
    document.getElementById("escrowTable").innerHTML = buildTable(data);
  });
}

/* ============================================================
   PAYOUTS TAB
   ============================================================ */

function loadPayouts() {
  adminFetch("/api/admin/payouts").then(data => {
    document.getElementById("payoutsTable").innerHTML = buildTable(data);
  });
}

/* ============================================================
   REVENUE TAB
   ============================================================ */

function loadRevenue() {
  adminFetch("/api/admin/revenue").then(data => {
    document.getElementById("revenueTable").innerHTML = `
      <h3>Total Revenue</h3>
      <p>$${data.totalRevenue}</p>
      <h3>Total Payouts</h3>
      <p>$${data.totalPayouts}</p>
      <h3>Flexago Fee</h3>
      <p>$${data.flexagoFee}</p>
    `;
  });
}

/* ============================================================
   ANALYTICS TAB (4 CHARTS + DATE FILTERS)
   ============================================================ */

let deliveriesChartInstance = null;
let revenueChartInstance = null;
let hourlyChartInstance = null;
let weeklyChartInstance = null;

function loadAnalytics(range = "") {
  adminFetch(`/api/admin/analytics${range ? `?range=${range}` : ""}`).then(data => {
    // Stats block only; canvases already exist in HTML
    document.getElementById("analyticsTable").innerHTML = `
      <p><strong>Total Senders:</strong> ${data.senderCount}</p>
      <p><strong>Total Travelers:</strong> ${data.travelerCount}</p>
      <p><strong>Total Deliveries:</strong> ${data.orderCount}</p>
    `;

    // CHART 1 — Deliveries Per Day
    const ctx1 = document.getElementById("chartDeliveriesPerDay").getContext("2d");
    if (deliveriesChartInstance) deliveriesChartInstance.destroy();
    deliveriesChartInstance = new Chart(ctx1, {
      type: "line",
      data: {
        labels: data.chartDailyOrders.labels,
        datasets: [{
          label: "Deliveries",
          data: data.chartDailyOrders.datasets[0].data,
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          tension: 0.3
        }]
      }
    });

    // CHART 2 — Revenue Per Day
    const ctx2 = document.getElementById("chartRevenuePerDay").getContext("2d");
    if (revenueChartInstance) revenueChartInstance.destroy();
    revenueChartInstance = new Chart(ctx2, {
      type: "line",
      data: {
        labels: data.chartDailyRevenue.labels,
        datasets: [{
          label: "Revenue ($)",
          data: data.chartDailyRevenue.datasets[0].data,
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          tension: 0.3
        }]
      }
    });

    // CHART 3 — Hourly Deliveries
    const ctx3 = document.getElementById("chartHourlyDeliveries").getContext("2d");
    if (hourlyChartInstance) hourlyChartInstance.destroy();
    hourlyChartInstance = new Chart(ctx3, {
      type: "bar",
      data: {
        labels: data.chartHourlyOrders.labels,
        datasets: [{
          label: "Deliveries",
          data: data.chartHourlyOrders.datasets[0].data,
          backgroundColor: "#ffc107"
        }]
      }
    });

    // CHART 4 — Weekly Deliveries
    const ctx4 = document.getElementById("chartWeeklyDeliveries").getContext("2d");
    if (weeklyChartInstance) weeklyChartInstance.destroy();
    weeklyChartInstance = new Chart(ctx4, {
      type: "bar",
      data: {
        labels: data.ordersPerWeek.map(w => `Week ${w._id}`),
        datasets: [{
          label: "Deliveries",
          data: data.ordersPerWeek.map(w => w.count),
          backgroundColor: "#6610f2"
        }]
      }
    });
  });
}

// Load default tab
loadUsers();
