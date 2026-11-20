// Plays the hero clips one at a time and lights the matching step.
(function () {
  const stage = document.querySelector(".hero-slides");
  if (!stage) return;

  const clips = Array.from(stage.querySelectorAll("video"));
  const steps = Array.from(document.querySelectorAll(".hero-steps li"));
  const stillOnly = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || navigator.connection?.saveData;

  if (stillOnly || !clips.length) return;

  const SLIDE_MS = 6000;
  let current = -1;
  let timer = null;
  let onScreen = true;

  function fetchClip(clip) {
    if (clip.preload !== "auto") {
      clip.preload = "auto";
      clip.load();
    }
  }

  function show(index) {
    const clip = clips[index];
    const previous = clips[current];

    clip.currentTime = 0;
    clip.play().catch(() => {});
    clip.classList.add("is-on");
    fetchClip(clips[(index + 1) % clips.length]);

    if (previous && previous !== clip) {
      previous.classList.remove("is-on");
      // Keeps moving through the fade, then stops to save battery.
      setTimeout(() => previous.pause(), 1200);
    }

    steps.forEach((step, i) => step.classList.toggle("is-on", i === Number(clip.dataset.step)));
    current = index;
  }

  function next() {
    show((current + 1) % clips.length);
  }

  function run() {
    if (timer || !onScreen || document.hidden) return;
    if (current < 0) next();
    else clips[current].play().catch(() => {});
    timer = setInterval(next, SLIDE_MS);
  }

  function hold() {
    clearInterval(timer);
    timer = null;
    clips[current]?.pause();
  }

  stage.classList.add("is-running");

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) run();
    else hold();
  }).observe(stage);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hold();
    else run();
  });
})();
