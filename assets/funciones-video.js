/* Vodwise — vídeos de cada función: sin sonido, en bucle y solo mientras se ven.
   No descargan nada hasta acercarse a la pantalla. Con «reducir movimiento» o ahorro de datos
   no se mueven solos: se queda la imagen y el botón de reproducir del navegador. */
(function () {
  var vids = [].slice.call(document.querySelectorAll('video.fn-vid'));
  if (!vids.length) return;
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) ||
              (navigator.connection && navigator.connection.saveData);
  function poster(v) { if (v.dataset.poster && !v.poster) v.poster = v.dataset.poster; }
  if (still || !('IntersectionObserver' in window)) {
    vids.forEach(function (v) { v.controls = true; });
  }
  if (!('IntersectionObserver' in window)) { vids.forEach(poster); return; }
  // La imagen fija se pide un poco antes de que el vídeo entre en pantalla.
  var near = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { poster(e.target); near.unobserve(e.target); } });
  }, { rootMargin: '300px 0px' });
  vids.forEach(function (v) { near.observe(v); });
  if (still) return;
  var seen = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting && e.intersectionRatio >= 0.4) {
        v.muted = true;
        var p = v.play();
        if (p && p.catch) p.catch(function () { v.controls = true; });
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { threshold: [0, 0.4] });
  vids.forEach(function (v) { seen.observe(v); });
})();
