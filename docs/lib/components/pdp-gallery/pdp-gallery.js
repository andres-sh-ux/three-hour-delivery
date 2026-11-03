/* pdp-gallery · thumbnails, dots and swipe share one scroll-snap track.
   Prototype code: review and test before using anywhere near production. */
(function () {
  "use strict";
  function bind(root) {
    var track = SH.$("[data-sh-gal-track]", root);
    var thumbs = SH.$$(".sh-pdp-gallery__thumb", root), dots = SH.$$(".sh-pdp-gallery__dots button", root);
    function mark(i) {
      thumbs.forEach(function (t, k) { t.classList.toggle("is-active", k === i); if (k === i) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current"); });
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === i); });
    }
    function go(i) {
      track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
      mark(i);
    }
    SH.$$("[data-sh-gal-go]", root).forEach(function (b) {
      b.addEventListener("click", function () { go(Number(b.getAttribute("data-sh-gal-go"))); });
    });
    var t;
    track.addEventListener("scroll", function () {
      clearTimeout(t);
      t = setTimeout(function () { mark(Math.round(track.scrollLeft / track.clientWidth)); }, 60);
    });
    window.addEventListener("resize", function () {
      var i = thumbs.findIndex(function (x) { return x.classList.contains("is-active"); });
      track.scrollLeft = Math.max(0, i) * track.clientWidth;
    });
  }
  SH.onReady(function () { SH.$$("[data-sh-pdp-gallery]").forEach(bind); });
})();
