/* 3-Hour Delivery proposals (project-only).
   State lives in the page link and carries across pages:
     p = a (current proposal, default) | b (chips everywhere)
     cut = before | after (4PM cutoff)   t = short | mid | long (Delivery time row: the buttons show the actual times for the cutoff)
     Chip: Tag (light fill, no outline) on PLP, PDP and Cart; Shipping and Review keep the pill (decided 2026-11-09; shape and colour switches retired).
     Product cards always show Delivery first and no truck icon (card order / PLP truck switches retired 2026-11-04).
     Link-only (no panel control): banner = off | on, icon = truck | 08 | 04b | 05b (PDP Delivery tile: truck + separate bolt, or a combined truck + bolt icon from Figma)
   Every surface is rebuilt from the state, so switching in the review panel needs no reload.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  // Chips is the only proposal now (Bolt retired 2026-11-04); p=a links fall back to Chips. The Bolt code stays for reference.
  var KEYS = { p: ["b"], shape: ["tag"], cut: ["before", "after", "weekend"], t: ["short", "mid", "long"],
               chip: ["light"], banner: ["off", "on"], icon: ["truck", "08", "04b", "05b"] };
  var DEF = { p: "b", shape: "tag", cut: "before", t: "short", chip: "light", banner: "off", icon: "truck" };
  var TIMES = { before: { short: "2PM", mid: "12PM", long: "11:30AM" }, after: { short: "8AM", mid: "10AM", long: "11:30AM" } };
  TIMES.weekend = TIMES.after;   // weekend: next slot is Monday morning
  var S, LIB = "lib/";

  function read() {
    var q = new URLSearchParams(location.search), s = {};
    Object.keys(KEYS).forEach(function (k) { var v = q.get(k); s[k] = KEYS[k].indexOf(v) >= 0 ? v : DEF[k]; });
    return s;
  }
  function query(s) {
    var q = new URLSearchParams();
    Object.keys(KEYS).forEach(function (k) { if (s[k] !== DEF[k]) q.set(k, s[k]); });
    var str = q.toString(); return str ? "?" + str : "";
  }
  function data(s) {
    // before = weekday before 4PM (3-Hour) · after = weekday after 4PM (Early AM) ·
    // weekend = Friday after 4PM to Sunday 4PM: next slot is Monday, no 3-Hour / Early AM badge anywhere (Scott, 2026-11-09)
    var T = TIMES[s.cut][s.cut === "before" ? s.t : "short"], b = s.cut === "before", wk = s.cut === "weekend";   // Early AM / weekend is always by 8AM: the Delivery time sample only varies before 4PM
    var day = b ? "Today" : wk ? "Monday" : "Tomorrow";
    var next = b ? "Tomorrow" : wk ? "Tue, Nov 10" : "Thu, Nov 5";
    var pickup = b ? "in 1 Hour" : wk ? "Monday" : "Tomorrow";
    var ship = b ? "Tomorrow, Nov 4" : wk ? "Tue, Nov 10" : "Thu, Nov 5";
    return {
      T: T, label: b ? "3-Hour" : "Early AM", fast: !wk,
      day: day, dateLong: b ? "November 3" : wk ? "November 9" : "November 4",
      nextHead: b ? "<b>Tomorrow,</b> November 4" : wk ? "Tue, November 10" : "Thu, November 5",
      next: next, dayFull: day, nextFull: next,
      when: day + " by " + T,
      full: day + " by " + T,   // same wording everywhere (no date)
      pickupWhen: pickup, pickupArr: "Ready " + (b ? "in 1 Hour" : pickup),
      shipFull: ship, shipShort: b ? "Tomorrow" : ship
    };
  }
  var BOLT = function () { return '<img class="thd-bolt" src="' + LIB + 'assets/icons/same-day.svg" alt="" width="8" height="12">'; };
  // A = plain bolt + label; B = chip. withDelivery: say "Delivery" too (A: one label, B: chip + word).
  function mark(s, d, withDelivery, cls) {
    if (s.p === "live" || d.fast === false) return "";
    var c = cls ? " " + cls : "";
    if (s.p === "b") return '<span class="thd-chip' + c + '"><span class="thd-boltbox">' + BOLT() + '</span>' + d.label + "</span>" + (withDelivery ? '<span class="thd-word">Delivery</span>' : "");
    return '<span class="thd-mark' + c + '">' + BOLT() + d.label + (withDelivery ? " Delivery" : "") + "</span>";
  }
  function set(sel, text, root) { SH.$$(sel, root).forEach(function (el) { el.textContent = text; }); }

  /* ---- Header top bar (header-signed-in) ---- */
  function header(s, d) {
    var btns = SH.$$(".sh-header__fulfil"); if (btns.length < 2) return;
    var chev = '<img class="sh-header__chev" src="' + LIB + 'assets/icons/chevron-down.svg" width="12" height="7" alt="">';
    var del = btns[0], pick = btns[1];
    if (s.p === "live" || !d.fast) del.innerHTML = '<img src="' + LIB + 'assets/icons/delivery.svg" width="20" height="20" alt=""><span>Delivery</span> <b>' + d.when + "</b> " + chev;
    // top bar: always the plain treatment (bolt + "3-Hour Delivery"), in A and B
    else del.innerHTML = '<span class="thd-hdr">' + mark({ p: "a" }, d, true, "thd-mark--text") + "</span> <b>" + d.when + "</b> " + chev;
    pick.innerHTML = '<img src="' + LIB + 'assets/icons/pickup.svg" width="20" height="20" alt=""><span>Pickup</span> <b>' + d.pickupWhen + "</b> " + chev;
  }

  /* ---- Slot lists: header flyout + PDP "See Time Slots" modal ---- */
  function badge(el, s, d) { if (!el) return; el.innerHTML = BOLT() + (s.p === "live" ? "Fastest" : d.label); el.hidden = !d.fast; }
  function flyout(s, d) {
    var f = SH.$("[data-sh-dflyout]"); if (!f) return;
    var dates = SH.$$(".sh-dflyout__date", f), grids = SH.$$(".sh-dflyout__grid", f);
    if (dates[0]) dates[0].innerHTML = "<b>" + d.day + ",</b> " + d.dateLong;
    if (dates[1]) dates[1].innerHTML = d.nextHead;
    var fast = SH.$(".sh-dflyout__slot.is-fastest", f);
    if (fast) SH.$("b", fast).textContent = "By " + d.T;
    badge(SH.$('[data-sh-dflyout="badge"]', f), s, d);
    var first = grids[0] ? SH.$$(".sh-dflyout__slot", grids[0]) : [];
    if (first[1]) first[1].hidden = false;   // all Local Delivery windows stay available after the cutoff (By 8AM is added first)
    var second = grids[1] ? SH.$$(".sh-dflyout__slot", grids[1]) : [];
    if (second[0] && !second[1]) { var c = second[0].cloneNode(true); SH.$("b", c).textContent = "1PM - 4PM"; grids[1].appendChild(c); }
  }
  function slotsModal(s, d) {
    var m = SH.$("[data-sh-slots]"); if (!m) return;
    SH.$$(".sh-slots__slot.is-past", m).forEach(function (t) { t.classList.remove("is-past"); });
    var dates = SH.$$(".sh-slots__date", m);
    if (dates[0]) dates[0].innerHTML = "<b>" + d.day + ",</b> " + d.dateLong;
    if (dates[1]) dates[1].innerHTML = d.nextHead;
    var fast = SH.$(".sh-slots__slot.is-fastest", m);
    if (fast) SH.$("b", fast).textContent = "By " + d.T;
    badge(SH.$('[data-sh-slots="badge"]', m), s, d);
    var grid = SH.$(".sh-slots__grid", m), first = grid ? SH.$$(".sh-slots__slot", grid) : [];
    if (first[1]) first[1].hidden = false;
  }

  /* ---- Product cards (PLP) ---- */
  var TRUCK = function () { return '<img data-sh-ff-icon src="' + LIB + 'assets/icons/delivery.svg" alt="Delivery" width="18" height="18">'; };
  function cards(s, d) {
    SH.$$("[data-sh-product-card]").forEach(function (card) {
      set('[data-sh-pc="date"]', d.when, card);
      var item = SH.$('.sh-product-card__ff-item[data-sh-ff="delivery"]', card); if (!item) return;
      item.innerHTML = s.p === "live" || !d.fast ? TRUCK() + '<span class="sh-product-card__ff-label" data-sh-ff-label>Delivery</span>'
                                       : '<span class="thd-ff">' + (s.p === "b"
                                           ? '<span class="thd-chip">' + (s.truck === "on" ? '<img class="thd-ff__truck" src="' + LIB + 'assets/icons/delivery.svg" alt="" width="16" height="16">' : "") + '<span class="thd-boltbox">' + BOLT() + '</span>' + d.label + " Delivery</span>"   // B: truck sits inside the chip
                                           : (s.truck === "on" ? '<img class="thd-ff__truck" src="' + LIB + 'assets/icons/delivery.svg" alt="" width="18" height="18">' : "") + mark(s, d, true)) + "</span>";   // B on the card: one chip, "3-Hour Delivery" / "Early AM Delivery" 
      item.classList.add("thd-tip-on"); item.setAttribute("data-thd-tip", "delivery");   // weekend: the live "Next Day Delivery" tooltip
      var pk = SH.$('.sh-product-card__ff-item[data-sh-ff="pickup"]', card);
      if (pk) { pk.classList.add("thd-tip-on"); pk.setAttribute("data-thd-tip", "pickup"); }
    });
  }
  var tip;
  function tooltip(s, d) {
    if (!tip) {
      tip = document.createElement("div"); tip.className = "sh-root thd-tip"; tip.setAttribute("role", "tooltip"); tip.hidden = true; document.body.appendChild(tip);
      function show(e) {
        var it = e.target.closest && e.target.closest(".thd-tip-on"); if (!it) return;
        var kind = it.getAttribute("data-thd-tip") || "delivery";
        tip.innerHTML = tipHTML(kind, tipD); tip.classList.toggle("thd-tip--pickup", kind === "pickup");
        var r = it.getBoundingClientRect(); tip.hidden = false;
        var w = tip.offsetWidth, x = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, document.documentElement.clientWidth - w - 8));
        tip.style.left = (x + window.scrollX) + "px"; tip.style.top = (r.bottom + window.scrollY + 12) + "px";   // below the element, as on the live site
        tip.style.setProperty("--thd-tip-caret", (r.left + r.width / 2 - x - 9) + "px");
      }
      function hide(e) { if (e.target.closest && e.target.closest(".thd-tip-on")) tip.hidden = true; }
      document.addEventListener("mouseover", show); document.addEventListener("focusin", show);
      document.addEventListener("mouseout", hide); document.addEventListener("focusout", hide);
    }
    tipD = d;
  }
  // Tooltip copy follows the live PLP: Delivery (3-Hour / Early AM, or the live "Next Day Delivery" on weekends) and Pickup
  var tipD;
  function tipHTML(kind, d) {
    var ic = function (n) { return '<img class="thd-tip__icon" src="' + LIB + 'assets/icons/' + n + '.svg" alt="" width="24" height="24">'; };
    if (kind === "pickup") return '<p class="thd-tip__title">' + ic("pickup") + "Pickup " + d.pickupWhen + "</p>" +
      '<p class="thd-tip__k">Pickup Location:</p><p>30 Apple Orchard Drive, Suite 1<br>Dayton, NJ, 08810</p><p class="thd-tip__link">View in Google Maps</p>' +
      '<p class="thd-tip__k thd-tip__gap">Pickup Hours:</p><p>Mon\u2013Fri: 7AM\u20136PM | Sat: 9AM\u20131PM</p>';
    if (!d.fast) return '<p class="thd-tip__title">' + ic("delivery") + "Next Day Delivery</p><p>$29 (FREE on orders over $500) or FREE UPS Shipping</p>";
    return '<p class="thd-tip__title">' + BOLT() + d.label + " Delivery</p>" +
      "<p>Order now, get it <b>" + d.when + "</b></p><p>Choose your delivery window at checkout</p><p>$29 (FREE on orders over $500)</p>";
  }

  /* ---- Total Available modal (PDP and PLP) ---- */
  function totalAvail(s, d) {
    var ta = SH.$("[data-sh-ta]"); if (!ta) return;
    set('[data-sh-ta="pickup-when"]', d.pickupWhen, ta); set('[data-sh-ta="delivery-when"]', d.when, ta);
    var tm = SH.$('[data-sh-ta="delivery-mark"]', ta); tm.innerHTML = mark(s, d, false); tm.hidden = s.p === "live" || !d.fast;
  }

  /* ---- PDP buy box ---- */
  function pdp(s, d) {
    set('[data-sh-pdp="date"]', d.when);
    var tile = SH.$('.sh-pdp-buy__tile[data-sh-ff="delivery"]');
    if (tile) {
      var logo = SH.$(".sh-pdp-buy__tile-logo", tile), row = SH.$(".thd-iconrow", logo);
      if (!row) { row = document.createElement("span"); row.className = "thd-iconrow"; logo.insertBefore(row, logo.firstChild); row.appendChild(SH.$("img", logo)); row.insertAdjacentHTML("beforeend", '<span class="thd-iconrow__mark"></span>'); }
      // PDP icon switch: a combined truck + bolt icon replaces the truck, and the label drops its own bolt
      var ic = SH.$("img", row); if (!ic.getAttribute("data-thd-src")) ic.setAttribute("data-thd-src", ic.getAttribute("src"));
      var combined = s.p !== "live" && s.icon !== "truck";
      ic.setAttribute("src", combined ? "assets/icons/truck-bolt-" + s.icon + ".svg" : ic.getAttribute("data-thd-src"));
      ic.classList.toggle("thd-combined", combined); ic.classList.toggle("thd-combined--wide", combined && s.icon !== "08");
      SH.$(".thd-iconrow__mark", row).innerHTML = "";
      var badgeEl = SH.$(".sh-pdp-buy__badge", tile), when = SH.$(".thd-when", tile);
      if (!when) { when = document.createElement("div"); when.className = "sh-pdp-buy__tile-when thd-when"; tile.appendChild(when); }
      when.innerHTML = "<b>" + d.when + "</b>";
      // 3-Hour / Early AM label sits under the delivery time (with a combined icon it drops its own bolt)
      var pm = SH.$(".thd-pdp-mark", tile);
      if (!pm) { pm = document.createElement("div"); pm.className = "thd-pdp-mark"; when.insertAdjacentElement("afterend", pm); }
      pm.innerHTML = combined ? mark(s, d, false).replace(/<img class="thd-bolt"[^>]*>/, "") : mark(s, d, false);
      pm.hidden = s.p === "live" || !d.fast;
      set('[data-sh-pdp="badge-label"]', d.when, tile);
      if (badgeEl) badgeEl.hidden = s.p !== "live"; when.hidden = s.p === "live";
    }
    // PDP sticky bar: same date, and the 3-Hour / Early AM label right after it
    var psb = SH.$("[data-sh-psb]");
    if (psb) { set('[data-sh-psb="date"]', d.when, psb); var pm2 = SH.$('[data-sh-psb="mark"]', psb); pm2.innerHTML = mark(s, d, false); pm2.hidden = s.p === "live" || !d.fast; }
    var ship = SH.$('.sh-pdp-buy__tile[data-sh-ff="ship"] .sh-pdp-buy__tile-when'); if (ship) ship.innerHTML = "<b>" + d.shipShort + "</b>";
    var pt = SH.$('.sh-pdp-buy__tile[data-sh-ff="pickup"]');
    if (pt) { set(".sh-pdp-buy__tile-qty", s.cut === "before" ? "621 in" : "621", pt); var pw = SH.$(".sh-pdp-buy__tile-when", pt); if (pw) pw.innerHTML = "<b>" + (s.cut === "before" ? "1 Hour" : d.pickupWhen) + "</b>"; }
  }

  /* ---- Cart ---- */
  function cart(s, d) {
    var root = SH.$("[data-sh-cart-shipment]"); if (!root) return;
    var opt = function (k) { return SH.$('[data-sh-cart-option="' + k + '"]', root); };
    if (opt("delivery")) opt("delivery").setAttribute("data-sh-arrives", d.full);
    if (opt("ship")) { opt("ship").setAttribute("data-sh-arrives", d.shipFull); set(".sh-cart-shipment__when", d.shipFull, opt("ship")); }
    if (opt("pickup")) { opt("pickup").setAttribute("data-sh-arrives", d.pickupArr); set(".sh-cart-shipment__when", d.pickupWhen, opt("pickup")); }
    var cw = SH.$('[data-sh-cart="when"]', root);
    if (cw) cw.innerHTML = '<span>' + d.full + '</span>' + (s.p === "live" ? "" : '<span class="thd-cart-mark">' + mark(s, d, false) + '</span>');
    var sel = SH.$(".sh-cart-shipment__option.is-selected", root); if (sel) set('[data-sh-cart="arriving"]', sel.getAttribute("data-sh-arrives"), root);
    var m = SH.$('[data-sh-cart="mark"]', root); if (m) { m.innerHTML = ""; m.hidden = true; }   // chip moved next to the time
  }

  /* ---- Checkout: Shipping + Review ---- */
  // Delivery not selected (Shipping + Review): the chip sits next to its date, only while that date is the fastest slot's
  function whenMarks(root, s, d) {
    var del = SH.$('[data-sh-co-option="delivery"]', root); if (!del) return;
    var host = SH.$(".sh-co-method__when", del) || SH.$('[data-sh-co="when"]', del); if (!host) return;
    var m = SH.$(".thd-co-when-mark", host);
    if (!m) { m = document.createElement("span"); m.className = "thd-co-when-mark"; host.appendChild(m); }
    m.innerHTML = mark(s, d, false);
    m.hidden = s.p === "live" || !d.fast || root.getAttribute("data-thd-fast") === "no";
  }
  function checkout(s, d) {
    SH.$$("[data-sh-co-method]").forEach(function (root) {
      var del = SH.$('[data-sh-co-option="delivery"]', root);
      var slotSel = SH.$(".sh-co-slot.is-selected", root), fastSel = !slotSel || slotSel.classList.contains("is-fastest");
      if (del) { if (fastSel) del.setAttribute("data-sh-arrives", d.full); }
      if (fastSel) set('[data-sh-co="when"]', d.full, root);
      var m = SH.$('[data-sh-co="mark"]', root); if (m) { m.innerHTML = ""; m.hidden = true; }   // no chip by the Delivery title: the time slot carries it
      var days = SH.$$(".sh-co-method__day", root);
      if (days[0]) days[0].textContent = d.day; if (days[1]) days[1].textContent = d.next;
      var blocks = SH.$$(".sh-co-method__dayblock", root), t0 = blocks[0] ? SH.$$(".sh-co-slot", blocks[0]) : [], t1 = blocks[1] ? SH.$$(".sh-co-slot", blocks[1]) : [];
      var dayFull = d.dayFull, nextFull = d.nextFull;
      if (t0[0]) { SH.$("b", t0[0]).textContent = "By " + d.T; t0[0].setAttribute("data-sh-when", d.full); }
      if (t0[1]) { t0[1].setAttribute("data-sh-when", dayFull + " by 12PM"); t0[1].hidden = false; }
      if (t0[2]) t0[2].setAttribute("data-sh-when", dayFull + " by 4PM");
      if (t1[0]) t1[0].setAttribute("data-sh-when", nextFull + " by 12PM");
      badge(SH.$('[data-sh-co="badge"]', root), s, d);
      // Weekend: the first slot is a regular slot, so its check is blue like the others (green only for the 3-Hour / Early AM slot)
      SH.$$(".sh-co-slot.is-fastest .sh-co-slot__check", root).forEach(function (img) {
        if (!img.getAttribute("data-thd-src")) img.setAttribute("data-thd-src", img.getAttribute("src"));
        var src = img.getAttribute("data-thd-src"); img.setAttribute("src", d.fast ? src : src.replace("check-circle.svg", "check-circle-blue.svg"));
      });
      whenMarks(root, s, d);
      var ship = SH.$('[data-sh-co-option="ship"]', root), pick = SH.$('[data-sh-co-option="pickup"]', root);
      if (ship) { ship.setAttribute("data-sh-arrives", d.shipFull); var sw = SH.$(".sh-co-method__when", ship); if (sw) sw.textContent = "- " + d.shipFull; var ss = SH.$(".sh-co-method__sub", ship); if (ss) ss.textContent = d.shipFull; }
      if (pick) {
        pick.setAttribute("data-sh-arrives", d.pickupArr);
        var pw = SH.$(".sh-co-method__when", pick); if (pw && pw.firstChild && pw.firstChild.nodeType === 3) pw.firstChild.nodeValue = "- " + d.pickupWhen + " ";
        var ps = SH.$(".sh-co-method__sub", pick); if (ps) ps.textContent = d.pickupWhen;
      }
    });
    // Checkout (Shipping + Review): "FREE over $500" on its own line, no "Order today." and no parentheses
    SH.$$(".sh-co-method__sub, .sh-co-method__note").forEach(function (el) { if (/FREE over/.test(el.textContent)) el.textContent = el.textContent.replace(/^Order today\.\s*/, "").replace(/^\((FREE over [^)]*)\)$/, "$1"); });
    var items = SH.$('[data-sh-co-items="arriving"]'), delSel = SH.$('[data-sh-co-option="delivery"].is-selected');
    if (items && delSel) items.textContent = delSel.getAttribute("data-sh-arrives");
  }

  /* ---- Banner (sample) ---- */
  function banner(s, d) {
    var b = SH.$(".thd-banner"), hdr = SH.$(".sh-header--signed-in");
    if (s.banner !== "on" || !hdr) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement("aside"); b.className = "sh-root thd-banner"; b.setAttribute("aria-label", "New: 3-Hour Delivery"); hdr.insertAdjacentElement("afterend", b); }
    var line = s.cut === "before" ? "Order by 4PM and get it in as little as 3 hours." : "Order tonight, get it early tomorrow morning.";
    b.innerHTML = '<div class="thd-banner__inner"><img class="thd-banner__icon" src="assets/icons/truck-bolt-04b.svg" alt="" width="57" height="44">' +
      '<p class="thd-banner__text"><b>3-Hour Delivery</b><span>' + line + ' Available in select areas of NJ, NY, PA and TX.</span>' +
      ' <a class="thd-banner__link" href="#" data-thd-banner-cta>Learn more</a></p></div>';
  }

  /* ---- Links carry the state ---- */
  function carry(s) {
    if (SH.$(".thd-launcher")) return;   // launcher links carry their own presets
    var q = query(s);
    SH.$$("a[href]").forEach(function (a) {
      var h = a.getAttribute("href"); if (!/^[\w-]+\.html(\?[^#]*)?(#.*)?$/.test(h)) return;
      a.setAttribute("href", h.replace(/\?[^#]*/, "").replace(/^([\w-]+\.html)/, "$1" + q));
    });
  }

  function apply() {
    var d = data(S), html = document.documentElement;
    ["a", "b", "live"].forEach(function (p) { html.classList.toggle("thd-p-" + p, S.p === p); });
    html.classList.toggle("thd-chip-dark", S.p === "b" && S.chip === "dark");
    html.classList.toggle("thd-cut-weekend", S.cut === "weekend");   // weekend: the first slot looks like any other slot
    KEYS.shape.forEach(function (k) { html.classList.toggle("thd-shape-" + k, S.shape === k); });   // chip shape (time-slot badges keep the pill)
    html.classList.toggle("thd-order-pickup", S.order === "pickup");
    [header, flyout, slotsModal, totalAvail, cards, tooltip, pdp, cart, checkout, banner].forEach(function (fn) { try { fn(S, d); } catch (e) { if (window.console) console.warn("proposals:", fn.name, e); } });
    carry(S);
    panelSync();
  }

  /* ---- Review panel ---- */
  var ROWS = [
    ["cut", "Cutoff", [["before", "Before 4PM"], ["after", "After 4PM"], ["weekend", "Weekend"]]],
    ["t", "Delivery time (sample)", [["short", "2PM"], ["mid", "12PM"], ["long", "11:30AM"]]]
  ];
  var PAGES = [["plp", "PLP"], ["pdp", "PDP"], ["cart", "Cart"], ["shipping", "Shipping"], ["review", "Review"]];
  var panel;
  function buildPanel() {
    panel = document.createElement("aside"); panel.className = "sh-root thd-panel"; panel.setAttribute("aria-label", "3-Hour review controls");
    var collapsed = false; try { collapsed = sessionStorage.getItem("thd-panel") === "min"; } catch (e) {}
    var h = '<div class="thd-panel__head"><b>3-Hour review</b><button type="button" class="thd-panel__min" data-thd-min aria-expanded="' + !collapsed + '">' + (collapsed ? "Show" : "Hide") + "</button></div><div class=\"thd-panel__body\"" + (collapsed ? " hidden" : "") + ">";
    h += '<div class="thd-panel__row thd-panel__row--pages"><span class="thd-panel__k">Page</span><nav class="thd-panel__seg" aria-label="Prototype pages">';
    PAGES.forEach(function (p) { h += '<a href="' + p[0] + '.html" data-thd-page="' + p[0] + '">' + p[1] + "</a>"; });
    h += "</nav></div>";
    ROWS.forEach(function (r) {
      h += '<div class="thd-panel__row" data-thd-row="' + r[0] + '"><span class="thd-panel__k">' + r[1] + '</span><div class="thd-panel__seg" role="group" aria-label="' + r[1] + '">';
      r[2].forEach(function (o) { h += '<button type="button" data-thd-k="' + r[0] + '" data-thd-v="' + o[0] + '">' + o[1] + "</button>"; });
      h += "</div></div>";
    });
    h += "</div>";
    panel.innerHTML = h; document.body.appendChild(panel);
    panel.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-thd-k")) { S[b.getAttribute("data-thd-k")] = b.getAttribute("data-thd-v"); history.replaceState(null, "", location.pathname + query(S) + location.hash); apply(); }
      else if (b.hasAttribute("data-thd-min")) {
        var body = SH.$(".thd-panel__body", panel), show = body.hidden; body.hidden = !show;
        b.textContent = show ? "Hide" : "Show"; b.setAttribute("aria-expanded", String(show));
        try { sessionStorage.setItem("thd-panel", show ? "" : "min"); } catch (err) {}
      }
    });
  }
  function panelSync() {
    if (!panel) return;
    SH.$$("[data-thd-k]", panel).forEach(function (b) { var on = S[b.getAttribute("data-thd-k")] === b.getAttribute("data-thd-v"); b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); });
    SH.$$('[data-thd-k="t"]', panel).forEach(function (b) {
      var v = b.getAttribute("data-thd-v"), locked = S.cut !== "before";   // after 4PM and weekends: always 8AM, other times disabled
      b.textContent = TIMES[S.cut][v];
      b.disabled = locked && v !== "short";
      var on = locked ? v === "short" : S.t === v; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on));
      b.title = b.disabled ? "Early AM is always by 8AM" : "";
    });   // Delivery time buttons show the actual times for the cutoff
    var here = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
    SH.$$("[data-thd-page]", panel).forEach(function (a) { var on = a.getAttribute("data-thd-page") === here; a.classList.toggle("is-on", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  }

  window.THD = { query: function () { return query(S); } };
  SH.onReady(function () {
    var probe = SH.$('img[src*="assets/icons/"]'); if (probe) LIB = probe.getAttribute("src").split("assets/icons/")[0];
    S = read();
    // Checkout opens with no time slot selected (the live site preselects the fastest one).
    SH.$$("[data-sh-co-method] .sh-co-slot.is-selected").forEach(function (b) { b.classList.remove("is-selected"); b.setAttribute("aria-pressed", "false"); });
    if (!SH.$(".thd-launcher")) buildPanel();
    document.addEventListener("sh:checkout-slot", function (e) {
      setTimeout(function () { SH.$$("[data-sh-co-method]").forEach(function (root) { root.setAttribute("data-thd-fast", e.detail && e.detail.fastest ? "yes" : "no"); whenMarks(root, S, data(S)); }); }, 0);
    });
    document.addEventListener("click", function (e) {
      var cta = e.target.closest && e.target.closest("[data-thd-banner-cta]"); if (!cta) return;
      e.preventDefault(); e.stopPropagation(); var t = SH.$("[data-sh-dflyout-open]"); if (t) { window.scrollTo(0, 0); t.click(); }
    }, true);
    apply();
  });
})();
