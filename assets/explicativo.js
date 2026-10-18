/* Vodwise — vídeo explicativo de la portada. No carga nada de YouTube hasta que se pulsa (sin cookies al entrar). */
(function () {
  var btn = document.querySelector('.ex-play');
  if (!btn) return;
  var id = btn.getAttribute('data-video');
  if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) return; // sin vídeo publicado aún: se queda el cartel
  btn.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
    f.title = 'Qué es Vodwise';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    btn.replaceWith(f);
  });
})();
