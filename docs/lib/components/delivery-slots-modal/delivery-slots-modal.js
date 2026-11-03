/* delivery-slots-modal · open from [data-sh-slots-open], close on X / overlay / Esc, focus returns to the opener.
   Fills "October 21" / "October 22" from today's date so the prototype stays current during testing.
   SH.slots.open() / SH.slots.close() for scripts.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  SH.onReady(function () {
    var root = SH.$("[data-sh-slots]");
    if (!root) return;
    var opener = null;
    SH.$$("[data-sh-slots-day]", root).forEach(function (el) {
      var d = new Date(); d.setDate(d.getDate() + Number(el.getAttribute("data-sh-slots-day")));
      el.textContent = MONTHS[d.getMonth()] + " " + d.getDate();
    });
    function onKey(e) { if (e.key === "Escape") close(); }
    function open(from) {
      opener = from || document.activeElement;
      root.hidden = false;
      document.documentElement.style.overflow = "hidden";
      SH.$(".sh-slots__close", root).focus();
      document.addEventListener("keydown", onKey);
    }
    function close() {
      root.hidden = true;
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (opener && opener.focus) opener.focus();
    }
    SH.$$("[data-sh-slots-open]").forEach(function (b) { b.addEventListener("click", function () { open(b); }); });
    SH.$$("[data-sh-slots-close]", root).forEach(function (b) { b.addEventListener("click", close); });
    SH.slots = { open: open, close: close };
  });
})();
