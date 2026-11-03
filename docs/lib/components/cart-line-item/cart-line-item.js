/* cart-line-item · orange quantity stepper: trash icon at qty 1, minus above 1; line total from data-sh-unit.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  function money(n) { return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function bind(root) {
    var input = SH.$("[data-sh-line-qty]", root), total = SH.$("[data-sh-line-total]", root);
    function unit() { return parseFloat(root.getAttribute("data-sh-unit")) || 0; }   // read each time, so prototypes can change data-sh-unit
    function sync(fire) {
      var v = Math.max(1, parseInt(input.value, 10) || 1);
      input.value = v; root.classList.toggle("is-multi", v > 1);
      if (total) total.textContent = money(v * unit());
      if (fire) document.dispatchEvent(new CustomEvent("sh:cart-qty", { detail: { qty: v, total: v * unit() } }));
    }
    SH.$$("[data-sh-line-step]", root).forEach(function (b) {
      b.addEventListener("click", function () {
        var v = parseInt(input.value, 10) || 1, d = Number(b.getAttribute("data-sh-line-step"));
        if (d < 0 && v <= 1) return; /* live: trash at 1 removes the item; not wired in the prototype */
        input.value = v + d; sync(true);
      });
    });
    input.addEventListener("change", function () { sync(true); });
    sync(false);
  }
  SH.onReady(function () { SH.$$("[data-sh-cart-line]").forEach(bind); });
})();
