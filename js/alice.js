/* ============================================================
   alice.js — FlexaGo Alice Agent
   C:\FlexagooSite\js\alice.js
============================================================ */
(function () {

  const aliceWindow = document.getElementById("alice-window");
  const bubble      = document.getElementById("alice-bubble");
  const closeBtn    = document.getElementById("alice-close");
  const messages    = document.getElementById("alice-messages");
  const inputEl     = document.getElementById("alice-input");
  const sendBtn     = document.getElementById("alice-send");
  const qrPanel     = document.getElementById("alice-quick-replies");
  const notifDot    = document.getElementById("alice-notif-dot");

  let isOpen     = false;
  let hasOpened  = false;
  let stateStack = [];

  const flow = {

    greeting: {
      message: `👋 Hi! I'm <strong>Alice</strong>, your FlexaGo assistant.<br><br>Which best describes you?`,
      options: [
        { label: "📦 I'm a Sender",       next: "sender_l1"   },
        { label: "✈️ I'm a Traveler",      next: "traveler_l1" },
        { label: "🆕 I'm New to FlexaGo", next: "new_user"    },
      ]
    },

    new_user: {
      message: `Welcome to FlexaGo! 🎉<br><br>FlexaGo connects people who need to <strong>ship something</strong> with <strong>travelers already heading that way</strong> — same-day delivery at a fraction of courier costs.<br><br>What are you interested in?`,
      options: [
        { label: "📦 I want to send something", next: "sender_l1"   },
        { label: "✈️ I want to earn on trips",  next: "traveler_l1" },
        { label: "❓ How does FlexaGo work?",
          answer: `Here's how FlexaGo works in 4 steps:<br><br>
1️⃣ <strong>Sender posts</strong> a delivery with pickup & drop-off<br>
2️⃣ <strong>Traveler accepts</strong> — already heading that way<br>
3️⃣ <strong>Package picked up</strong> — sender tracks live 📍<br>
4️⃣ <strong>Delivered & confirmed</strong> — traveler gets paid ✅<br><br>
<a href="https://app.flexagoo.com/signup.html">Create your free account →</a>` }
      ]
    },

    traveler_l1: {
      message: `Great! Traveler details are coming soon.<br><br>For now reach us at:<br>📧 <a href="mailto:support@flexagoo.com">support@flexagoo.com</a>`,
      options: []
    },

    /* ── SENDER LEVEL 1 ──────────────────────────────────── */
    sender_l1: {
      message: `Great! As a <strong>Sender</strong>, what can I help you with? 📦`,
      options: [
        { label: "📦 How do I send a package?",    next: "sender_how"     },
        { label: "💰 How much does it cost?",      next: "sender_cost"    },
        { label: "⚡ How fast is delivery?",        next: "sender_speed"   },
        { label: "📋 What can I send?",            next: "sender_items"   },
        { label: "📍 Track my delivery",           next: "sender_track"   },
        { label: "🔒 Is my package safe?",         next: "sender_safety"  },
        { label: "💳 Payment & billing",           next: "sender_payment" },
        { label: "🆘 Help with an existing order", next: "sender_help"    },
      ]
    },

    /* ── SENDER L2: HOW TO SEND ──────────────────────────── */
    sender_how: {
      message: `What would you like to know about sending a package?`,
      options: [
        { label: "How do I post a delivery?",
          answer: `Posting is simple! 📦<br><br>1️⃣ Log in → click <strong>"Send a Package"</strong><br>2️⃣ Describe your item (name, size, weight)<br>3️⃣ Set pickup & drop-off location<br>4️⃣ Set your budget & urgency<br>5️⃣ Click <strong>"Post Delivery"</strong> ✅<br><br><a href="https://app.flexagoo.com/signup.html">Create an account →</a>` },
        { label: "How do I describe my item?",
          answer: `📝 <strong>Item name</strong> — e.g. "Laptop in a sleeve"<br>📏 <strong>Size</strong> — small / medium / large / oversized<br>⚖️ <strong>Weight</strong> — approximate lbs or kg<br>📸 <strong>Optional photo</strong><br>⚠️ <strong>Special notes</strong> — fragile, keep upright, etc.` },
        { label: "How do I set pickup & drop-off?",
          answer: `📍 <strong>Pickup address</strong> — where traveler collects the package<br>🏁 <strong>Drop-off address</strong> — final destination<br><br>Type an address or drop a pin on the map. FlexaGo finds travelers whose route covers both points automatically.` },
        { label: "How do I get matched with a traveler?",
          answer: `After you post, FlexaGo finds travelers:<br><br>🔍 Whose route passes your pickup AND drop-off<br>✅ Who are identity-verified and available<br>⭐ Ranked by rating, ETA, and price<br><br>You get a match notification within minutes.` },
        { label: "Can I schedule a delivery in advance?",
          answer: `Yes! Schedule up to <strong>7 days ahead</strong>. 📅<br><br>Set your preferred pickup date and time window when posting.` },
        { label: "What happens after I post?",
          answer: `1️⃣ FlexaGo matches you with a verified traveler<br>2️⃣ You confirm the match<br>3️⃣ Payment held in escrow 🔒<br>4️⃣ Traveler picks up your package<br>5️⃣ You track live 📍<br>6️⃣ Delivered → confirm → traveler gets paid ✅` },
        { label: "Can I edit my post after submitting?",
          answer: `✅ <strong>Before a traveler accepts</strong> — My Deliveries → Edit<br><br>⚠️ <strong>After acceptance</strong> — contact support:<br>📧 <a href="mailto:support@flexagoo.com">support@flexagoo.com</a>` },
      ]
    },

    /* ── SENDER L2: COST ─────────────────────────────────── */
    sender_cost: {
      message: `Let me break down pricing for you! What do you want to know?`,
      options: [
        { label: "How is the price calculated?",
          answer: `📏 <strong>Distance</strong> — how far the package travels<br>⚖️ <strong>Size & weight</strong><br>⚡ <strong>Urgency</strong> — express costs a bit more<br>📦 <strong>Item type</strong> — fragile items may carry a small premium<br><br>You set your budget; travelers accept or counter-offer.` },
        { label: "Is there a minimum charge?",
          answer: `Yes — FlexaGo has a <strong>minimum of $8</strong> for local deliveries. 💰` },
        { label: "Are there any hidden fees?",
          answer: `No hidden fees — ever. ✅<br><br>FlexaGo charges a transparent <strong>service fee of 5–8%</strong> shown before you confirm. Zero surprises.` },
        { label: "How do I get a price estimate?",
          answer: `You'll see an <strong>estimated price range</strong> as soon as you enter pickup and drop-off — before submitting your post. 💡` },
        { label: "Is FlexaGo cheaper than FedEx / UPS?",
          answer: `In most cases — significantly cheaper! 💰<br><br>Average savings: <strong>40–60% less</strong> than FedEx or UPS for same-day delivery.` },
        { label: "Do I pay upfront or after delivery?",
          answer: `You pay <strong>upfront when confirming your traveler</strong>, held in secure <strong>escrow</strong> — released only after you confirm delivery. ✅` },
        { label: "Are there discounts or promo codes?",
          answer: `Yes! 🎉 Enter your promo code at checkout. First-time sender? Check your <strong>signup confirmation email</strong> for a welcome discount!` },
      ]
    },

    /* ── SENDER L2: SPEED ────────────────────────────────── */
    sender_speed: {
      message: `Let's talk delivery speed! What do you need to know?`,
      options: [
        { label: "Is same-day delivery guaranteed?",
          answer: `Same-day delivery is available and depends on <strong>traveler availability</strong> in your area. FlexaGo shows the earliest pickup time before you confirm. 📍` },
        { label: "What are typical delivery times?",
          answer: `🏙️ <strong>Local (same city)</strong>: 1–4 hours<br>🚗 <strong>Interstate</strong>: Same-day to next day<br>✈️ <strong>International</strong>: 1–3 days` },
        { label: "Can I get urgent / express delivery?",
          answer: `Yes! Select <strong>"Express"</strong> when posting. ⚡ This boosts your listing and attracts travelers who can move immediately.` },
        { label: "Does time of day affect speed?",
          answer: `Yes. Peak hours — <strong>7–10am</strong> and <strong>4–7pm</strong> — have the most active travelers. Posting then gets the fastest match. 🕐` },
        { label: "What if no traveler is available right now?",
          answer: `Your post stays <strong>active and visible</strong> to all nearby travelers. You can also:<br><br>💰 Increase your offer<br>📢 Mark as <strong>"Urgent"</strong><br>📅 Schedule for later` },
        { label: "Does FlexaGo work on weekends & holidays?",
          answer: `Yes — <strong>7 days a week, 365 days a year!</strong> 🎉 Weekends often have MORE travelers available.` },
      ]
    },

    /* ── SENDER L2: ITEMS ────────────────────────────────── */
    sender_items: {
      message: `What do you want to know about allowed items?`,
      options: [
        { label: "What items are allowed?",
          answer: `✅ Documents & envelopes<br>✅ Clothing & accessories<br>✅ Electronics (phones, laptops)<br>✅ Books & stationery<br>✅ Non-perishable food & gifts<br>✅ Small appliances<br>✅ Packaged personal care items` },
        { label: "What items are NOT allowed?",
          answer: `❌ Weapons or ammunition<br>❌ Illegal substances<br>❌ Hazardous materials<br>❌ Live animals<br>❌ Unregistered currency<br>❌ Counterfeit goods<br><br>Violations = immediate account suspension.` },
        { label: "Can I send food or perishables?",
          answer: `✅ <strong>Non-perishable packaged food</strong> allowed.<br>🌡️ <strong>Fresh food</strong> — same-day local only, properly packaged.<br>❌ Frozen / temperature-sensitive items not currently supported.` },
        { label: "What are the size & weight limits?",
          answer: `📦 <strong>Small</strong>: Up to 5 lbs<br>📦 <strong>Medium</strong>: 5–25 lbs<br>📦 <strong>Large</strong>: 25–70 lbs<br>📦 <strong>Oversized</strong>: 70+ lbs — requires special arrangement` },
        { label: "Can I send fragile or valuable items?",
          answer: `Yes! Mark as <strong>"Fragile"</strong>, add photos, pack properly, and add <strong>Premium Insurance (up to $1,000)</strong> for high-value items. ✅` },
        { label: "Can I send internationally?",
          answer: `Yes! ✈️ Declare item type & value, comply with destination customs, include required documentation. Delivery: <strong>1–3 days</strong>.` },
        { label: "Can I send documents or legal papers?",
          answer: `Absolutely! 📄 Contracts, legal papers, passports — all welcome. Use a tamper-evident sealed envelope and photo before handoff.` },
      ]
    },

    /* ── SENDER L2: TRACKING ─────────────────────────────── */
    sender_track: {
      message: `Let's find your package! What do you need help with?`,
      options: [
        { label: "How do I see my package's live location?",
          answer: `📱 Log in → <strong>My Deliveries</strong> → tap your active delivery<br><br>See the traveler's <strong>live GPS on the map</strong> 🗺️. Refreshes every 30 seconds.` },
        { label: "Will I get notifications along the way?",
          answer: `Yes! Notifications at every milestone:<br><br>🔔 Traveler accepted<br>🔔 Heading to pickup<br>🔔 Package picked up ✅<br>🔔 In transit 🚗<br>🔔 Arriving at drop-off<br>🔔 Delivered ✅` },
        { label: "How do I know my package was delivered?",
          answer: `📸 <strong>Delivery photo</strong> taken at drop-off<br>✍️ Optional recipient signature<br>🔔 Delivery confirmation notification<br><br>Confirm receipt in the app → traveler gets paid.` },
        { label: "My package hasn't moved — what do I do?",
          answer: `1️⃣ Check the live map in <strong>My Deliveries</strong><br>2️⃣ Message the traveler via in-app chat<br>3️⃣ No response in 10 mins? Tap <strong>"Report an Issue"</strong><br><br>📧 <a href="mailto:support@flexagoo.com">support@flexagoo.com</a>` },
        { label: "Can I contact my traveler directly?",
          answer: `Yes — message via <strong>FlexaGo in-app chat</strong> once delivery is active. 💬 Phone numbers are not shared for privacy.` },
        { label: "Where do I find my tracking info?",
          answer: `📱 Log in → <strong>My Deliveries</strong> → tap your active delivery.<br><br>Tracking link also sent to your confirmation email. 📧` },
      ]
    },

    /* ── SENDER L2: SAFETY ───────────────────────────────── */
    sender_safety: {
      message: `Safety is our #1 priority. What would you like to know?`,
      options: [
        { label: "How are travelers verified?",
          answer: `🪪 <strong>Government ID verification</strong> via Stripe Identity<br>🤳 <strong>Live selfie check</strong><br>📋 <strong>Background screening</strong><br>⭐ <strong>Ongoing ratings</strong> — below 4.0 = suspended` },
        { label: "Is there delivery insurance?",
          answer: `✅ All deliveries include <strong>basic coverage up to $100</strong> at no extra cost. 🛡️<br><br>Add <strong>Premium Insurance (up to $1,000)</strong> for high-value items. Claims filed within 48 hours.` },
        { label: "What if my package is lost?",
          answer: `1️⃣ File a report: <strong>My Deliveries → Report Issue</strong><br>2️⃣ Team investigates within 24 hours<br>3️⃣ Confirmed lost → <strong>full refund + insurance payout</strong> ✅` },
        { label: "What if my package is damaged?",
          answer: `1️⃣ Take photos immediately<br>2️⃣ Do NOT confirm delivery if damage is visible<br>3️⃣ File a claim within 48 hours: <strong>My Deliveries → Report Issue</strong><br><br>📧 <a href="mailto:support@flexagoo.com">support@flexagoo.com</a>` },
        { label: "What if the traveler doesn't show up?",
          answer: `1️⃣ Try in-app chat first<br>2️⃣ No response in 15 mins → tap <strong>"Traveler No-Show"</strong><br>3️⃣ FlexaGo immediately re-matches you<br>4️⃣ You are <strong>never charged</strong> for a no-show ✅` },
        { label: "How is my payment protected?",
          answer: `Payment held in <strong>secure escrow</strong> — never released until you confirm delivery. 🔒 Bank-level encryption on all transactions.` },
        { label: "What is FlexaGo's delivery guarantee?",
          answer: `✅ Package lost → <strong>full refund</strong><br>✅ No-show → <strong>free re-match + discount</strong><br>✅ Major delay → <strong>partial refund</strong><br>✅ 24/7 support on every active delivery` },
      ]
    },

    /* ── SENDER L2: PAYMENT ──────────────────────────────── */
    sender_payment: {
      message: `Happy to help with payment! What do you need to know?`,
      options: [
        { label: "What payment methods are accepted?",
          answer: `💳 Credit & Debit Cards (Visa, Mastercard, Amex)<br>📱 Apple Pay & Google Pay<br>🏦 Bank transfer (ACH)<br>💰 FlexaGo Wallet<br><br>All processed securely via <strong>Stripe</strong>.` },
        { label: "When am I charged?",
          answer: `When you <strong>confirm your matched traveler</strong>. Held in escrow and released only after you confirm delivery. ✅ Never charged for unmatched posts.` },
        { label: "How do I get a receipt or invoice?",
          answer: `Receipt emailed automatically after every delivery. 📧<br><br>Download: My Deliveries → select delivery → <strong>"Download Invoice"</strong>` },
        { label: "I was charged incorrectly",
          answer: `1️⃣ My Deliveries → select the delivery<br>2️⃣ Tap <strong>"Dispute Charge"</strong><br>3️⃣ Or email: <a href="mailto:support@flexagoo.com">support@flexagoo.com</a><br><br>Reviewed within <strong>48 hours</strong>. ✅` },
        { label: "How do I request a refund?",
          answer: `1️⃣ My Deliveries → <strong>"Request Refund"</strong><br>2️⃣ Select a reason<br>3️⃣ Processed within <strong>3–5 business days</strong> ✅` },
        { label: "Is my payment information secure?",
          answer: `Yes — completely. 🔒 <strong>Stripe</strong> handles all payments. Your card details are never stored on our servers.` },
        { label: "Can I pay cash on delivery?",
          answer: `Cash is <strong>not currently supported</strong> — all transactions go through the app for security and insurance coverage. 💳` },
      ]
    },

    /* ── SENDER L2: HELP ─────────────────────────────────── */
    sender_help: {
      message: `I'm here to help resolve your issue. What's going on?`,
      options: [
        { label: "My traveler is late",
          answer: `1️⃣ Check the live map in <strong>My Deliveries</strong><br>2️⃣ Message via in-app chat<br>3️⃣ Still no response? Tap <strong>"Report Late Delivery"</strong><br><br>Our team contacts the traveler immediately. ✅` },
        { label: "I want to cancel my delivery",
          answer: `✅ <strong>Before pickup</strong>: My Deliveries → <strong>"Cancel Delivery"</strong> → full refund in 3–5 business days<br><br>⚠️ <strong>After pickup</strong>: Contact support immediately.<br>📧 <a href="mailto:support@flexagoo.com">support@flexagoo.com</a>` },
        { label: "I need to change the drop-off address",
          answer: `Contact support <strong>before the traveler reaches drop-off</strong>:<br><br>📧 <a href="mailto:support@flexagoo.com">support@flexagoo.com</a><br><br>Include your delivery ID and the new address.` },
        { label: "My package was delivered to the wrong place",
          answer: `1️⃣ Tap <strong>"Report Issue"</strong> in My Deliveries<br>2️⃣ Select <strong>"Wrong delivery location"</strong><br>3️⃣ Our team contacts the traveler and coordinates recovery 📧` },
        { label: "The traveler never picked up my package",
          answer: `1️⃣ Tap <strong>"Traveler No-Show"</strong> in My Deliveries<br>2️⃣ FlexaGo immediately re-matches you<br>3️⃣ You are <strong>NOT charged</strong> for the failed pickup ✅` },
        { label: "I want to report a traveler",
          answer: `1️⃣ My Deliveries → select the delivery<br>2️⃣ Tap <strong>"Report Traveler"</strong><br>3️⃣ Choose a reason and provide details<br><br>Investigated within 24 hours. Violations = immediate suspension. 🔒` },
        { label: "I need a refund for a failed delivery",
          answer: `1️⃣ My Deliveries → <strong>"Request Refund"</strong><br>2️⃣ Select <strong>"Failed Delivery"</strong><br>3️⃣ Full refund within <strong>3–5 business days</strong> ✅` },
        { label: "I have a dispute with a traveler",
          answer: `1️⃣ Try resolving via <strong>in-app chat</strong> first<br>2️⃣ My Deliveries → <strong>"Open Dispute"</strong><br>3️⃣ FlexaGo mediates and decides within <strong>72 hours</strong><br><br>📧 <a href="mailto:support@flexagoo.com">support@flexagoo.com</a>` },
      ]
    },

  }; // end flow

  /* ── ENGINE ──────────────────────────────────────────── */
  function renderState(stateKey, pushHistory) {
    if (pushHistory === undefined) pushHistory = true;
    var state = flow[stateKey];
    if (!state) return;
    if (pushHistory) stateStack.push(stateKey);
    addBotMessage(state.message);
    qrPanel.innerHTML = "";
    if (state.options && state.options.length > 0) {
      state.options.forEach(function(opt) {
        var btn = document.createElement("button");
        btn.className = "alice-qr";
        btn.textContent = opt.label;
        btn.addEventListener("click", function() {
          addUserMessage(opt.label);
          if (opt.answer) {
            showTypingThen(function() { addBotMessage(opt.answer); renderNavButtons(stateKey); });
          } else if (opt.next) {
            showTypingThen(function() { renderState(opt.next); });
          }
        });
        qrPanel.appendChild(btn);
      });
    }
  }

  function renderNavButtons(currentStateKey) {
    qrPanel.innerHTML = "";
    if (stateStack.length > 1) {
      var backBtn = document.createElement("button");
      backBtn.className = "alice-qr alice-nav-btn";
      backBtn.textContent = "← Back";
      backBtn.addEventListener("click", function() {
        stateStack.pop();
        var prev = stateStack[stateStack.length - 1];
        stateStack.pop();
        renderState(prev);
      });
      qrPanel.appendChild(backBtn);
    }
    var menuBtn = document.createElement("button");
    menuBtn.className = "alice-qr alice-nav-btn";
    menuBtn.textContent = "🏠 Main Menu";
    menuBtn.addEventListener("click", function() {
      stateStack = [];
      showTypingThen(function() { renderState("greeting"); });
    });
    qrPanel.appendChild(menuBtn);
    var anotherBtn = document.createElement("button");
    anotherBtn.className = "alice-qr alice-nav-btn";
    anotherBtn.textContent = "❓ Ask another";
    anotherBtn.addEventListener("click", function() {
      stateStack.pop();
      var prev = stateStack[stateStack.length - 1];
      stateStack.pop();
      renderState(prev);
    });
    qrPanel.appendChild(anotherBtn);
  }

  function addBotMessage(html) {
    var msg = document.createElement("div");
    msg.className = "alice-msg bot";
    msg.innerHTML = html;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function addUserMessage(text) {
    var msg = document.createElement("div");
    msg.className = "alice-msg user";
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTypingThen(callback) {
    var typing = document.createElement("div");
    typing.className = "alice-typing";
    typing.id = "alice-typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(function() {
      var t = document.getElementById("alice-typing-indicator");
      if (t) t.remove();
      callback();
    }, 600 + Math.random() * 500);
  }

  function openAlice() {
    aliceWindow.classList.remove("alice-hidden", "alice-closing");
    isOpen = true;
    notifDot.classList.remove("visible");
    document.getElementById("alice-bubble-label").textContent = "Close";
    document.getElementById("alice-bubble-icon").textContent = "✕";
    if (!hasOpened) {
      hasOpened = true;
      setTimeout(function() { renderState("greeting"); }, 300);
    }
  }

  function closeAlice() {
    aliceWindow.classList.add("alice-closing");
    isOpen = false;
    document.getElementById("alice-bubble-label").textContent = "Ask Alice";
    document.getElementById("alice-bubble-icon").textContent = "💬";
    setTimeout(function() { aliceWindow.classList.add("alice-hidden"); }, 250);
  }

  bubble.addEventListener("click", function() { isOpen ? closeAlice() : openAlice(); });
  closeBtn.addEventListener("click", closeAlice);
  sendBtn.addEventListener("click", function() { handleFreeText(inputEl.value); });
  inputEl.addEventListener("keydown", function(e) { if (e.key === "Enter") handleFreeText(inputEl.value); });

  function handleFreeText(text) {
    text = text.trim();
    if (!text) return;
    addUserMessage(text);
    inputEl.value = "";
    var lower = text.toLowerCase();
    var fallbacks = [
      { kw: ["send","package","ship"],          state: "sender_how"     },
      { kw: ["cost","price","cheap","fee"],      state: "sender_cost"    },
      { kw: ["fast","quick","speed","today"],    state: "sender_speed"   },
      { kw: ["what can","allowed","item"],       state: "sender_items"   },
      { kw: ["track","where","locate","status"], state: "sender_track"   },
      { kw: ["safe","trust","verif","insur"],    state: "sender_safety"  },
      { kw: ["pay","bill","charge","refund"],    state: "sender_payment" },
      { kw: ["cancel","dispute","late","help"],  state: "sender_help"    },
      { kw: ["traveler","earn","trip","income"], state: "traveler_l1"    },
      { kw: ["hi","hello","hey","start"],        state: "greeting"       },
    ];
    for (var i = 0; i < fallbacks.length; i++) {
      if (fallbacks[i].kw.some(function(k) { return lower.includes(k); })) {
        var matched = fallbacks[i].state;
        showTypingThen(function() { stateStack = []; renderState(matched); });
        return;
      }
    }
    showTypingThen(function() {
      addBotMessage("I'm not sure about that yet, but our team can help! 😊<br><br>📧 <a href='mailto:support@flexagoo.com'>support@flexagoo.com</a>");
      renderNavButtons("greeting");
    });
  }

  setTimeout(function() { if (!hasOpened) notifDot.classList.add("visible"); }, 4000);

})();
