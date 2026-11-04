// Desvío de páginas movidas: va al destino de data-destino (solo rutas de esta web) conservando el #.
(() => {
  const d = document.currentScript && document.currentScript.dataset.destino;
  if (d && d.startsWith('/') && !d.startsWith('//')) location.replace(d + location.hash);
})();
