/* checkout-review-items · keeps "Arriving" in step with the Shipping Method block on the Review step.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  function bind(root) {
    var date = SH.$('[data-sh-co-items="arriving"]', root), icon = SH.$('[data-sh-co-items="arriving-icon"]', root);
    document.addEventListener("sh:checkout-method", function (e) {
      var d = e.detail || {};
      if (date && d.arrives) date.textContent = d.arrives;
      if (icon && d.icon) icon.setAttribute("src", d.icon);
    });
    document.addEventListener("sh:checkout-slot", function (e) {
      var d = e.detail || {};
      if (date && d.when) date.textContent = d.when;
    });
  }
  SH.onReady(function () { SH.$$("[data-sh-co-items]").forEach(bind); });
})();
