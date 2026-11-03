/* ==========================================================================
   Component: header-signed-in: optional prototype helpers
   Behavior (drawer, help panel, sticky bar) comes from header/header.js.
   SH.setRep({ name: "Jordan", phone: "888-555-0142", photo: "assets/images/help-face.png" })
   SH.setZip("10001")
   Use placeholder data only, never real customer or rep details.
   Requires: foundation/sh.js
   Prototype code: review and test before using anywhere near production.
   ========================================================================== */
(function () {
  "use strict";
  var SH = window.SH;
  SH.setRep = function (rep) {
    if (rep.name) SH.$$("[data-sh-rep-name]").forEach(function (el) { el.textContent = rep.name; });
    if (rep.phone) {
      var digits = "1" + rep.phone.replace(/\D/g, "").slice(-10);
      SH.$$("[data-sh-rep-phone]").forEach(function (el) { el.textContent = rep.phone; });
      SH.$$("[data-sh-rep-tel]").forEach(function (el) { el.href = "tel:" + digits; });
      SH.$$("[data-sh-rep-sms]").forEach(function (el) { el.href = "sms://" + digits; });
    }
    if (rep.photo) SH.$$("[data-sh-rep-photo]").forEach(function (el) { el.src = rep.photo; });
  };
  SH.setZip = function (zip) { SH.$$("[data-sh-zip]").forEach(function (el) { el.textContent = zip; }); };
})();
