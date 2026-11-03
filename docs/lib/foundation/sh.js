/* ==========================================================================
   SupplyHouse components — runtime helper (load once, before component JS)
   SH.onReady(fn): runs fn after DOMContentLoaded.
   SH.setFulfillment(type, { label, icon, alt }): type "delivery" | "pickup"; updates the icon/label of every
     [data-sh-ff=type] on the page (product cards, PDP tiles, delivery slots modal…). Used by prototypes.
   Prototype code: review and test before using anywhere near production.
   ========================================================================== */
(function () {
  "use strict";
  var SH = window.SH = window.SH || {};
  SH.$ = function (sel, root) { return (root || document).querySelector(sel); };
  SH.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  SH.onReady = function (fn) {
    function go() { (window.SH_INCLUDES || Promise.resolve()).then(fn); }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
    else go();
  };
  SH.setFulfillment = function (type, opts) {
    SH.$$('[data-sh-ff="' + type + '"]').forEach(function (el) {
      SH.$$("[data-sh-ff-icon]", el).forEach(function (icon) {
        if (opts.icon) icon.setAttribute("src", opts.icon);
        if (opts.alt || opts.label) icon.setAttribute("alt", icon.getAttribute("alt") === "" ? "" : (opts.alt || opts.label));
      });
      SH.$$("[data-sh-ff-label]", el).forEach(function (label) { if (opts.label != null) label.textContent = opts.label; });
    });
  };
})();
