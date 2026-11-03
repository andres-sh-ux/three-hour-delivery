/* pdp-buy-box · quantity stepper (empty by default, as on live: + from empty → 1, – disabled at 1 or empty).
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  function bind(root) {
    var input = SH.$("[data-sh-pdp-qty]", root), minus = SH.$('[data-sh-pdp-step="-1"]', root);
    function sync() {
      var v = parseInt(input.value, 10);
      if (isNaN(v) || v < 1) { input.value = ""; minus.disabled = true; return; }
      input.value = v; minus.disabled = v <= 1;
    }
    SH.$$("[data-sh-pdp-step]", root).forEach(function (b) {
      b.addEventListener("click", function () {
        var v = parseInt(input.value, 10) || 0;
        input.value = Math.max(1, v + Number(b.getAttribute("data-sh-pdp-step"))); sync();
      });
    });
    input.addEventListener("change", sync);
  }
  SH.onReady(function () { SH.$$("[data-sh-pdp-buy]").forEach(bind); });
})();
