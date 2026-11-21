/* Shows where the visitor is, in the footer. Tries two services because
   free ones limit requests, then falls back to the browser's region.
   IP lookups find the internet provider's hub, often a different city,
   so only the state or region and the country are shown. */
(function () {
  const label = document.getElementById("footerLocation");
  if (!label) return;

  const services = [
    ["https://ipapi.co/json/", (d) => (d.error ? [] : [d.region, d.country_name])],
    ["https://ipwho.is/", (d) => (d.success === false ? [] : [d.region, d.country])]
  ];

  function regionFromBrowser() {
    const region = (navigator.language || "").split("-")[1];

    if (!region || !window.Intl?.DisplayNames) return "";

    return new Intl.DisplayNames([navigator.language], { type: "region" }).of(region);
  }

  async function locate() {
    for (const [url, read] of services) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);

        if (!response.ok) continue;

        const place = read(await response.json()).filter(Boolean);

        if (place.length) return place.join(", ");
      } catch (error) {
        // Try the next service.
      }
    }

    return regionFromBrowser();
  }

  function show(place) {
    if (!place) return;
    label.textContent = place;
    label.hidden = false;
  }

  // With the visitor's permission, the device location gives the real
  // city. The browser remembers the answer, so it asks only once.
  // Coordinates go only to the city lookup and are never stored.
  async function cityFromDevice() {
    if (!navigator.geolocation) return "";

    try {
      const state = await navigator.permissions?.query({ name: "geolocation" });
      if (state?.state === "denied") return "";
    } catch (error) {
      // Some browsers can't report the permission; just ask.
    }

    const position = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 30 * 60 * 1000
      })
    );

    const { latitude, longitude } = position.coords;
    const response = await fetch(
      "https://api.bigdatacloud.net/data/reverse-geocode-client" +
      `?latitude=${latitude.toFixed(3)}&longitude=${longitude.toFixed(3)}&localityLanguage=en`
    );

    if (!response.ok) return "";

    const d = await response.json();
    const city = d.city || d.locality;
    const area = d.countryCode === "US" ? d.principalSubdivision : d.countryName;

    return city ? [city, area].filter(Boolean).join(", ") : "";
  }

  let cityShown = false;

  // A slow IP lookup must not replace a city that already arrived.
  locate().then((place) => { if (!cityShown) show(place); });
  cityFromDevice().then((city) => {
    if (city) cityShown = true;
    show(city);
  }).catch(() => {
    // Declined or unavailable: keep the state and country.
  });
})();
