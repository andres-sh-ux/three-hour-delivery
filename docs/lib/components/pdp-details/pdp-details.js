/* pdp-details · accordion toggles (–/+).
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  SH.onReady(function () {
    SH.$$("[data-sh-pdp-details] .sh-pdp-details__toggle").forEach(function (btn) {
      var body = document.getElementById(btn.getAttribute("aria-controls"));
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        body.hidden = !open;
      });
    });
  });
})();
