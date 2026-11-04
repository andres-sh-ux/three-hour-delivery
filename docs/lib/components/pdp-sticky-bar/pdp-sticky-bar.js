/* pdp-sticky-bar · shows once the product sections ([data-sh-psb-start] or .sh-pdp-details) reach the top,
   sits right under the header's sticky bar when that is showing, highlights the tab of the section in view,
   and scrolls to a tab's section (href="#id") with the bar's height as offset. Stepper is local; Add to Cart is inert.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  SH.onReady(function () {
    var root = SH.$("[data-sh-psb]"); if (!root) return;
    var start = SH.$("[data-sh-psb-start]") || SH.$(".sh-pdp-details") || SH.$(".sh-pdp-buy__cart");
    var tabs = SH.$$("[data-sh-psb-tab]", root), shown = false;
    function offset() { var s = SH.$("[data-sh-sticky].is-visible"); return s ? s.offsetHeight : 0; }
    function target(a) { var h = a.getAttribute("href"); return h && h.length > 1 ? document.getElementById(h.slice(1)) : null; }
    function update() {
      var top = offset(); root.style.top = top + "px";
      var line = top + root.offsetHeight + 1;
      var show = !!start && start.getBoundingClientRect().top < line;
      if (show !== shown) {
        shown = show; root.classList.toggle("is-visible", show); root.setAttribute("aria-hidden", String(!show));
        SH.$$("a, button, input", root).forEach(function (el) { el.tabIndex = show ? 0 : -1; });
      }
      var active = tabs[0];
      tabs.forEach(function (a) { var t = target(a); if (t && t.getBoundingClientRect().top <= line) active = a; });
      tabs.forEach(function (a) { a.classList.toggle("is-active", a === active); });
    }
    root.addEventListener("click", function (e) {
      var a = e.target.closest("[data-sh-psb-tab], .sh-psb__details a"), step = e.target.closest("[data-sh-psb-step]");
      if (a) {
        e.preventDefault(); var t = a.hasAttribute("data-sh-psb-tab") ? target(a) : null;
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - offset() - root.offsetHeight + 1, behavior: "smooth" });
      } else if (step) {
        var input = SH.$("[data-sh-psb-qty]", root), n = Math.max(0, (parseInt(input.value, 10) || 0) + Number(step.getAttribute("data-sh-psb-step")));
        input.value = n || ""; SH.$(".sh-psb__step--minus", root).disabled = !n;
      }
    });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // The header's sticky bar shows / hides from its own observer: follow it when its class changes
    var sticky = SH.$("[data-sh-sticky]");
    if (sticky && "MutationObserver" in window) new MutationObserver(update).observe(sticky, { attributes: true, attributeFilter: ["class"] });
    update();
  });
})();
