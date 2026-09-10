/* Roșian Mihai — portfolio · no libraries, no external requests */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- typed-text hero effect ---------- */
  var typed = document.getElementById("typed");
  if (typed && !reducedMotion) {
    var full = typed.textContent;
    typed.textContent = "";
    var i = 0;
    (function tick() {
      if (i <= full.length) {
        typed.textContent = full.slice(0, i);
        i += 1;
        setTimeout(tick, 42);
      }
    })();
  }

  /* ---------- background: drifting neon grid (canvas) ---------- */
  var canvas = document.getElementById("bg-grid");
  if (!canvas || reducedMotion) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  var CELL = 56;          // grid cell size in px
  var t = 0;
  var running = true;

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  function frame() {
    if (!running) return;
    t += 0.0035;
    ctx.clearRect(0, 0, w, h);

    // perspective-less grid with a soft breathing glow that drifts
    var driftX = (t * 40) % CELL;
    var driftY = (t * 24) % CELL;
    var cx = w * (0.5 + 0.28 * Math.sin(t * 1.7));
    var cy = h * (0.35 + 0.22 * Math.cos(t * 1.3));

    for (var x = -CELL + driftX; x < w + CELL; x += CELL) {
      for (var y = -CELL + driftY; y < h + CELL; y += CELL) {
        var dx = x - cx, dy = y - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var glow = Math.max(0, 1 - dist / (Math.min(w, h) * 0.75));
        var a = 0.04 + glow * glow * 0.35;
        // alternate cyan / violet dots by grid parity
        var even = (Math.round(x / CELL) + Math.round(y / CELL)) % 2 === 0;
        ctx.fillStyle = even
          ? "rgba(55, 230, 255," + a + ")"
          : "rgba(167, 139, 250," + a + ")";
        ctx.beginPath();
        ctx.arc(x, y, 1 + glow * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
