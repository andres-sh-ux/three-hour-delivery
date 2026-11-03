/* ==========================================================================
   Component: header — behavior
   - Menu drawer: hamburger (mobile) + sticky MENU; overlay / Esc / × close
   - Help panel: HELP (mobile) / Contact & Support (desktop popover)
   - Sticky compact bar: slides in once the main header leaves the viewport
   - SH.setCartCount(n): updates every cart badge
   Requires: foundation/sh.js
   Prototype code: review and test before using anywhere near production.
   ========================================================================== */
(function () {
  "use strict";
  var SH = window.SH, $ = SH.$, $$ = SH.$$;

  SH.setCartCount = function (n) { $$("[data-sh-cart-count]").forEach(function (el) { el.textContent = n; }); };

  SH.onReady(function () {
    var drawer = $("[data-sh-drawer]");
    var overlay = $("[data-sh-overlay]");
    var help = $("[data-sh-help]");
    var sticky = $("[data-sh-sticky]");
    var header = $("[data-sh-header]");
    var lastTrigger = null;
    if (!header) return;

    function setDrawer(open) {
      if (!drawer) return;
      if (open) {
        overlay.hidden = false;
        requestAnimationFrame(function () { overlay.classList.add("is-open"); });
      } else {
        overlay.classList.remove("is-open");
        setTimeout(function () { if (!drawer.classList.contains("is-open")) overlay.hidden = true; }, 300);
      }
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      document.documentElement.classList.toggle("sh-no-scroll", open);
      $$('[data-sh-toggle="drawer"]').forEach(function (b) { b.setAttribute("aria-expanded", String(open)); });
      if (open) { var first = $("a, button", drawer); if (first) first.focus(); }
      else if (lastTrigger) { lastTrigger.focus(); }
    }

    function setHelp(open) {
      if (!help) return;
      help.hidden = !open;
      $$('[data-sh-toggle="help"]').forEach(function (b) { b.setAttribute("aria-expanded", String(open)); });
    }

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-sh-toggle], [data-sh-close], [data-sh-overlay], [data-sh-sticky-search]");
      if (!t) {
        if (help && !help.hidden && !e.target.closest("[data-sh-help]")) setHelp(false);
        return;
      }
      if (t.matches("[data-sh-overlay]")) return setDrawer(false);
      if (t.matches("[data-sh-sticky-search]")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        var input = $("#sh-search-input");
        if (input) setTimeout(function () { input.focus({ preventScroll: true }); }, 350);
        return;
      }
      var which = t.getAttribute("data-sh-toggle") || t.getAttribute("data-sh-close");
      var closing = t.hasAttribute("data-sh-close");
      if (which === "drawer") {
        lastTrigger = closing ? lastTrigger : t;
        setDrawer(closing ? false : !drawer.classList.contains("is-open"));
      } else if (which === "help") {
        e.stopPropagation();
        setHelp(closing ? false : help.hidden);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (drawer && drawer.classList.contains("is-open")) setDrawer(false);
      else if (help && !help.hidden) setHelp(false);
    });

    if (sticky && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var show = !entries[0].isIntersecting;
        sticky.classList.toggle("is-visible", show);
        sticky.setAttribute("aria-hidden", String(!show));
        $$("a, button", sticky).forEach(function (el) { el.tabIndex = show ? 0 : -1; });
        if (show) setHelp(false);
      }).observe(header);
    }

    window.matchMedia("(min-width: 992px)").addEventListener("change", function () { setHelp(false); });
  });
})();
