/* ============================================================
   PROMOS & REWARDS TAB
   Uses adminFetch, API_BASE, esc, statusPill and formatAdminMoney
   from admin.js.
============================================================ */

function adminSend(path, method, body) {
  return fetch(API_BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    },
    body: body ? JSON.stringify(body) : undefined
  }).then((res) => res.json());
}

const REWARD_NAMES = {
  first_trip_bonus: "First trip bonus",
  referral_inviter: "Invited a friend",
  referral_joined: "Joined with a code"
};

function loadPromos() {
  const form = document.getElementById("promoCreateForm");

  if (form && !form.dataset.bound) {
    form.dataset.bound = "true";
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = document.getElementById("promoCreateMessage");
      const value = (id) => document.getElementById(id).value.trim();

      const result = await adminSend("/api/admin/promos", "POST", {
        code: value("promoCode"),
        amount: Number(value("promoAmount")),
        description: value("promoDescription"),
        maxUses: value("promoMaxUses") ? Number(value("promoMaxUses")) : null,
        expiresAt: value("promoExpires") ? new Date(`${value("promoExpires")}T23:59:59`).toISOString() : null,
        firstOrderOnly: document.getElementById("promoFirstOnly").checked
      }).catch(() => ({ error: "Network error" }));

      if (!result.success) {
        message.textContent = result.error || "Unable to create the code.";
        message.className = "promo-admin-message bad";
        return;
      }

      message.textContent = `Created ${result.data.code}.`;
      message.className = "promo-admin-message ok";
      form.reset();
      document.getElementById("promoFirstOnly").checked = true;
      loadPromoList();
    });
  }

  loadPromoList();
  loadRewardList();
}

function loadPromoList() {
  const table = document.getElementById("promosTable");

  adminFetch("/api/admin/promos").then((data) => {
    const promos = data.data || [];

    if (!promos.length) {
      table.innerHTML = "<p>No promo codes yet.</p>";
      return;
    }

    table.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Amount</th>
            <th>Used</th>
            <th>Rules</th>
            <th>Ends</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${promos.map((promo) => `
            <tr>
              <td><strong>${esc(promo.code)}</strong>${promo.description ? `<br><small>${esc(promo.description)}</small>` : ""}</td>
              <td>${formatAdminMoney(promo.amount)} off</td>
              <td>${promo.uses}${promo.maxUses ? ` / ${promo.maxUses}` : ""}</td>
              <td>${promo.firstOrderOnly ? "First delivery only" : "Any delivery"}</td>
              <td>${promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : "No end date"}</td>
              <td>${statusPill(promo.active ? "active" : "off")}</td>
              <td><button type="button" data-promo-id="${esc(promo._id)}" data-promo-active="${promo.active ? "false" : "true"}">${promo.active ? "Turn off" : "Turn on"}</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }).catch(() => {
    table.innerHTML = "<p>Unable to load promo codes.</p>";
  });
}

function loadRewardList() {
  const table = document.getElementById("rewardsTable");

  adminFetch("/api/admin/promos/rewards").then((data) => {
    const rewards = data.data || [];

    if (!rewards.length) {
      table.innerHTML = "<p>No rewards earned yet.</p>";
      return;
    }

    const name = (person) => person ? `${person.firstName || ""} ${person.lastName || ""}`.trim() : "";

    table.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Person</th>
            <th>Reward</th>
            <th>Amount</th>
            <th>Paid as</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rewards.map((reward) => `
            <tr>
              <td>${esc(name(reward.user) || "Unknown")}${reward.user?.email ? `<br><small>${esc(reward.user.email)}</small>` : ""}</td>
              <td>${esc(REWARD_NAMES[reward.type] || reward.type)}${reward.relatedUser ? `<br><small>Friend: ${esc(name(reward.relatedUser))}</small>` : ""}</td>
              <td>${formatAdminMoney(reward.amount)}</td>
              <td>${reward.method === "cash" ? "Cash to payout account" : "Delivery credit"}</td>
              <td>${statusPill(reward.status)}${reward.error ? `<br><small>${esc(reward.error)}</small>` : ""}</td>
              <td>${new Date(reward.createdAt).toLocaleDateString()}</td>
              <td>${["owed", "failed"].includes(reward.status) ? `<button type="button" data-reward-retry="${esc(reward._id)}">Pay now</button>` : ""}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }).catch(() => {
    table.innerHTML = "<p>Unable to load rewards.</p>";
  });
}

document.addEventListener("click", async (event) => {
  const toggle = event.target.closest("[data-promo-id]");
  if (toggle) {
    const turnOn = toggle.dataset.promoActive === "true";
    if (!turnOn && !confirm("Turn off this code? Senders won't be able to use it.")) return;
    const result = await adminSend(`/api/admin/promos/${toggle.dataset.promoId}`, "PATCH", { active: turnOn });
    if (!result.success) alert(result.error || "Unable to update the code.");
    loadPromoList();
    return;
  }

  const retry = event.target.closest("[data-reward-retry]");
  if (retry) {
    if (!confirm("Try paying this reward now?")) return;
    const result = await adminSend(`/api/admin/promos/rewards/${retry.dataset.rewardRetry}/retry`, "POST");
    if (!result.success) alert(result.error || "Unable to pay this reward.");
    else if (result.data.status !== "paid" && result.data.status !== "credited") alert(`Still not paid: ${result.data.error || result.data.status}`);
    loadRewardList();
  }
});
