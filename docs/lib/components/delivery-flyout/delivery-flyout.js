/* delivery-flyout · opens under [data-sh-dflyout-open] with the caret on the trigger; close button, click outside and Esc close it;
   View All Time Slots shows the tiles. Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  var CARET_FROM_LEFT = 261;   // live: caret 261px in from the panel's left edge
  SH.onReady(function () {
    var fly = SH.$("[data-sh-dflyout]"); if (!fly) return;
    document.body.appendChild(fly);   // position against the page, not the header
    var trigger = null, more = SH.$("[data-sh-dflyout-more]", fly), slots = SH.$('[data-sh-dflyout="slots"]', fly);
    function place() {
      if (!trigger) return;
      var r = trigger.getBoundingClientRect(), w = fly.offsetWidth, vw = document.documentElement.clientWidth;
      var center = r.left + r.width / 2;
      var left = Math.max(8, Math.min(center - CARET_FROM_LEFT - 12, vw - w - 8));
      fly.style.left = (left + window.scrollX) + "px";
      fly.style.top = (r.bottom + 10 + window.scrollY) + "px";
      fly.style.setProperty("--sh-dflyout-caret", Math.max(12, Math.min(center - left - 12, w - 36)) + "px");
    }
    function open(t) { trigger = t; fly.hidden = false; place(); t.setAttribute("aria-expanded", "true"); }
    function close() { fly.hidden = true; if (trigger) trigger.setAttribute("aria-expanded", "false"); }
    SH.$$("[data-sh-dflyout-open]").forEach(function (t) {
      t.setAttribute("aria-expanded", "false");
      t.addEventListener("click", function (e) { e.stopPropagation(); if (!fly.hidden && trigger === t) close(); else open(t); });
    });
    SH.$$("[data-sh-dflyout-close]", fly).forEach(function (b) { b.addEventListener("click", close); });
    document.addEventListener("click", function (e) { if (!fly.hidden && !fly.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !fly.hidden) close(); });
    window.addEventListener("resize", place);
    if (more && slots) more.addEventListener("click", function () {
      var show = slots.hidden; slots.hidden = !show; more.setAttribute("aria-expanded", show ? "true" : "false");
    });
  });
})();
