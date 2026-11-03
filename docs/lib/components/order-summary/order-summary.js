/* order-summary · follows the selected fulfillment method (sh:cart-method) and quantity (sh:cart-qty); recomputes tax and total.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  function money(n) { return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function num(t) { var n = parseFloat(String(t).replace(/[^0-9.]/g, "")); return isNaN(n) ? 0 : n; }
  function bind(root) {
    var rate = parseFloat(root.getAttribute("data-sh-tax-rate")) || 0;
    var state = { subtotal: num(SH.$('[data-sh-sum="subtotal"]', root).textContent), method: num(SH.$('[data-sh-sum="method-price"]', root).textContent) };
    function set(key, val) { SH.$$('[data-sh-sum="' + key + '"]', root).forEach(function (el) { el.textContent = val; }); }
    function render() {
      var tax = Math.round(state.subtotal * rate * 100) / 100;
      set("subtotal", money(state.subtotal)); set("tax", money(tax));
      set("method-price", state.method ? money(state.method) : "FREE");
      set("total", money(state.subtotal + state.method + tax));
    }
    document.addEventListener("sh:cart-method", function (e) {
      var d = e.detail; state.method = d.price === "FREE" ? 0 : num(d.price);
      set("method-label", d.label); var icon = SH.$('[data-sh-sum="method-icon"]', root); if (icon && d.icon) icon.setAttribute("src", d.icon);
      render();
    });
    document.addEventListener("sh:cart-qty", function (e) {
      state.subtotal = e.detail.total; set("count", e.detail.qty + (e.detail.qty === 1 ? " item" : " items")); render();
    });
  }
  SH.onReady(function () { SH.$$("[data-sh-summary]").forEach(bind); });
})();
