/* product-card · quantity stepper, fill/clone helpers, fulfillment hooks.
   SH.productCard.fill(card, data)   data: { title, href, image, sku, brand, brandHref, rating (0-5, .5 steps),
                                             reviews, was, price, tiers: [["4 - 9","$84.79"], …], qty, date, total }
   SH.productCard.clone(card, data)  → new card (inserted after `card`), filled with data
   SH.setFulfillment(type, opts) now lives in foundation/sh.js (shared with the PDP components)
   SH.productCard.setMark(html)      shows content above the promise line on every card ("" hides it)
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  var SH = window.SH = window.SH || {};
  var STAR = { f: "star-full.svg", h: "star-half.svg" };

  function set(card, key, text) { SH.$$('[data-sh-pc="' + key + '"]', card).forEach(function (el) { el.textContent = text; }); }

  function fill(card, d) {
    if (d.title != null) set(card, "title", d.title);
    if (d.href) SH.$$('[data-sh-pc="link"]', card).forEach(function (a) { a.setAttribute("href", d.href); });
    if (d.image) { var img = SH.$('[data-sh-pc="image"]', card); img.src = d.image; img.alt = ""; }
    if (d.sku != null) set(card, "sku", d.sku);
    if (d.brand != null) { set(card, "brand", d.brand); if (d.brandHref) SH.$('[data-sh-pc="brand"]', card).setAttribute("href", d.brandHref); }
    if (d.reviews != null) set(card, "reviews", "(" + d.reviews + ")");
    if (d.was != null) set(card, "was", d.was);
    if (d.price != null) set(card, "price", d.price);
    if (d.qty != null) set(card, "qty", d.qty);
    if (d.date != null) set(card, "date", d.date);
    if (d.total != null) set(card, "total", d.total);
    if (d.rating != null) {
      var stars = SH.$('[data-sh-pc="stars"]', card), base = SH.$("img", stars).getAttribute("src").replace(/[^/]*$/, "");
      stars.setAttribute("aria-label", d.rating + " out of 5 stars");
      SH.$$("img", stars).forEach(function (img, i) {
        var v = d.rating - i;
        img.style.visibility = v > 0 ? "visible" : "hidden";
        img.setAttribute("src", base + (v >= 1 ? STAR.f : STAR.h));
      });
    }
    if (d.tiers) {
      var box = SH.$('[data-sh-pc="tiers"]', card), row = SH.$(".sh-product-card__tier", box);
      SH.$$(".sh-product-card__tier", box).slice(1).forEach(function (r) { r.remove(); });
      d.tiers.forEach(function (t, i) {
        var r = i === 0 ? row : row.cloneNode(true);
        SH.$(".sh-product-card__tier-qty", r).textContent = t[0];
        SH.$("strong", r).textContent = t[1];
        if (i > 0) box.appendChild(r);
      });
    }
    return card;
  }

  function clone(card, d) {
    var c = card.cloneNode(true);
    card.parentNode.insertBefore(c, card.nextSibling);
    bind(c);
    return fill(c, d || {});
  }

  function bind(card) {
    var input = SH.$("[data-sh-pc-qty]", card), minus = SH.$('[data-sh-pc-step="-1"]', card);
    if (!input || input.dataset.shBound) return;
    input.dataset.shBound = "1";
    // Empty by default (as on the live tile). + from empty → 1; – never goes below 1; clearing the field is allowed.
    function sync() {
      var v = parseInt(input.value, 10);
      if (isNaN(v) || v < 1) { input.value = ""; minus.disabled = true; return; }
      input.value = v; minus.disabled = v <= 1;
    }
    SH.$$("[data-sh-pc-step]", card).forEach(function (b) {
      b.addEventListener("click", function () {
        var v = parseInt(input.value, 10) || 0, step = Number(b.getAttribute("data-sh-pc-step"));
        input.value = Math.max(1, v + step); sync();
      });
    });
    input.addEventListener("change", sync);
  }

  SH.productCard = {
    fill: fill, clone: clone,
    setMark: function (html) {
      SH.$$('[data-sh-pc="mark"]').forEach(function (el) { el.innerHTML = html || ""; el.hidden = !html; });
    }
  };


  SH.onReady(function () { SH.$$("[data-sh-product-card]").forEach(bind); });
})();
