/* Logo 3D decorativo (0063). Solo en escritorio y sin «reducir movimiento»: en móvil o quieto se ve el póster y no se descarga el vídeo.
   WebM VP9 con transparencia; en Safari (o si no reproduce VP9) usa el MP4, que va sobre fondo oscuro y se funde con mix-blend-mode. */
(()=>{const quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;const ligero=matchMedia('(max-width:700px)').matches;
if(quieto||ligero||!('IntersectionObserver' in window))return;
const ua=navigator.userAgent;const safari=/Safari\//.test(ua)&&!/Chrome\/|Chromium\/|Edg\//.test(ua);
const vs=[...document.querySelectorAll('video.v3d')];
const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.src){const webm=!safari&&v.canPlayType('video/webm; codecs="vp9"');if(!webm&&v.dataset.mp4){v.classList.add('mp4');v.src=v.dataset.mp4;}else v.src=v.dataset.src;}const p=v.play();if(p&&p.catch)p.catch(()=>{});}else v.pause();}),{rootMargin:'200px'});
vs.forEach(v=>io.observe(v));})();
