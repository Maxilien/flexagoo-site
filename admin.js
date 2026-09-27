/* ============================================================
   TAB SWITCHING
============================================================ */

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

/* ============================================================
   LOGOUT
============================================================ */

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
};

/* ============================================================
   API CALL HELPER
============================================================ */

const API_BASE = "https://flexago-backend.onrender.com";

function adminFetch(path) {
  const token = localStorage.getItem("adminToken");

  return fetch(API_BASE + path, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(async res => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON: " + text);
    }
  });
}

/* ============================================================
   DELIVERIES TAB
============================================================ */

function loadDeliveries(page = 1, statusFilter = "", searchQuery = "") {
  adminFetch(
    `/api/admin/deliveries?page=${page}&status=${statusFilter}&search=${searchQuery}`
  ).then(data => {
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
      const senderName = d.sender
        ? `${d.sender.firstName || ""} ${d.sender.lastName || ""}`.trim() ||
          d.sender.email ||
          "N/A"
        : "N/A";
      const travelerName = d.travelerDetails
        ? `${d.travelerDetails.firstName} ${d.travelerDetails.lastName}`
        : "N/A";

      html += `
        <tr>
          <td>${
            photo
              ? `<img src="${photo}" width="60" height="60" style="border-radius:6px;">`
              : "—"
          }</td>
          <td>${d._id}</td>
          <td>${senderName} <br><small>${d.senderId || "—"}</small></td>
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

    const senderName = d.sender
      ? `${d.sender.firstName || ""} ${d.sender.lastName || ""}`.trim() ||
        d.sender.email ||
        "N/A"
      : "N/A";

    document.getElementById("deliveryDetails").innerHTML = `
      <p><strong>ID:</strong> ${d._id}</p>
      <p><strong>Sender:</strong> ${senderName} (${d.senderId || "—"})</p>
      <p><strong>Traveler:</strong> ${d.travelerDetails?.firstName || ""} ${
      d.travelerDetails?.lastName || ""
    } (${d.travelerId || "—"})</p>
      <p><strong>Status:</strong> ${d.status}</p>
      <p><strong>Pickup:</strong> ${d.pickup?.address || "—"}</p>
      <p><strong>Dropoff:</strong> ${d.dropoff?.address || "—"}</p>
      <p><strong>Price:</strong> $${d.price}</p>
      <p><strong>Payout:</strong> $${d.payoutAmount}</p>
      <p><strong>Delivery Type:</strong> ${d.package?.deliveryType || "—"}</p>
      <p><strong>Description:</strong> ${d.package?.description || "—"}</p>
      <p><strong>Created:</strong> ${d.createdAt || "—"}</p>
      <p><strong>Accepted:</strong> ${d.acceptedAt || "N/A"}</p>
      <p><strong>Picked Up:</strong> ${d.pickedUpAt || "N/A"}</p>
      <p><strong>Delivered:</strong> ${d.deliveredAt || "N/A"}</p>
      <p><strong>Payout Completed:</strong> ${d.payoutCompletedAt || "N/A"}</p>
      ${
        photo
          ? `<img src="${photo}" width="250" style="margin-top:10px;border-radius:8px;">`
          : ""
      }
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

let usersAutoRefreshInterval = null;
let currentUsersPage = 1;
let currentUsersSearch = "";

function loadUsers(page = 1, searchQuery = "") {
  currentUsersPage = page;
  currentUsersSearch = searchQuery;

  adminFetch(`/api/admin/users?page=${page}&search=${searchQuery}`).then(
    data => {
      const senders = data.senders || [];
      const travelers = data.travelers || [];

      let html = `
        <div class="search-filter-bar">
          <input id="userSearch" placeholder="Search users..." value="${searchQuery}" />
          <button onclick="applyUserSearch()">Search</button>
        </div>
      `;

      html += `
        <h3>Senders</h3>
        ${buildSenderTable(senders)}
        <h3>Traveler Map</h3>
        <div id="travelerMap"></div>
        <h3>Travelers</h3>
        ${buildTravelerTable(travelers)}
        <div class="pagination">
          ${page > 1 ? `<button onclick="loadUsers(${page - 1}, '${searchQuery}')">Prev</button>` : ""}
          <button onclick="loadUsers(${page + 1}, '${searchQuery}')">Next</button>
        </div>
      `;

      document.getElementById("usersTable").innerHTML = html;

      // Render Google Maps traveler map
      renderTravelerMap(travelers);

      // Set up auto-refresh every 10 seconds (only once)
      if (!usersAutoRefreshInterval) {
        usersAutoRefreshInterval = setInterval(() => {
          loadUsers(currentUsersPage, currentUsersSearch);
        }, 10000);
      }
    }
  );
}

function applyUserSearch() {
  const query = document.getElementById("userSearch").value;
  loadUsers(1, query);
}

/* ============================================================
   CUSTOM TABLE BUILDERS
============================================================ */

function badge(text, type) {
  return `<span class="badge ${type}">${text}</span>`;
}

function buildSenderTable(senders) {
  if (!Array.isArray(senders) || senders.length === 0) {
    return "<p>No senders found.</p>";
  }

  let html = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>DOB</th>
          <th>Address</th>
          <th>City</th>
          <th>State</th>
          <th>Zip</th>
          <th>Country</th>
          <th>KYC</th>
        </tr>
      </thead>
      <tbody>
  `;

  senders.forEach(u => {
    const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "N/A";
    const kycBadge = u.kycVerified
      ? badge("Verified ✓", "verified")
      : badge("Pending", "pending");

    html += `
      <tr>
        <td>${name}</td>
        <td>${u.email || "—"}</td>
        <td>${u.phone || "—"}</td>
        <td>${u.dob || "—"}</td>
        <td>${u.address || "—"}</td>
        <td>${u.city || "—"}</td>
        <td>${u.state || "—"}</td>
        <td>${u.zipcode || "—"}</td>
        <td>${u.country || "—"}</td>
        <td>${kycBadge}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  return html;
}

function buildTravelerTable(travelers) {
  if (!Array.isArray(travelers) || travelers.length === 0) {
    return "<p>No travelers found.</p>";
  }

  let html = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Rating</th>
          <th>Verified</th>
          <th>Last Location</th>
        </tr>
      </thead>
      <tbody>
  `;

  travelers.forEach(t => {
    const user = t.user || {};
    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";

    const statusBadge =
      t.status === "online"
        ? badge("Online", "verified")
        : t.status === "on_delivery"
        ? badge("On Delivery", "pending")
        : badge("Offline", "rejected");

    const verifiedBadge = t.verified
      ? badge("Verified ✓", "verified")
      : badge("Not Verified", "rejected");

    const lastLocation =
      t.location && t.location.coordinates
        ? `Lat: ${t.location.coordinates[1].toFixed(
            4
          )}, Lng: ${t.location.coordinates[0].toFixed(4)}`
        : "N/A";

    html += `
      <tr>
        <td>${name}</td>
        <td>${user.email || "—"}</td>
        <td>${user.phone || "—"}</td>
        <td>${statusBadge}</td>
        <td>${t.rating != null ? t.rating : "—"}</td>
        <td>${verifiedBadge}</td>
        <td>${lastLocation}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  return html;
}

/* ============================================================
   GENERIC TABLE BUILDER (for escrow/payouts)
============================================================ */

function buildTable(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return "<p>No data available.</p>";
  }

  let headers = Object.keys(data[0]);

  let html = "<table class='admin-table'><thead><tr>";
  headers.forEach(h => {
    html += `<th>${h}</th>`;
  });
  html += "</tr></thead><tbody>";

  data.forEach(row => {
    html += "<tr>";
    headers.forEach(h => {
      html += `<td>${row[h] ?? "—"}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
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
   ANALYTICS TAB
============================================================ */

let deliveriesChartInstance = null;
let revenueChartInstance = null;
let hourlyChartInstance = null;
let weeklyChartInstance = null;

function loadAnalytics(range = "") {
  adminFetch(`/api/admin/analytics${range ? `?range=${range}` : ""}`).then(
    data => {
      document.getElementById("analyticsTable").innerHTML = `
        <p><strong>Total Senders:</strong> ${data.senderCount}</p>
        <p><strong>Total Travelers:</strong> ${data.travelerCount}</p>
        <p><strong>Total Deliveries:</strong> ${data.orderCount}</p>
      `;

      const ctx1 =
        document.getElementById("chartDeliveriesPerDay").getContext("2d");
      if (deliveriesChartInstance) deliveriesChartInstance.destroy();
      deliveriesChartInstance = new Chart(ctx1, {
        type: "line",
        data: {
          labels: data.chartDailyOrders.labels,
          datasets: [
            {
              label: "Deliveries",
              data: data.chartDailyOrders.datasets[0].data,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.2)",
              tension: 0.3
            }
          ]
        }
      });

      const ctx2 =
        document.getElementById("chartRevenuePerDay").getContext("2d");
      if (revenueChartInstance) revenueChartInstance.destroy();
      revenueChartInstance = new Chart(ctx2, {
        type: "line",
        data: {
          labels: data.chartDailyRevenue.labels,
          datasets: [
            {
              label: "Revenue ($)",
              data: data.chartDailyRevenue.datasets[0].data,
              borderColor: "#28a745",
              backgroundColor: "rgba(40, 167, 69, 0.2)",
              tension: 0.3
            }
          ]
        }
      });

      const ctx3 =
        document.getElementById("chartHourlyDeliveries").getContext("2d");
      if (hourlyChartInstance) hourlyChartInstance.destroy();
      hourlyChartInstance = new Chart(ctx3, {
        type: "bar",
        data: {
          labels: data.chartHourlyOrders.labels,
          datasets: [
            {
              label: "Deliveries",
              data: data.chartHourlyOrders.datasets[0].data,
              backgroundColor: "#ffc107"
            }
          ]
        }
      });

      const ctx4 =
        document.getElementById("chartWeeklyDeliveries").getContext("2d");
      if (weeklyChartInstance) weeklyChartInstance.destroy();
      weeklyChartInstance = new Chart(ctx4, {
        type: "bar",
        data: {
          labels: data.ordersPerWeek.map(w => `Week ${w._id}`),
          datasets: [
            {
              label: "Deliveries",
              data: data.ordersPerWeek.map(w => w.count),
              backgroundColor: "#6610f2"
            }
          ]
        }
      });
    }
  );
}

/* ============================================================
   GOOGLE MAPS — TRAVELER MAP
============================================================ */

function renderTravelerMap(travelers) {
  const mapContainer = document.getElementById("travelerMap");
  if (!mapContainer) return;

  const map = new google.maps.Map(mapContainer, {
    center: { lat: 39.5, lng: -98.35 }, // USA center
    zoom: 4
  });

  travelers.forEach(t => {
    if (!t.location || !t.location.coordinates) return;

    const lng = t.location.coordinates[0];
    const lat = t.location.coordinates[1];
    const user = t.user || {};

    const iconUrl =
      t.status === "online"
        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        : t.status === "on_delivery"
        ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
        : "http://maps.google.com/mapfiles/ms/icons/grey-dot.png";

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      icon: {
        url: iconUrl
      }
    });

    const info = new google.maps.InfoWindow({
      content: `
        <strong>${user.firstName || ""} ${user.lastName || ""}</strong><br>
        Status: ${t.status || "N/A"}<br>
        Rating: ${t.rating != null ? t.rating : "N/A"}<br>
        Verified: ${t.verified ? "Yes" : "No"}<br>
        Last Update: ${t.location.updatedAt || "N/A"}
      `
    });

    marker.addListener("click", () => info.open(map, marker));
  });
}

/* ============================================================
   DEFAULT TAB
============================================================ */

loadUsers();

