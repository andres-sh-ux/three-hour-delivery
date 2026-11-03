/* Prototype flow (project-only): links the pages together so they can be clicked through in order.
   Logo → plp · category circles → plp · cart icon / Add to Cart → cart · Secure Checkout → shipping · CONTINUE → review · Review Edit links → shipping.
   Links keep the review panel settings (js/proposals.js rewrites hrefs; go() adds them).
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  function href(sel, url) { SH.$$(sel).forEach(function (a) { a.setAttribute("href", url); }); }
  function go(sel, url) { SH.$$(sel).forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); location.href = url + (window.THD ? THD.query() : location.search); }); }); }
  SH.onReady(function () {
    href(".sh-header__logo, .sh-sticky__logo, .sh-coh__logo", "plp.html");
    href(".sh-header__action--cart", "cart.html");
    href(".sh-cats a", "plp.html");
    go(".sh-pdp-buy__cart", "cart.html");
    go(".sh-summary__checkout", "shipping.html");
    go(".sh-co-auth__continue", "review.html");
    href(".sh-co-review__row .sh-co-review__edit", "shipping.html");
    href('.sh-coh__step[data-sh-step="shipping"] span', "shipping.html");
  });
})();
