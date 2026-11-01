// Página de descarga (encargo 0079): si hoy quedan plazas, el botón de descarga; si el tope de cuentas nuevas del día
// está lleno (o las altas están cerradas), el aviso de volver mañana con «Avisarme por correo» (la lista de siempre,
// waitlist.js). Lo decide el servidor: GET https://cloud.vodwise.com/v1/signups (Vodwise cloud/src/signups.js), que
// solo contesta a vodwise.com. Si no contesta, se queda el botón: el tope se aplica igualmente al crear la cuenta.
(function () {
  var ok = document.getElementById('dl-ok');
  var full = document.getElementById('dl-full');
  var extra = document.getElementById('dl-full-extra');
  if (!ok || !full) return;

  // El instalador público aún no tiene dirección: hasta que se rellene data-instalador, el botón no lleva a ningún sitio.
  var btn = document.getElementById('dl-btn');
  if (btn) {
    var file = btn.getAttribute('data-instalador');
    if (file) btn.href = file;
    else {
      btn.setAttribute('aria-disabled', 'true');
      btn.addEventListener('click', function (e) { e.preventDefault(); });
    }
  }

  function show(reason) {
    var closed = reason === 'closed';
    ok.hidden = !!reason;
    full.hidden = !reason;
    if (extra) extra.hidden = !reason;
    var parts = full.querySelectorAll('[data-motivo]');
    for (var i = 0; i < parts.length; i++) parts[i].hidden = (parts[i].getAttribute('data-motivo') === 'closed') !== closed;
  }

  // Solo en el ordenador (localhost), para ver los estados: ?cupo=lleno | ?cupo=cerrado | ?cupo=libre.
  var m = /[?&]cupo=(lleno|cerrado|libre)\b/.exec(location.search);
  if (m && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    show(m[1] === 'libre' ? null : m[1] === 'cerrado' ? 'closed' : 'full');
    return;
  }
  // Quien llega desde el aviso de la app (descargar#waitlist) ve el formulario mientras contesta el servidor.
  if (location.hash === '#waitlist') show('full');
  if (!window.fetch) return;
  fetch('https://cloud.vodwise.com/v1/signups', { credentials: 'omit' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (s) {
      if (s && s.open === false) show(s.reason === 'closed' ? 'closed' : 'full');
      else if (s && s.open === true) show(null);
    })
    .catch(function () {});
})();
