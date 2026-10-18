/* Vodwise — vídeo de presentación de la portada. Alojado en la web: no descarga nada hasta que se pulsa y nunca suena solo. */
(function () {
  var v = document.querySelector('.ex-video'), btn = document.querySelector('.ex-play');
  if (!v || !btn) return;
  btn.hidden = false; // con JS, botón grande encima del cartel; sin JS quedan los controles del navegador
  v.controls = false;
  btn.addEventListener('click', function () {
    btn.hidden = true;
    v.controls = true;
    v.play();
    v.focus();
  });
})();
