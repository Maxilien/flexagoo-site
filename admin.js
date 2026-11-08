/* ============================================================
   ADMIN NAVIGATION
============================================================ */

const tabs =
  document.querySelectorAll(
    ".tab-btn"
  );

const sections =
  document.querySelectorAll(
    ".tab-section"
  );

const pageTitle =
  document.getElementById(
    "adminPageTitle"
  );

const pageDescription =
  document.getElementById(
    "adminPageDescription"
  );

/* ============================================================
   PAGE INFORMATION
============================================================ */

const adminPageInformation = {
  dashboard: {
    title: "Dashboard",
    description:
      "Monitor FlexaGo marketplace operations."
  },

  users: {
    title: "Users",
    description:
      "Manage Senders, Travelers, and verification status."
  },

  deliveries: {
    title: "Deliveries",
    description:
      "Monitor FlexaGo delivery activity and status."
  },

  escrow: {
    title: "Escrow",
    description:
      "Monitor funds held for active deliveries."
  },

  payouts: {
    title: "Payouts",
    description:
      "Monitor Traveler payout activity."
  },

  revenue: {
    title: "Revenue",
    description:
      "Review FlexaGo marketplace financial performance."
  },

  promos: {
    title: "Promos & rewards",
    description:
      "Create promo codes and track referral rewards."
  },

  analytics: {
    title: "Analytics",
    description:
      "Monitor marketplace growth and operating trends."
  },

  support: {
    title: "Support",
    description:
      "Review and manage Sender and Traveler support requests."
  }
};
/* ============================================================
   FORMAT ADMIN MONEY
============================================================ */

// User-entered text is shown as text, never run as page code.
function esc(value) {
  const box = document.createElement("span");
  box.textContent = value ?? "";
  return box.innerHTML.replace(/"/g, "&quot;");
}

function formatAdminDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const STATUS_TONES = {
  delivered: "good", completed: "good", payout_completed: "good", resolved: "good", paid: "good",
  available: "info", accepted: "info", picked_up: "info", in_transit: "info", in_progress: "info",
  pending: "warn", payout_pending: "warn", open: "warn", normal: "idle", high: "warn", under_review: "warn",
  clear: "good", invited: "info", consider: "warn", suspended: "bad", not_started: "idle",
  cancelled: "bad", failed: "bad", refunded: "bad", urgent: "bad", closed: "idle",
  active: "good", off: "idle", credited: "good", owed: "warn"
};

function statusPill(status) {
  const label = String(status || "unknown").replace(/_/g, " ");
  const text = label.charAt(0).toUpperCase() + label.slice(1);

  return `<span class="admin-status ${STATUS_TONES[status] || "idle"}">${esc(text)}</span>`;
}

function formatAdminMoney(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "$0.00";
  }

  return amount.toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );
}

/* ============================================================
   UPDATE PAGE HEADER
============================================================ */

function updateAdminPageHeader(
  tabName
) {
  const pageInformation =
    adminPageInformation[
      tabName
    ] ||
    adminPageInformation.dashboard;

  if (pageTitle) {
    pageTitle.textContent =
      pageInformation.title;
  }

  if (pageDescription) {
    pageDescription.textContent =
      pageInformation.description;
  }
}

/* ============================================================
   UPDATE ACTIVE NAVIGATION
============================================================ */

function updateAdminActiveNavigation(
  tabName
) {
  tabs.forEach((button) => {
    const isActive =
      button.dataset.tab ===
      tabName;

    button.classList.toggle(
      "active",
      isActive
    );

    if (isActive) {
      button.setAttribute(
        "aria-current",
        "page"
      );
    } else {
      button.removeAttribute(
        "aria-current"
      );
    }
  });
}

/* ============================================================
   LOAD TAB DATA
============================================================ */

function loadAdminTabData(
  tabName
) {
  if (tabName === "dashboard") {
    loadDashboard();
  }
  if (tabName === "users") {
    loadUsers();
  }

  if (tabName === "deliveries") {
    loadDeliveries();
  }

  if (tabName === "escrow") {
    loadEscrow();
  }

  if (tabName === "payouts") {
    loadPayouts();
  }

  if (tabName === "revenue") {
    loadRevenue();
  }

  if (tabName === "analytics") {
    loadAnalytics();
  }

  if (tabName === "promos") {
    loadPromos();
  }

   if (tabName === "support") {
    loadSupport();
  }
}
/* ============================================================
   DASHBOARD DATA
============================================================ */

function renderAttentionList(items) {
  const list = document.getElementById("adminAttentionRequired");
  if (!list) return;

  list.innerHTML = items.map((item) => `
    <button type="button" class="admin-attention-row" data-open-tab="${item.tab}">
      <span class="admin-attention-count ${item.count ? "" : "clear"}">${item.count}</span>
      <span>${item.label}</span>
      <i data-lucide="chevron-right"></i>
    </button>
  `).join("");

  refreshAdminIcons();
}

function loadFailedRefunds() {
  return adminFetch("/api/admin/deliveries?page=1&status=&search=&refund=failed")
    .then((data) => Number(data?.total) || 0)
    .catch(() => 0);
}

function loadDashboardChart() {
  adminFetch("/api/admin/analytics?range=30d").then((data) => {
    drawAdminChart("adminDashboardActivity", {
      type: "line",
      labels: data.chartDailyOrders.labels,
      values: data.chartDailyOrders.datasets[0].data,
      name: "Deliveries"
    });
  });
}

function loadDashboard() {
  loadDashboardChart();

  const usersElement =
    document.getElementById(
      "adminKpiUsers"
    );

  const deliveriesElement =
    document.getElementById(
      "adminKpiDeliveries"
    );

  const escrowElement =
    document.getElementById(
      "adminKpiEscrow"
    );

  const payoutsElement =
    document.getElementById(
      "adminKpiPayouts"
    );

  const revenueElement =
    document.getElementById(
      "adminKpiRevenue"
    );
  const flexagoFeeElement =
    document.getElementById(
      "adminKpiFlexaGoFee"
    );
  const supportElement =
    document.getElementById(
      "adminKpiSupport"
    );

  Promise.all([
    adminFetch(
      "/api/admin/users?page=1&search="
    ),

    adminFetch(
      "/api/admin/deliveries?page=1&status=&search="
    ),

    adminFetch(
      "/api/admin/escrow"
    ),

    adminFetch(
      "/api/admin/payouts"
    ),

    adminFetch(
      "/api/admin/revenue"
    ),

    adminFetch(
      "/api/support-tickets/admin?limit=100"
    ),
    loadFailedRefunds()
  ])
    .then(
      ([
        usersData,
        deliveriesData,
        escrowData,
        payoutsData,
        revenueData,
        supportData,
        failedRefunds
      ]) => {
        const totalUsers =
          Number(
            usersData?.totals?.users
          ) || 0;

        const totalDeliveries =
          Number(
            deliveriesData?.total
          ) || 0;

        const totalEscrow =
          Array.isArray(escrowData)
            ? escrowData.length
            : 0;

        const totalPayouts =
          Number(
            revenueData?.totalPayouts
          ) || 0;

        const totalRevenue =
          Number(
            revenueData?.totalRevenue
          ) || 0;

        const flexagoFee =
          Number(
            revenueData?.flexagoFee
          ) || 0;

        const supportTickets =
          Array.isArray(
            supportData?.data
          )
            ? supportData.data
            : [];

        const activeSupport =
          supportTickets.filter(
            ticket =>
              ticket.status !==
                "resolved" &&
              ticket.status !==
                "closed"
          ).length;

        if (usersElement) {
          usersElement.textContent =
            totalUsers;
        }

        if (deliveriesElement) {
          deliveriesElement.textContent =
            totalDeliveries;
        }

        if (escrowElement) {
          escrowElement.textContent =
            totalEscrow;
        }

        if (payoutsElement) {
          payoutsElement.textContent =
            formatAdminMoney(
              totalPayouts
            );
        }

        if (revenueElement) {
          revenueElement.textContent =
            formatAdminMoney(
              totalRevenue
            );
        }

        if (flexagoFeeElement) {
          flexagoFeeElement.textContent =
            formatAdminMoney(
              flexagoFee
            );
        }

        if (supportElement) {
          supportElement.textContent =
            activeSupport;
        }

        const supportBadge =
          document.getElementById(
            "adminSupportBadge"
          );

        if (supportBadge) {
          supportBadge.textContent =
            String(
              activeSupport
            ).padStart(
              2,
              "0"
            );
        }

        renderAttentionList([
          { label: "Open support tickets", count: activeSupport, tab: "support" },
          { label: "Identity checks pending", count: Number(usersData?.totals?.kycPending) || 0, tab: "users" },
          { label: "Deliveries with funds in escrow", count: totalEscrow, tab: "escrow" },
          { label: "Refunds that failed", count: failedRefunds, tab: "deliveries" }
        ]);
      }
    )
    .catch(error => {
      console.error(
        "Admin Dashboard load error:",
        error
      );
    });
}
/* ============================================================
   OPEN ADMIN TAB
============================================================ */
function openAdminTab(
  tabName,
  loadData = true
) {
  const targetSection =
    document.getElementById(
      tabName
    );

  if (!targetSection) {
    console.warn(
      "Admin tab was not found:",
      tabName
    );

    return;
  }

  sections.forEach((section) => {
    section.style.display =
      section.id === tabName
        ? "block"
        : "none";
  });

  updateAdminActiveNavigation(
    tabName
  );

  updateAdminPageHeader(
    tabName
  );

  if (loadData) {
    loadAdminTabData(
      tabName
    );
  }

  try {
    sessionStorage.setItem(
      "flexagoAdminActiveTab",
      tabName
    );
  } catch (error) {
    console.warn(
      "Unable to save Admin active tab:",
      error
    );
  }
}

/* ============================================================
   SIDEBAR TAB EVENTS
============================================================ */

tabs.forEach((button) => {
  button.addEventListener(
    "click",
    () => {
      const tabName =
        button.dataset.tab;

      if (!tabName) {
        return;
      }

      openAdminTab(
        tabName
      );
    }
  );
});

/* ============================================================
   DASHBOARD KPI NAVIGATION
============================================================ */

// Also covers rows added later, such as the Attention list.
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-tab]");

  if (button?.dataset.openTab) {
    openAdminTab(button.dataset.openTab);
  }
});

/* ============================================================
   INITIAL ADMIN TAB
============================================================ */

let initialAdminTab =
  "dashboard";

try {
  const savedAdminTab =
    sessionStorage.getItem(
      "flexagoAdminActiveTab"
    );

  if (
    savedAdminTab &&
    document.getElementById(
      savedAdminTab
    )
  ) {
    initialAdminTab =
      savedAdminTab;
  }
} catch (error) {
  console.warn(
    "Unable to restore Admin active tab:",
    error
  );
}
/* ============================================================
   LOGOUT
============================================================ */

function logoutAdmin() {
  localStorage.removeItem(
    "adminToken"
  );

  try {
    sessionStorage.removeItem(
      "flexagoAdminActiveTab"
    );
  } catch (error) {
    console.warn(
      "Unable to clear Admin tab state:",
      error
    );
  }

  window.location.replace(
    "admin-login.html"
  );
}

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );

if (logoutBtn) {
  logoutBtn.onclick =
    logoutAdmin;
} else {
  console.error(
    "Admin logout button was not found."
  );
}
/* ============================================================
   API CALL HELPER
============================================================ */

const API_BASE =
  "https" +
  "://" +
  "flexago-backend.onrender.com";

function adminFetch(path) {
  const token =
    localStorage.getItem(
      "adminToken"
    );

  return fetch(
    API_BASE + path,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  ).then(async (res) => {
    const text =
      await res.text();

    try {
      return JSON.parse(
        text
      );
    } catch {
      throw new Error(
        "Invalid JSON: " + text
      );
    }
  });
}
function updateDeliveryKpis(deliveries) {
  if (!Array.isArray(deliveries)) {
    return;
  }

  const total =
    deliveries.length;

  const available =
    deliveries.filter(
      (delivery) =>
        delivery.status === "available"
    ).length;

  const inTransit =
    deliveries.filter(
      (delivery) =>
        delivery.status === "in_transit"
    ).length;

  const completed =
    deliveries.filter(
      (delivery) =>
        delivery.status === "delivered" ||
        delivery.status === "payout_pending" ||
        delivery.status === "payout_completed"
    ).length;

  const totalElement =
    document.getElementById(
      "deliveriesKpiTotal"
    );

  const availableElement =
    document.getElementById(
      "deliveriesKpiAvailable"
    );

  const transitElement =
    document.getElementById(
      "deliveriesKpiTransit"
    );

  const completedElement =
    document.getElementById(
      "deliveriesKpiCompleted"
    );

  if (totalElement) {
    totalElement.textContent =
      total;
  }

  if (availableElement) {
    availableElement.textContent =
      available;
  }

  if (transitElement) {
    transitElement.textContent =
      inTransit;
  }

  if (completedElement) {
    completedElement.textContent =
      completed;
  }
}
/* ============================================================
   DELIVERIES TAB
============================================================ */

function loadDeliveries(page = 1, statusFilter = "", searchQuery = "") {
  adminFetch(
    `/api/admin/deliveries?page=${page}&status=${statusFilter}&search=${searchQuery}`
  ).then(data => {
    const deliveries =
      Array.isArray(data.deliveries)
        ? data.deliveries
        : [];

    updateDeliveryKpis(
      deliveries
    );

    let html = `
      <div class="search-filter-bar">
        <input
          id="deliverySearch"
          placeholder="Search deliveries..."
        />

        <select id="deliveryStatusFilter">
          <option value="">
            All Status
          </option>

          <option value="available">
            Available
          </option>

          <option value="accepted">
            Accepted
          </option>

          <option value="in_transit">
            In Transit
          </option>

          <option value="delivered">
            Delivered
          </option>

          <option value="payout_pending">
            Payout Pending
          </option>

          <option value="payout_completed">
            Payout Completed
          </option>

          <option value="under_review">
            Under Review
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>

        <button
          onclick="applyDeliveryFilters()"
        >
          Apply
        </button>
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
            <th>Route</th>
            <th>Created</th>
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
              ? `<img src="${esc(photo)}" width="44" height="44" alt="">`
              : "—"
          }</td>
          <td class="admin-id">${esc(String(d._id).slice(-6))}</td>
          <td>${esc(senderName)}</td>
          <td>${esc(travelerName)}</td>
          <td>${statusPill(d.status)}</td>
          <td>${formatAdminMoney(d.price)}</td>
          <td>${formatAdminMoney(d.payoutAmount)}</td>
          <td>${esc(d.package?.deliveryType || "—")}</td>
          <td><span class="admin-route">${esc(d.pickup?.address || "—")}<small>to ${esc(d.dropoff?.address || "—")}</small></span></td>
          <td>${formatAdminDate(d.createdAt)}</td>
          <td>
            <button onclick="viewDelivery('${d._id}')">View</button>
            ${d.refundStatus === "failed" ? `<span class="admin-status bad">Refund failed</span> <button onclick="resolveDelivery('${d._id}', 'retry_refund')">Retry refund</button>` : ""}
            ${d.status === "under_review" ? `<button onclick="resolveDelivery('${d._id}', 'item_problem')">Uphold problem</button>` : ""}
            ${["under_review", "accepted", "in_transit", "delivered"].includes(d.status) ? `<button onclick="resolveDelivery('${d._id}', 'full_refund')">Full refund</button>` : ""}
          </td>
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

const RESOLVE_MESSAGES = {
  item_problem: "Uphold this item problem? The sender gets 50% back and the traveler gets 40%.",
  full_refund: "Give the sender a full refund? This cancels the delivery.",
  retry_refund: "Try this refund again?"
};

async function resolveDelivery(id, decision) {
  if (!confirm(RESOLVE_MESSAGES[decision])) return;

  const res = await fetch(`${API_BASE}/api/admin/deliveries/${id}/resolve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    },
    body: JSON.stringify({ decision })
  });
  const data = await res.json();

  if (!data.success) alert(data.error || "Unable to complete this.");

  loadDeliveries();
}

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
      <p><strong>Pickup:</strong> ${esc(d.pickup?.address || "—")}</p>
      <p><strong>Dropoff:</strong> ${esc(d.dropoff?.address || "—")}</p>
      <p><strong>Price:</strong> $${d.price}</p>
      <p><strong>Payout:</strong> $${d.payoutAmount}</p>
      <p><strong>Delivery Type:</strong> ${d.package?.deliveryType || "—"}</p>
      <p><strong>Description:</strong> ${esc(d.package?.description || "—")}</p>
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

  adminFetch(
    `/api/admin/users?page=${page}&search=${encodeURIComponent(searchQuery)}`
  ).then(data => {
    const senders = data.senders || [];
    const travelers = data.travelers || [];
    const totals = data.totals || {};

    /* ========================================================
       USERS KPI CARDS
    ======================================================== */

    const totalUsersElement =
      document.getElementById("usersKpiTotal");

    const totalSendersElement =
      document.getElementById("usersKpiSenders");

    const totalTravelersElement =
      document.getElementById("usersKpiTravelers");

    const kycPendingElement =
      document.getElementById("usersKpiKycPending");

    if (totalUsersElement) {
      totalUsersElement.textContent =
        totals.users ?? 0;
    }

    if (totalSendersElement) {
      totalSendersElement.textContent =
        totals.senders ?? 0;
    }

    if (totalTravelersElement) {
      totalTravelersElement.textContent =
        totals.travelers ?? 0;
    }

    if (kycPendingElement) {
      kycPendingElement.textContent =
        totals.kycPending ?? 0;
    }

    /* ========================================================
       USERS TABLES
    ======================================================== */

    let html = `
      <div class="search-filter-bar">
        <input
          id="userSearch"
          placeholder="Search users..."
          value="${searchQuery}"
        />
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
        ${
          page > 1
            ? `<button onclick="loadUsers(${page - 1}, '${searchQuery}')">Prev</button>`
            : ""
        }

        <button onclick="loadUsers(${page + 1}, '${searchQuery}')">
          Next
        </button>
      </div>
    `;

    document.getElementById(
      "usersTable"
    ).innerHTML = html;

    // Render Google Maps traveler map
    renderTravelerMap(travelers);

    // Set up auto-refresh every 10 seconds (only once)
    if (!usersAutoRefreshInterval) {
      usersAutoRefreshInterval =
        setInterval(() => {
          loadUsers(
            currentUsersPage,
            currentUsersSearch
          );
        }, 10000);
    }
  });
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
          <th>Background</th>
        </tr>
      </thead>
      <tbody>
  `;

  senders.forEach(u => {
    const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "N/A";
    const kycBadge = u.kycVerified
      ? badge("Verified âœ“", "verified")
      : badge("Pending", "pending");

    html += `
      <tr>
        <td>${esc(name)}</td>
        <td>${esc(u.email || "—")}</td>
        <td>${esc(u.phone || "—")}</td>
        <td>${esc(u.dob || "—")}</td>
        <td>${esc(u.address || "—")}</td>
        <td>${esc(u.city || "—")}</td>
        <td>${esc(u.state || "—")}</td>
        <td>${esc(u.zipcode || "—")}</td>
        <td>${esc(u.country || "—")}</td>
        <td>${kycBadge}</td>
        <td>${statusPill(u.background_status || "not_started")}</td>
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
          <th>Background</th>
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
      ? badge("Verified âœ“", "verified")
      : badge("Not Verified", "rejected");

    const lastLocation =
      t.location && t.location.coordinates
        ? `Lat: ${t.location.coordinates[1].toFixed(
            4
          )}, Lng: ${t.location.coordinates[0].toFixed(4)}`
        : "N/A";

    html += `
      <tr>
        <td>${esc(name)}</td>
        <td>${esc(user.email || "—")}</td>
        <td>${esc(user.phone || "—")}</td>
        <td>${statusBadge}</td>
        <td>${t.rating != null ? t.rating : "—"}</td>
        <td>${verifiedBadge}</td>
        <td>${statusPill(user.background_status || "not_started")}</td>
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
    const escrowTable =
      document.getElementById("escrowTable");

    if (!Array.isArray(data) || data.length === 0) {
      escrowTable.innerHTML =
        "<p>No escrow funds are currently pending.</p>";
      return;
    }

    let html = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Delivery ID</th>
            <th>Sender</th>
            <th>Traveler</th>
            <th>Delivery Price</th>
            <th>Traveler Payout</th>
            <th>FlexaGo Fee</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(row => {
      const createdDate =
        row.createdAt
          ? new Date(row.createdAt).toLocaleString()
          : "N/A";

      html += `
        <tr>
          <td>${row.deliveryId || "N/A"}</td>

          <td>
            ${esc(row.senderName || "Unknown Sender")}
            ${
              row.senderEmail
                ? `<br><small>${esc(row.senderEmail)}</small>`
                : ""
            }
          </td>

          <td>
            ${esc(row.travelerName || "Unassigned")}
            ${
              row.travelerEmail
                ? `<br><small>${esc(row.travelerEmail)}</small>`
                : ""
            }
          </td>

          <td>${formatAdminMoney(row.deliveryPrice)}</td>
          <td>${formatAdminMoney(row.travelerPayout)}</td>
          <td>${formatAdminMoney(row.flexagoFee)}</td>
          <td>${statusPill(row.status || "payout_pending")}</td>
          <td>${createdDate}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    escrowTable.innerHTML = html;
  });
}
/* ============================================================
   PAYOUTS TAB
============================================================ */

function loadPayouts() {
  adminFetch("/api/admin/payouts").then(data => {
    const payoutsTable =
      document.getElementById("payoutsTable");

    if (!Array.isArray(data) || data.length === 0) {
      payoutsTable.innerHTML =
        "<p>No completed payouts available.</p>";
      return;
    }

    let html = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Delivery ID</th>
            <th>Sender</th>
            <th>Traveler</th>
            <th>Payout Amount</th>
            <th>Status</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(row => {
      const completedDate =
        row.completedAt
          ? new Date(row.completedAt).toLocaleString()
          : "N/A";

      html += `
        <tr>
          <td>${row.deliveryId || "N/A"}</td>

          <td>
            ${esc(row.senderName || "Unknown Sender")}
            ${
              row.senderEmail
                ? `<br><small>${esc(row.senderEmail)}</small>`
                : ""
            }
          </td>

          <td>
            ${esc(row.travelerName || "Unknown Traveler")}
            ${
              row.travelerEmail
                ? `<br><small>${esc(row.travelerEmail)}</small>`
                : ""
            }
          </td>

          <td>${formatAdminMoney(row.payoutAmount)}</td>

          <td>${statusPill(row.status || "completed")}</td>

          <td>${completedDate}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    payoutsTable.innerHTML = html;
  });
}
/* ============================================================
   REVENUE TAB
============================================================ */

function loadRevenue() {
  adminFetch("/api/admin/revenue").then(data => {
    document.getElementById("revenueTable").innerHTML = `
      <div class="admin-stat-grid">
        <div class="admin-stat"><span>Total revenue</span><strong>${formatAdminMoney(data.totalRevenue)}</strong></div>
        <div class="admin-stat"><span>Traveler payouts</span><strong>${formatAdminMoney(data.totalPayouts)}</strong></div>
        <div class="admin-stat"><span>FlexaGo fee</span><strong>${formatAdminMoney(data.flexagoFee)}</strong></div>
      </div>
    `;
  });
}
/* ============================================================
   ANALYTICS TAB
============================================================ */

function loadAnalytics(range = "") {
  document.querySelectorAll(".analytics-filters button").forEach((button) => {
    button.classList.toggle("active", button.dataset.range === range);
  });

  adminFetch(`/api/admin/analytics${range ? `?range=${range}` : ""}`).then(
    data => {
      document.getElementById("analyticsTable").innerHTML = `
        <div class="admin-stat-grid">
          <div class="admin-stat"><span>Senders</span><strong>${data.senderCount}</strong></div>
          <div class="admin-stat"><span>Travelers</span><strong>${data.travelerCount}</strong></div>
          <div class="admin-stat"><span>Deliveries</span><strong>${data.orderCount}</strong></div>
        </div>
      `;

      drawAdminChart("chartDeliveriesPerDay", {
        type: "line",
        labels: data.chartDailyOrders.labels,
        values: data.chartDailyOrders.datasets[0].data,
        name: "Deliveries"
      });

      drawAdminChart("chartRevenuePerDay", {
        type: "line",
        labels: data.chartDailyRevenue.labels,
        values: data.chartDailyRevenue.datasets[0].data,
        name: "Revenue",
        money: true
      });

      drawAdminChart("chartHourlyDeliveries", {
        type: "bar",
        labels: data.chartHourlyOrders.labels,
        values: data.chartHourlyOrders.datasets[0].data,
        name: "Deliveries"
      });

      drawAdminChart("chartWeeklyDeliveries", {
        type: "bar",
        labels: data.ordersPerWeek.map(w => `Week ${w._id}`),
        values: data.ordersPerWeek.map(w => w.count),
        name: "Deliveries"
      });
    }
  );
}

/* ============================================================
   SUPPORT TAB
============================================================ */

function loadSupport() {
  adminFetch(
    "/api/support-tickets/admin?limit=100"
  ).then(data => {
    const tickets =
      Array.isArray(data.data)
        ? data.data
        : [];

    const openCount =
      tickets.filter(
        ticket =>
          ticket.status === "open"
      ).length;

    const progressCount =
      tickets.filter(
        ticket =>
          ticket.status === "in_progress"
      ).length;

    const resolvedCount =
      tickets.filter(
        ticket =>
          ticket.status === "resolved"
      ).length;

    const urgentCount =
      tickets.filter(
        ticket =>
          ticket.priority === "urgent"
      ).length;

    const activeCount =
      tickets.filter(
        ticket =>
          ticket.status !== "resolved" &&
          ticket.status !== "closed"
      ).length;

    const openElement =
      document.getElementById(
        "supportKpiOpen"
      );

    const progressElement =
      document.getElementById(
        "supportKpiProgress"
      );

    const resolvedElement =
      document.getElementById(
        "supportKpiResolved"
      );

    const urgentElement =
      document.getElementById(
        "supportKpiUrgent"
      );

    const supportBadge =
      document.getElementById(
        "adminSupportBadge"
      );

    const dashboardSupport =
      document.getElementById(
        "adminKpiSupport"
      );

    if (openElement) {
      openElement.textContent =
        openCount;
    }

    if (progressElement) {
      progressElement.textContent =
        progressCount;
    }

    if (resolvedElement) {
      resolvedElement.textContent =
        resolvedCount;
    }

    if (urgentElement) {
      urgentElement.textContent =
        urgentCount;
    }

    if (supportBadge) {
      supportBadge.textContent =
        String(activeCount).padStart(
          2,
          "0"
        );
    }

    if (dashboardSupport) {
      dashboardSupport.textContent =
        activeCount;
    }

    const supportTable =
      document.getElementById(
        "supportTable"
      );

    if (!supportTable) {
      return;
    }

    if (tickets.length === 0) {
      supportTable.innerHTML =
        "<p>No support tickets found.</p>";
      return;
    }

    let html = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Requester</th>
            <th>Role</th>
            <th>Category</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
    `;

    tickets.forEach(ticket => {
      const createdDate =
        ticket.createdAt
          ? new Date(
              ticket.createdAt
            ).toLocaleString()
          : "N/A";

      const requester =
        ticket.requesterName ||
        ticket.requesterEmail ||
        "Unknown User";

      html += `
        <tr>
          <td>
            ${esc(ticket.ticketNumber || "N/A")}
          </td>

          <td>
            ${esc(requester)}

            ${
              ticket.requesterEmail &&
              ticket.requesterName
                ? `<br><small>${esc(ticket.requesterEmail)}</small>`
                : ""
            }
          </td>

          <td>
            ${esc(ticket.userRole || "N/A")}
          </td>

          <td>
            ${esc(ticket.category || "N/A")}
          </td>

          <td>
            ${esc(ticket.subject || "N/A")}
          </td>

          <td>
            ${statusPill(ticket.priority || "normal")}
          </td>

          <td>
            ${statusPill(ticket.status || "open")}
          </td>

          <td>
            ${createdDate}
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    supportTable.innerHTML = html;
  });
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
   INITIALIZE ADMIN CONSOLE
============================================================ */

openAdminTab(
  initialAdminTab
);