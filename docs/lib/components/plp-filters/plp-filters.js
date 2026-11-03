/* plp-filters · group collapse, Hide/Show Filters, Reset.
   Hide Filters toggles [data-sh-hidden] on the component and fires "sh:filters-toggle" (detail.hidden) on it,
   so a page layout can widen its content if it wants.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  SH.onReady(function () {
    SH.$$("[data-sh-plp-filters]").forEach(function (root) {
      SH.$$("[data-sh-filter-toggle]", root).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var open = btn.getAttribute("aria-expanded") !== "true";
          btn.setAttribute("aria-expanded", String(open));
          var list = document.getElementById(btn.getAttribute("aria-controls"));
          if (list) list.hidden = !open;
        });
      });
      var hide = SH.$("[data-sh-filters-hide]", root), label = SH.$("[data-sh-filters-hide-label]", root);
      if (hide) hide.addEventListener("click", function () {
        var hidden = !root.hasAttribute("data-sh-hidden");
        root.toggleAttribute("data-sh-hidden", hidden);
        hide.setAttribute("aria-expanded", String(!hidden));
        if (label) label.textContent = hidden ? "Show Filters" : "Hide Filters";
        root.dispatchEvent(new CustomEvent("sh:filters-toggle", { bubbles: true, detail: { hidden: hidden } }));
      });
      var reset = SH.$("[data-sh-filters-reset]", root);
      if (reset) reset.addEventListener("click", function () {
        SH.$$("[data-sh-filter]", root).forEach(function (cb) { cb.checked = false; });
      });
    });
  });
})();
