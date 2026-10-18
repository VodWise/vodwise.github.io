// Lista de acceso anticipado: envía el correo a Brevo sin cookies y muestra el resultado en la página.
(function () {
  // Origen de la visita (enlaces etiquetados de campañas: ?utm_source=…&utm_campaign=…). Sin cookies ni almacenamiento:
  // se lee de la dirección, se pasa a los enlaces internos de la página y se envía con el alta (campo ORIGEN de Brevo).
  var q = new URLSearchParams(location.search);
  var clean = function (v) { return (v || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40); };
  var src = clean(q.get('utm_source')), camp = clean(q.get('utm_campaign')), med = clean(q.get('utm_medium'));
  var origen = src ? [src, med, camp].filter(Boolean).join('/') : '';
  if (origen) {
    var keep = 'utm_source=' + src + (med ? '&utm_medium=' + med : '') + (camp ? '&utm_campaign=' + camp : '');
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (/^(https?:|mailto:|#|\/\/)/i.test(h) || h.indexOf('utm_') !== -1) return;
      var i = h.indexOf('#'), base = i < 0 ? h : h.slice(0, i), hash = i < 0 ? '' : h.slice(i);
      a.setAttribute('href', base + (base.indexOf('?') < 0 ? '?' : '&') + keep + hash);
    });
  }
  var form = document.getElementById('waitlist');
  if (!form || !window.fetch) return;
  var msg = form.querySelector('.wl-msg');
  var btn = form.querySelector('button[type="submit"]');
  if (origen && !form.ORIGEN) {
    var o = document.createElement('input');
    o.type = 'hidden'; o.name = 'ORIGEN'; o.value = origen;
    form.appendChild(o);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (form.email_address_check.value) return; // trampa para bots
    btn.disabled = true;
    msg.className = 'wl-msg';
    msg.textContent = form.dataset.sending;
    fetch(form.action, { method: 'POST', body: new FormData(form), credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        if (!data || data.success !== true) throw new Error('rechazado');
        form.classList.add('done');
        msg.className = 'wl-msg ok';
        msg.textContent = form.dataset.ok;
      })
      .catch(function () {
        btn.disabled = false;
        msg.className = 'wl-msg err';
        msg.textContent = form.dataset.err;
      });
  });
})();
