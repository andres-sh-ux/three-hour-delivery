/* cart-shipment · delivery option radio cards: selected style, "Arriving" text/icon, and a "sh:cart-method" event for order-summary.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  function bind(root) {
    var options = SH.$$("[data-sh-cart-option]", root);
    var arriving = SH.$('[data-sh-cart="arriving"]', root), icon = SH.$('[data-sh-cart="arriving-icon"]', root);
    function sync(fire) {
      options.forEach(function (o) {
        var on = SH.$("input", o).checked;
        o.classList.toggle("is-selected", on);
        if (!on) return;
        var img = SH.$("[data-sh-ff-icon]", o), label = SH.$("[data-sh-ff-label]", o);
        if (arriving) arriving.textContent = o.getAttribute("data-sh-arrives");
        if (icon && img) icon.setAttribute("src", img.getAttribute("src"));
        if (fire) document.dispatchEvent(new CustomEvent("sh:cart-method", { detail: {
          method: o.getAttribute("data-sh-cart-option"), label: label ? label.textContent : "",
          price: o.getAttribute("data-sh-price"), icon: img ? img.getAttribute("src") : "" } }));
      });
    }
    options.forEach(function (o) { SH.$("input", o).addEventListener("change", function () { sync(true); }); });
    sync(false);
  }
  SH.onReady(function () { SH.$$("[data-sh-cart-shipment]").forEach(bind); });
})();
