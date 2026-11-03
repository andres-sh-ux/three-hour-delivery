/* total-available-modal · open from any [data-sh-ta-open] (delegated; the head total follows the opener's "Total Available: N"), close on X / overlay / Esc, focus returns to the opener.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  SH.onReady(function () {
    var root = SH.$("[data-sh-ta]"); if (!root) return;
    var opener = null;
    function onKey(e) { if (e.key === "Escape") close(); }
    var total = SH.$(".sh-ta__title b", root);
    function open(b) {
      opener = b; var m = /Total Available:\s*([\d,]+)/.exec(b.textContent || ""); if (m && total) total.textContent = m[1];
      root.hidden = false; document.documentElement.classList.add("sh-no-scroll"); document.addEventListener("keydown", onKey); SH.$(".sh-ta__close", root).focus(); }
    function close() { root.hidden = true; document.documentElement.classList.remove("sh-no-scroll"); document.removeEventListener("keydown", onKey); if (opener) opener.focus(); }
    // Delegated, so cards rendered after load (PLP grids) open it too.
    document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-sh-ta-open]"); if (b) { e.preventDefault(); open(b); } });
    SH.$$("[data-sh-ta-close]", root).forEach(function (b) { b.addEventListener("click", close); });
  });
})();
