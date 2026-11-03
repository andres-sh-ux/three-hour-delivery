/* Homepage rails (project-only). Products captured from the live homepage of the test account (2026-10-21).
   Reorder is filled to a full row (live had one item); Recently Viewed matches live. Only the PEX tubing links to pdp.html.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  var IMG = "https://d3501hjdis3g5w.cloudfront.net/images/products/medium/";
  var STOCK = function (a, b) { return { type: "stock", tiers: [["4 - 9", a], ["10 +", b]] }; };
  var BOX = function (pct, box, qty) { return { type: "box", pct: pct, box: box, qty: qty }; };
  var P = {
    "T050-300-OXY": { title: '1/2" Oxygen Barrier PEX-b Tubing (300 ft Coil)', brand: "Bluefin", price: "$87.09", image: IMG + "t050-300-oxy-3.jpg", href: "pdp.html", save: STOCK("$84.79", "$83.92") },
    "PRBV075": { title: '3/4" Press Full Port Brass Ball Valve (Lead Free)', brand: "Bluefin", price: "$13.58", image: IMG + "prbv075bluefin01.jpg", save: BOX("18%", "$111.00", 10) },
    "50053952-010": { title: "Replacement Motor for TrueFRESH Ventilators (VNT5150 and VNT5200)", brand: "Honeywell Home", price: "$668.94", image: IMG + "50053952-010-3.jpg", save: null },
    "BVT050": { title: '1/2" Full Port Threaded Ball Valve (Lead Free)', brand: "Bluefin", price: "$5.48", image: IMG + "bvt050bluefin01.jpg", save: BOX("18%", "$44.90", 10) },
    "GLZS4BA2410": { title: "2 Ton 14.3 SEER2 Energy-Efficient Standard Split System R-32 Refrigerant Heat Pump", brand: "Goodman", price: "$2,289.42", image: IMG + "goodman-glzs4ba2410.jpg", save: null },
    "TRQ51402": { title: '3/8" Drive 90-Tooth Dual-Direction Micrometer Torque Wrench (10 - 100 ft-lb)', brand: "Tekton", price: "$103.55", image: IMG + "tektontrq51402001stockjun2026.jpg", save: null },
    "GLXS3BN3610": { title: "3 Ton 13.4 SEER2 Energy-Efficient Standard Split System R-32 Refrigerant Air Conditioner, North Region", brand: "Goodman", price: "$2,021.92", image: IMG + "goodman-glxs3bn3610.jpg", save: null },
    "BVS050": { title: '1/2" Full Port Sweat Ball Valve (Lead Free)', brand: "Bluefin", price: "$5.42", image: IMG + "bvs050-3.jpg", save: BOX("18%", "$44.20", 10) },
    "31266": { title: '3/8" Copper 90° Elbow', brand: "Elkhart", price: "$3.78", image: IMG + "31266-3.jpg", save: BOX("16%", "$79.75", 25) },
    "31262": { title: '1/4" Copper 90° Elbow', brand: "Elkhart", price: "$3.15", image: IMG + "31262-3.jpg", save: BOX("15%", "$53.40", 20) },
    "93013251": { title: "SCALA2 3-45 Water Booster Pump w/ NEMA 5-15P Plug (115V)", brand: "Grundfos", price: "$987.20", image: IMG + "93013251grundfos01.jpg", save: null }
  };
  var RAILS = {
    reorder: ["BVS050", "BVT050", "PRBV075", "31266", "31262", "T050-300-OXY", "93013251", "TRQ51402"],
    recent: ["T050-300-OXY", "PRBV075", "50053952-010", "BVT050", "GLZS4BA2410", "TRQ51402", "GLXS3BN3610", "BVS050", "31266", "31262", "93013251"]
  };

  SH.onReady(function () {
    Object.keys(RAILS).forEach(function (name) {
      var tpl = SH.$('[data-thd-rail="' + name + '"]');
      if (!tpl || !SH.productCardMini) return;
      var list = tpl.parentNode;
      RAILS[name].forEach(function (sku, i) {
        var li = i === 0 ? tpl : tpl.cloneNode(true), card = SH.$(".sh-pcm", li);
        if (i > 0) { delete card.dataset.shBound; list.appendChild(li); }
        SH.productCardMini.fill(card, Object.assign({ sku: sku, href: "#" }, P[sku]));
        SH.productCardMini.bind(card);
      });
    });
    document.dispatchEvent(new CustomEvent("sh:content-change"));
  });
})();
