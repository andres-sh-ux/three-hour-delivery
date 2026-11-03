/* checkout-header · sets the stepper from the page: [data-sh-checkout-step="shipping|payment|review"] anywhere on the page
   (e.g. on <main>). Earlier steps get .is-done (light fill + check), the current one .is-current.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  var ORDER = ["shipping", "payment", "review"];
  SH.onReady(function () {
    var host = SH.$("[data-sh-checkout-step]");
    var idx = ORDER.indexOf(host ? host.getAttribute("data-sh-checkout-step") : "shipping");
    if (idx < 0) idx = 0;
    SH.$$(".sh-coh__step").forEach(function (li) {
      var i = ORDER.indexOf(li.getAttribute("data-sh-step"));
      li.classList.toggle("is-done", i < idx);
      li.classList.toggle("is-current", i === idx);
      if (i === idx) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
  });
})();
