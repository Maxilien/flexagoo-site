/* Advertising tags for the public website: the Meta Pixel and Google Ads.
   See privacy.html, section 8. Load this before js/site-footer.js.

   The tags load only when:
   - an ID is filled in below, and
   - the visitor has not turned them off with "Your privacy choices", and
   - the browser does not send a Global Privacy Control signal.

   Both IDs are public (they appear in every visitor's browser); they are not secrets. */
(function () {
  const META_PIXEL_ID = "";            // Meta Events Manager > Data sources, for example "123456789012345"
  const GOOGLE_ADS_ID = "";            // Google Ads > Goals > Conversions, for example "AW-123456789"
  const GOOGLE_LABELS = {              // the part after the "/" in each conversion's send_to
    waitlist: "",
    signup: ""
  };

  const CHOICE_KEY = "flexagoAdChoice"; // "off" once the visitor turns the tools off
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  // On a local copy, ?adtags=dry records calls in window.__flexagoAdCalls instead of loading anything.
  const dryRun = isLocal && /[?&]adtags=dry\b/.test(location.search);
  const ids = dryRun ? { meta: "TEST-PIXEL", google: "AW-TEST" } : { meta: META_PIXEL_ID, google: GOOGLE_ADS_ID };
  const labels = dryRun ? { waitlist: "waitlist-test", signup: "signup-test" } : GOOGLE_LABELS;

  const gpc = navigator.globalPrivacyControl === true;
  const savedChoice = () => { try { return localStorage.getItem(CHOICE_KEY); } catch (e) { return null; } };
  const optedOut = () => gpc || savedChoice() === "off";
  const configured = () => Boolean(ids.meta || ids.google);

  let loaded = false;
  const calls = (window.__flexagoAdCalls = window.__flexagoAdCalls || []);

  function addScript(src) {
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = src;
    document.head.appendChild(tag);
  }

  function load() {
    if (loaded || !configured() || optedOut()) return;
    loaded = true;

    if (ids.meta) {
      if (dryRun) {
        window.fbq = (...args) => calls.push(["meta", ...args]);
      } else if (!window.fbq) {
        // Meta's standard loader: queue calls until fbevents.js arrives.
        const fbq = (window.fbq = function () {
          fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
        });
        if (!window._fbq) window._fbq = fbq;
        fbq.push = fbq; fbq.loaded = true; fbq.version = "2.0"; fbq.queue = [];
        addScript("https://connect.facebook.net/en_US/fbevents.js");
      }
      window.fbq("init", ids.meta);
      window.fbq("track", "PageView");
    }

    if (ids.google) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = dryRun ? (...args) => calls.push(["google", ...args]) : function () { window.dataLayer.push(arguments); };
      if (!dryRun) addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids.google)}`);
      window.gtag("js", new Date());
      window.gtag("config", ids.google);
    }
  }

  // Events we count: joining the waitlist and tapping a "Sign up" link.
  function track(name) {
    if (!loaded) return;
    if (ids.meta) {
      if (name === "waitlist") window.fbq("track", "Lead");
      if (name === "signup") window.fbq("trackCustom", "SignupClick");
    }
    if (ids.google && labels[name]) window.gtag("event", "conversion", { send_to: `${ids.google}/${labels[name]}` });
  }

  // Remove the cookies these tools set on our domain, then reload so their scripts are gone.
  function clearAdCookies() {
    const names = document.cookie.split(";").map((c) => c.split("=")[0].trim())
      .filter((n) => /^(_fbp|_fbc|_gcl_[a-z]+|_ga(_.*)?)$/.test(n));
    const host = location.hostname;
    const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
    names.forEach((n) => domains.forEach((d) => {
      document.cookie = `${n}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }));
  }

  function setAllowed(allowed) {
    try { localStorage.setItem(CHOICE_KEY, allowed ? "on" : "off"); } catch (e) {}
    if (allowed) {
      load();
    } else if (loaded) {
      clearAdCookies();
      location.reload();
    }
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest('a[href*="app.flexagoo.com/signup"]');
    if (link) track("signup");
  }, true);

  window.FlexagoAds = {
    track,
    setAllowed,
    get allowed() { return !optedOut(); },
    get gpc() { return gpc; },
    get configured() { return configured(); },
    get loaded() { return loaded; }
  };

  load();
})();
