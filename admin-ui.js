/* Shared look and feel for the admin console: icons, phone menu and charts. */
(function () {
  const BRAND = "#1d6fe8";
  const GRID = "#eef0f4";
  const INK = "#667085";

  Chart.defaults.font.family = "Inter, system-ui, -apple-system, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = INK;
  Chart.defaults.animation.duration = 350;

  const charts = {};

  // One look for every chart. Each shows a single measure, named by its title.
  window.drawAdminChart = function (canvasId, { type, labels, values, name, money }) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    charts[canvasId]?.destroy();

    const format = (value) => money
      ? `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : Number(value).toLocaleString();

    const fill = canvas.getContext("2d").createLinearGradient(0, 0, 0, 240);
    fill.addColorStop(0, "rgba(29,111,232,.16)");
    fill.addColorStop(1, "rgba(29,111,232,0)");

    charts[canvasId] = new Chart(canvas, {
      type,
      data: {
        labels,
        datasets: [{
          label: name,
          data: values,
          borderColor: BRAND,
          backgroundColor: type === "line" ? fill : BRAND,
          borderWidth: type === "line" ? 2 : 0,
          borderRadius: type === "bar" ? 4 : 0,
          maxBarThickness: 22,
          fill: type === "line",
          tension: .25,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: BRAND,
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
          pointHitRadius: 16
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#101828",
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: { label: (item) => `${name}: ${format(item.parsed.y)}` }
          }
        },
        scales: {
          x: { grid: { display: false }, border: { color: "#e4e7ec" }, ticks: { maxTicksLimit: 7, maxRotation: 0 } },
          y: { beginAtZero: true, grid: { color: GRID }, border: { display: false }, ticks: { maxTicksLimit: 5, precision: 0, callback: format } }
        }
      }
    });
  };

  window.refreshAdminIcons = function () {
    window.lucide?.createIcons();
  };

  function setMenu(open) {
    document.body.classList.toggle("admin-menu-open", open);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("#adminMenuBtn")) setMenu(true);
    else if (event.target.closest("#adminBackdrop, .admin-nav-item")) setMenu(false);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const today = document.getElementById("adminToday");

    if (today) {
      today.textContent = new Date().toLocaleDateString(undefined, {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
      });
    }

    window.refreshAdminIcons();
  });
})();
