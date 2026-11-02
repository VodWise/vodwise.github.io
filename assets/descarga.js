// Página de descarga (encargo 0079): si hoy quedan plazas, el botón de descarga; si el tope de cuentas nuevas del día
// está lleno (o las altas están cerradas), el aviso de volver mañana con «Avisarme por correo» (la lista de siempre,
// waitlist.js). Lo decide el servidor: GET https://cloud.vodwise.com/v1/signups (Vodwise cloud/src/signups.js), que
// solo contesta a vodwise.com. Hasta que contesta, la página no promete plazas; si falla, tarda más de 5 s o contesta
// algo raro, se queda la descarga sin decir que quedan plazas: el tope se aplica igualmente al crear la cuenta.
(function () {
  var ok = document.getElementById('dl-ok');
  var full = document.getElementById('dl-full');
  var extra = document.getElementById('dl-full-extra');
  if (!ok || !full) return;
  var note = document.getElementById('dl-note');
  var base = note ? note.textContent : '';

  // El instalador público aún no tiene dirección: hasta que se rellene data-instalador, el botón queda apagado.
  var btn = document.getElementById('dl-btn');
  var ready = false;
  if (btn) {
    var file = btn.getAttribute('data-instalador');
    if (file) { btn.href = file; ready = true; }
    else {
      btn.setAttribute('aria-disabled', 'true');
      btn.addEventListener('click', function (e) { e.preventDefault(); });
    }
  }
  function setNote(extraText) { if (note) note.textContent = extraText ? base + ' · ' + extraText : base; }
  if (!ready) setNote(note && note.getAttribute('data-pronto'));

  function show(reason, spotsLeft) {
    var closed = reason === 'closed';
    ok.hidden = !!reason;
    full.hidden = !reason;
    if (extra) extra.hidden = !reason;
    var parts = full.querySelectorAll('[data-motivo]');
    for (var i = 0; i < parts.length; i++) parts[i].hidden = (parts[i].getAttribute('data-motivo') === 'closed') !== closed;
    if (ready) setNote(spotsLeft ? note && note.getAttribute('data-plazas') : '');
  }

  // Sin instalador público (antes del día D) no se consultan plazas: botón apagado y, debajo, solo «¿Prefieres que te
  // avisemos?» con la lista de aviso por correo (como sin JavaScript), para que nadie se quede sin poder apuntarse.
  if (!ready) {
    full.hidden = false;
    var sueltos = full.querySelectorAll('[data-motivo], .dl-tag');
    for (var j = 0; j < sueltos.length; j++) sueltos[j].hidden = true;
    full.style.marginTop = '18px';
    return;
  }

  // Solo en el ordenador (localhost), para ver los estados: ?cupo=lleno | ?cupo=cerrado | ?cupo=libre.
  var m = /[?&]cupo=(lleno|cerrado|libre)\b/.exec(location.search);
  if (m && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    show(m[1] === 'libre' ? null : m[1] === 'cerrado' ? 'closed' : 'full', m[1] === 'libre');
    return;
  }
  // Quien llega desde el aviso de la app (descargar#waitlist) ve el formulario mientras contesta el servidor.
  if (location.hash === '#waitlist') show('full');
  if (!window.fetch) return;

  var ctl = typeof AbortController === 'function' ? new AbortController() : null;
  var timer = setTimeout(function () { if (ctl) ctl.abort(); unknown(); }, 5000);
  var done = false;
  function unknown() { if (done) return; done = true; show(null, false); }
  fetch('https://cloud.vodwise.com/v1/signups', ctl ? { credentials: 'omit', signal: ctl.signal } : { credentials: 'omit' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (s) {
      if (done) return;
      clearTimeout(timer);
      if (s && typeof s === 'object' && s.open === false && (s.reason === 'full' || s.reason === 'closed')) { done = true; show(s.reason, false); }
      else if (s && typeof s === 'object' && s.open === true) { done = true; show(null, true); }
      else unknown();
    }, function () { clearTimeout(timer); unknown(); });
})();
