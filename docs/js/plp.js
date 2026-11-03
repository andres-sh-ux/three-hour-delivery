/* PLP · fills the grid with products captured from the live PLP (PEX Tubing for Radiant Heat, 2026-10-21).
   The first card in the grid is the template; the rest are clones. All cards link to pdp.html.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  var IMG = "https://d3501hjdis3g5w.cloudfront.net/images/products/medium/";
  var P = [
    ['1/2" Oxygen Barrier PEX-b Tubing (300 ft Coil)', "T050-300-OXY", "Bluefin", 4.5, 275, "$87.97", "$87.09", [["4 - 9", "$84.79"], ["10 +", "$83.92"]], "Get 621", "Total Available: 2,218", "t050-300-oxy-3.jpg"],
    ['1/2" Oxygen Barrier PEX-b Tubing (1,000 ft Coil)', "T050-1000-OXY", "Bluefin", 4.5, 275, "$243.37", "$240.94", [["4 - 5", "$238.21"], ["6 +", "$235.80"]], "Get 156", "Total Available: 1,172", "t050-1000-oxy-3.jpg"],
    ['1/2" hePEX - (300 ft. coil)', "A1250500", "Uponor (Wirsbo)", 5, 184, "$253.95", "$248.86", [["2 - 5", "$243.88"], ["6 +", "$238.91"]], "Get 295", "Total Available: 816", "a1250500-3.jpg"],
    ['3/4" hePEX - (100 ft. coil)', "A1140750", "Uponor (Wirsbo)", 5, 184, "$155.71", "$151.17", [["2 - 3", "$148.14"], ["4 +", "$145.13"]], "Get 63", "Total Available: 286", "a1140750-3.jpg"],
    ['3/4" Oxygen Barrier PEX-b Tubing (300 ft Coil)', "T075-300-OXY", "Bluefin", 4.5, 275, "$150.95", "$143.95", [["2 - 3", "$141.53"], ["4 +", "$139.12"]], "Get 89", "Total Available: 252", "t075-300-oxy-3.jpg"],
    ['1/2" hePEX - (1000 ft. coil)', "A1220500", "Uponor (Wirsbo)", 5, 184, "$822.39", "$805.29", [["2 - 3", "$785.16"], ["4 +", "$765.54"]], "Get 52", "Total Available: 278", "a1220500-3.jpg"],
    ['1/2" hePEX - (100 ft. coil)', "A1140500", "Uponor (Wirsbo)", 5, 184, "$105.02", "$101.30", [["2 - 3", "$98.91"], ["4 +", "$96.53"]], "Get 22", "Total Available: 91", "a1140500-3.jpg"],
    ['3/4" hePEX - (300 ft. coil)', "A1250750", "Uponor (Wirsbo)", 5, 184, "$422.77", "$413.44", [["2 - 3", "$405.17"], ["4 +", "$396.90"]], "Get 36", "Total Available: 119", "a1250750uponor01jan2026.jpg"]
  ];
  var DATE = "Today by 12PM";   // one arrival time across all prototype surfaces

  SH.onReady(function () {
    var grid = SH.$("[data-sh-product-grid]"); if (!grid) return;
    var first = SH.$("[data-sh-product-card]", grid), prev = first;
    P.forEach(function (p, i) {
      var d = { title: p[0], href: "pdp.html", sku: p[1], brand: p[2], rating: p[3], reviews: p[4], was: p[5], price: p[6],
                tiers: p[7], qty: p[8], date: DATE, total: p[9], image: IMG + p[10] };
      prev = i === 0 ? SH.productCard.fill(first, d) : SH.productCard.clone(prev, d);
    });
  });
})();
