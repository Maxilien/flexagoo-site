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

  locate().then((place) => {
    label.textContent = place;
    label.hidden = !place;
  });
})();
