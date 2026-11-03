/* Cart + checkout show the same product as the PDP (Bluefin T050-300-OXY, $87.09), so the journey is one story.
   Fills every cart-line-item on the page, then lets order-summary / checkout-summary recompute.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  var P = { title: '1/2" Oxygen Barrier PEX-b Tubing (300 ft Coil)', sku: "T050-300-OXY", brand: "Bluefin", unit: 87.09,
            image: "https://d3501hjdis3g5w.cloudfront.net/images/products/large/t050-300-oxy-3.jpg", href: "pdp.html" };
  var money = function (n) { return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
  SH.onReady(function () {
    var lines = SH.$$("[data-sh-cart-line]");
    lines.forEach(function (line) {
      line.setAttribute("data-sh-unit", String(P.unit));
      SH.$$(".sh-cart-line__title, .sh-cart-line__media", line).forEach(function (a) { a.setAttribute("href", P.href); });
      var t = SH.$(".sh-cart-line__title", line); if (t) t.textContent = P.title;
      var img = SH.$(".sh-cart-line__media img", line); if (img) img.setAttribute("src", P.image);
      var meta = SH.$(".sh-cart-line__meta", line); if (meta) { SH.$("b", meta).textContent = P.sku; SH.$("a", meta).textContent = P.brand; }
      var rm = SH.$(".sh-cart-line__remove", line); if (rm) rm.setAttribute("aria-label", "Remove " + P.title + " from cart");
      var u = SH.$(".sh-cart-line__unit b", line); if (u) u.textContent = money(P.unit);
      var qty = SH.$("[data-sh-line-qty]", line); if (qty) qty.dispatchEvent(new Event("change"));   // line total + sh:cart-qty → order-summary
    });
    var sum = SH.$("[data-sh-co-summary]");
    if (sum) {
      sum.setAttribute("data-sh-subtotal", String(P.unit));
      SH.$$('[data-sh-co-sum="subtotal"]', sum).forEach(function (el) { el.textContent = money(P.unit); });
      SH.$$('[data-sh-co-sum="items"] li', sum).forEach(function (li) { li.innerHTML = "<span>" + P.title + " · Qty 1</span><b>" + money(P.unit) + "</b>"; });
      var del = SH.$('[data-sh-co-option="delivery"]'), icon = del && SH.$("[data-sh-ff-icon]", del);
      document.dispatchEvent(new CustomEvent("sh:checkout-method", { detail: { method: "delivery", label: "Delivery", price: "$29.00", icon: icon ? icon.getAttribute("src") : "" } }));
    }
  });
})();
