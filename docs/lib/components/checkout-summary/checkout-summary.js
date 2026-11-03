/* checkout-summary · follows "sh:checkout-method" and recomputes tax + total; Show My Items toggle.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  function money(n) { return "$" + n.toFixed(2); }
  function num(s) { var n = parseFloat(String(s || "").replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : n; }
  function bind(root) {
    var f = function (k) { return SH.$$('[data-sh-co-sum="' + k + '"]', root); };
    var rate = parseFloat(root.getAttribute("data-sh-tax-rate") || "0");
    var toggle = SH.$("[data-sh-co-sum-toggle]", root), items = f("items")[0];
    if (toggle && items) toggle.addEventListener("click", function () {
      var open = items.hasAttribute("hidden"); items.toggleAttribute("hidden", !open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.firstChild.nodeValue = open ? "Hide My Items" : "Show My Items";
    });
    function recompute(methodPrice) {
      var sub = num(root.getAttribute("data-sh-subtotal")), ship = num(methodPrice);
      var tax = Math.round((sub + ship) * rate * 100) / 100;
      f("tax").forEach(function (e) { e.textContent = money(tax); });
      f("total").forEach(function (e) { e.textContent = money(sub + ship + tax); });
    }
    document.addEventListener("sh:checkout-method", function (e) {
      var d = e.detail || {};
      f("method-label").forEach(function (el) { el.textContent = d.label; });
      f("method-icon").forEach(function (el) { if (d.icon) el.setAttribute("src", d.icon); });
      f("method-price").forEach(function (el) { el.textContent = /^\$/.test(d.price) ? money(num(d.price)) : d.price; });
      recompute(d.price);
    });
  }
  SH.onReady(function () { SH.$$("[data-sh-co-summary]").forEach(bind); });
})();
