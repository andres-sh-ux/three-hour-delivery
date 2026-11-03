/* ==========================================================================
   Component: footer — behavior
   - Link-group accordion below 1200px (always open as columns above)
   - Keeps the copyright year current
   Requires: foundation/sh.js
   Prototype code: review and test before using anywhere near production.
   ========================================================================== */
(function () {
  "use strict";
  var SH = window.SH, $ = SH.$, $$ = SH.$$;
  var COLUMNS = window.matchMedia("(min-width: 1200px)");

  SH.onReady(function () {
    var groups = $$("[data-sh-accordion]");
    function sync() {
      groups.forEach(function (g) {
        var btn = $(".sh-footer__group-btn", g), body = $(".sh-footer__group-body", g);
        if (COLUMNS.matches) { body.hidden = false; btn.setAttribute("aria-expanded", "true"); btn.tabIndex = -1; }
        else { body.hidden = btn.getAttribute("data-open") !== "true"; btn.setAttribute("aria-expanded", String(!body.hidden)); btn.tabIndex = 0; }
      });
    }
    groups.forEach(function (g) {
      var btn = $(".sh-footer__group-btn", g);
      btn.addEventListener("click", function () {
        if (COLUMNS.matches) return;
        btn.setAttribute("data-open", String(btn.getAttribute("data-open") !== "true"));
        sync();
      });
    });
    sync();
    COLUMNS.addEventListener("change", sync);
    $$("[data-sh-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  });
})();
