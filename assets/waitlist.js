// Lista de acceso anticipado: envía el correo a Brevo sin cookies y muestra el resultado en la página.
(function () {
  var form = document.getElementById('waitlist');
  if (!form || !window.fetch) return;
  var msg = form.querySelector('.wl-msg');
  var btn = form.querySelector('button[type="submit"]');
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
