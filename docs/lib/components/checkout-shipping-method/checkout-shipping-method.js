/* checkout-shipping-method · option + time-slot selection and See more / fewer time slots for prototypes.
   Fires "sh:checkout-method" and "sh:checkout-slot" on document (checkout-summary follows the first).
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  function bind(root) {
    var options = SH.$$("[data-sh-co-option]", root);
    var when = SH.$('[data-sh-co="when"]', root);
    var slots = SH.$$("[data-sh-slot]:not([disabled])", root);
    function syncOptions(fire) {
      options.forEach(function (o) {
        var on = SH.$("input", o).checked;
        o.classList.toggle("is-selected", on);
        if (!on || !fire) return;
        var img = SH.$("[data-sh-ff-icon]", o), label = SH.$("[data-sh-ff-label]", o);
        document.dispatchEvent(new CustomEvent("sh:checkout-method", { detail: {
          method: o.getAttribute("data-sh-co-option"), label: label ? label.textContent : "",
          price: o.getAttribute("data-sh-price"), icon: img ? img.getAttribute("src") : "",
          arrives: o.getAttribute("data-sh-arrives") } }));
      });
    }
    options.forEach(function (o) { SH.$("input", o).addEventListener("change", function () { syncOptions(true); }); });
    slots.forEach(function (s) {
      s.addEventListener("click", function () {
        slots.forEach(function (x) { var on = x === s; x.classList.toggle("is-selected", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
        if (when) when.textContent = s.getAttribute("data-sh-when");
        var del = SH.$('[data-sh-co-option="delivery"]', root);
        if (del) del.setAttribute("data-sh-arrives", s.getAttribute("data-sh-when"));
        document.dispatchEvent(new CustomEvent("sh:checkout-slot", { detail: {
          when: s.getAttribute("data-sh-when"), price: s.getAttribute("data-sh-price"), fastest: s.classList.contains("is-fastest") } }));
      });
    });
    var more = SH.$('[data-sh-co="more"]', root), moreLabel = SH.$('[data-sh-co="more-label"]', root);
    if (more) more.addEventListener("click", function () {
      var open = more.getAttribute("aria-expanded") !== "true";
      SH.$$('[data-sh-co="more-days"]', root).forEach(function (d) { d.hidden = !open; });
      more.setAttribute("aria-expanded", open ? "true" : "false");
      if (moreLabel) moreLabel.textContent = open ? "See fewer time slots" : "See more time slots";
    });
    syncOptions(false);
  }
  SH.onReady(function () { SH.$$("[data-sh-co-method]").forEach(bind); });
})();
