/* PDP page wiring (project-only): breadcrumb → prototype pages, then carry the variant params.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  var CRUMBS = { 0: "index.html", 3: "plp.html" };
  SH.onReady(function () {
    if (!SH.$("[data-sh-pdp-header]")) return;
    Object.keys(CRUMBS).forEach(function (i) {
      var a = SH.$('[data-sh-crumb="' + i + '"]');
      if (a) a.setAttribute("href", CRUMBS[i]);
    });
  });
})();
