/* One footer for every page. Put <footer id="siteFooter"></footer> where it
   belongs and load this script right after it (before site-i18n.js, so the
   new text gets translated). */
(function () {
  const footer = document.getElementById("siteFooter");
  if (!footer) return;

  const PRODUCTION_API = "https://flexago-backend.onrender.com";
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  let override = null;
  try { override = isLocal && localStorage.getItem("flexagoApiOverride"); } catch (e) {}
  const API = override || PRODUCTION_API;

  // Section links scroll on the homepage and go back to it from other pages.
  const onHome = Boolean(document.getElementById("how"));
  const home = (hash) => (onHome ? hash : `/${hash}`);
  const APP = "https://app.flexagoo.com";

  const column = (title, links) => `
    <nav class="site-footer-col" aria-label="${title}">
      <h3>${title}</h3>
      <ul>${links.map(([text, href]) => `<li><a href="${href}">${text}</a></li>`).join("")}</ul>
    </nav>`;

  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer-inner">
      <section class="site-footer-waitlist" aria-labelledby="waitlistTitle">
        <div>
          <p class="site-footer-badge"><span aria-hidden="true">●</span> <span>Launching first in Texas</span></p>
          <h2 id="waitlistTitle">Not in Texas yet?</h2>
          <p>Leave your email and we'll tell you when FlexaGo reaches your city.</p>
        </div>
        <form id="waitlistForm" class="site-footer-form" novalidate>
          <label class="sr-only" for="waitlistEmail">Email address</label>
          <input id="waitlistEmail" type="email" autocomplete="email" required maxlength="254" placeholder="Email address" />
          <label class="sr-only" for="waitlistCity">Your city</label>
          <input id="waitlistCity" autocomplete="address-level2" maxlength="80" placeholder="Your city" />
          <button type="submit">Join the waitlist</button>
          <p id="waitlistMessage" class="site-footer-message" role="status" aria-live="polite"></p>
        </form>
      </section>

      <div class="site-footer-grid">
        <div class="site-footer-brand">
          <a href="/" class="site-footer-logo">
            <img src="/img/flexago-logo-new.png" alt="" width="32" height="32" />
            <span>FlexaGo</span>
          </a>
          <p>Logistics marketplace for travelers & senders</p>
        </div>
        ${column("Send a package", [
          ["How it works", home("#how")],
          ["Why FlexaGo", home("#features")],
          ["For senders", home("#sender-section")],
          ["Create a delivery", `${APP}/signup`]
        ])}
        ${column("Drive and earn", [
          ["For travelers", home("#traveler-section")],
          ["Become a traveler", `${APP}/signup`],
          ["Log in", `${APP}/login`]
        ])}
        ${column("Company", [
          ["About", home("#about")],
          ["Contact", "mailto:support@flexagoo.com"],
          ["Privacy", "/privacy.html"],
          ["Terms", "/terms.html"]
        ])}
      </div>

      <ul class="site-footer-trust">
        <li><span aria-hidden="true">✓</span> <span>Every member verifies their identity</span></li>
        <li><span aria-hidden="true">✓</span> <span>Travelers pass a background check</span></li>
        <li><span aria-hidden="true">✓</span> <span>Travelers are paid after delivery is confirmed</span></li>
      </ul>

      <div class="site-footer-bottom">
        <div class="site-footer-meta">
          <label class="site-footer-lang">
            <span class="sr-only">Language</span>
            <select id="footerLanguage" class="lang-select">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="ht">Kreyòl</option>
              <option value="zh">中文</option>
              <option value="pt">Português</option>
            </select>
          </label>
          <span id="footerLocation" class="site-footer-location" hidden></span>
        </div>
        <p class="site-footer-copy">© ${new Date().getFullYear()} Flexago LLC. All rights reserved.</p>
      </div>
    </div>`;

  // Pages without the translation script still get a working selector:
  // it remembers the choice for the homepage.
  if (!document.querySelector('script[src*="site-i18n"]')) {
    const select = footer.querySelector("#footerLanguage");
    try { select.value = localStorage.getItem("preferredLanguage") || "en"; } catch (e) {}
    select.addEventListener("change", () => {
      try { localStorage.setItem("preferredLanguage", select.value); } catch (e) {}
    });
  }

  const form = footer.querySelector("#waitlistForm");
  const email = footer.querySelector("#waitlistEmail");
  const city = footer.querySelector("#waitlistCity");
  const message = footer.querySelector("#waitlistMessage");
  const button = form.querySelector("button");
  const t = (text) => (window.FlexagoSiteI18n ? window.FlexagoSiteI18n.translate(text) : text);

  const say = (text, kind) => {
    message.textContent = t(text);
    message.className = `site-footer-message ${kind || ""}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      say("Please enter a valid email address.", "bad");
      email.focus();
      return;
    }

    button.disabled = true;
    try {
      const res = await fetch(`${API}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, city: city.value.trim() })
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        say(json.error || "Couldn't save that. Please try again.", "bad");
        return;
      }

      form.reset();
      say("You're on the list. We'll email you when FlexaGo reaches your city.", "ok");
    } catch (error) {
      say("Couldn't save that. Please try again.", "bad");
    } finally {
      button.disabled = false;
    }
  });
})();
