/* CALL FIRE — comportamiento del sitio.
   Sin dependencias: no hay librerías ni proceso de build. */
(function () {
  'use strict';

  var TELEFONO = '5493364564114';   // WhatsApp en formato internacional, sin signos

  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Menú móvil ───────────────────────────────────────────────────────── */
  var boton = document.getElementById('hamburguesa');
  var nav = document.getElementById('nav');

  if (boton && nav) {
    boton.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('abierto');
        boton.setAttribute('aria-expanded', 'false');
        boton.setAttribute('aria-label', 'Abrir menú');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('abierto')) {
        nav.classList.remove('abierto');
        boton.setAttribute('aria-expanded', 'false');
        boton.focus();
      }
    });
  }

  /* ── La cabecera se vuelve sólida al bajar ────────────────────────────── */
  var cabecera = document.getElementById('cabecera');
  if (cabecera) {
    var marcarCabecera = function () {
      cabecera.classList.toggle('pegada', window.scrollY > 24);
    };
    marcarCabecera();
    window.addEventListener('scroll', marcarCabecera, { passive: true });
  }

  /* ── Animaciones de entrada ───────────────────────────────────────────── */
  /* Las variantes y sus tiempos están en styles.css, en el bloque
     "animaciones de entrada". Acá solo se reparten y se disparan. */

  // Un contenedor con data-anim-hijos le pasa la variante a cada hijo.
  document.querySelectorAll('[data-anim-hijos]').forEach(function (grupo) {
    var variante = grupo.getAttribute('data-anim-hijos');
    [].forEach.call(grupo.children, function (hijo) {
      if (!hijo.hasAttribute('data-anim')) hijo.setAttribute('data-anim', variante);
    });
  });

  var revelar = function (el, retardo) {
    if (!quieto && retardo) el.style.transitionDelay = retardo + 'ms';
    el.classList.add('visible');
  };

  // La portada entra sola apenas carga, escalonada.
  var enPortada = document.querySelectorAll('.hero [data-anim]');
  enPortada.forEach(function (el, i) { revelar(el, 140 + i * 130); });
  window.setTimeout(function () {
    enPortada.forEach(function (el) { el.style.transitionDelay = ''; });
  }, 1600);

  // El resto aparece al entrar en pantalla.
  var porRevelar = [].filter.call(
    document.querySelectorAll('[data-anim]'),
    function (el) { return !el.closest('.hero'); }
  );

  if (quieto || !('IntersectionObserver' in window)) {
    porRevelar.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var observador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;

        // Los hermanos del mismo grupo entran uno detrás del otro.
        var hermanos = el.parentElement
          ? [].filter.call(el.parentElement.children, function (n) {
              return n.hasAttribute('data-anim');
            })
          : [];
        var i = hermanos.indexOf(el);
        revelar(el, i > 0 ? Math.min(i * 100, 400) : 0);
        obs.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    porRevelar.forEach(function (el) { observador.observe(el); });
  }

  /* ── Resaltar en el menú la sección que se está viendo ────────────────── */
  var secciones = document.querySelectorAll('main section[id]');
  var enlaces = {};
  if (nav) {
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      enlaces[a.getAttribute('href').slice(1)] = a;
    });
  }

  if (secciones.length && 'IntersectionObserver' in window) {
    var espia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        var enlace = enlaces[entrada.target.id];
        if (enlace) enlace.classList.toggle('activo', entrada.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(function (s) { espia.observe(s); });
  }

  /* ── Formulario: arma el mensaje y lo abre en WhatsApp ────────────────── */
  /* El sitio es estático (sin servidor), así que el formulario no "envía" nada
     por su cuenta: compone el texto y abre WhatsApp con el mensaje ya escrito.
     Para recibirlo por correo, reemplazar este bloque por Formspree o similar. */
  var formulario = document.getElementById('formulario');
  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(formulario);
      var empresa = (d.get('empresa') || '').trim();

      var lineas = [
        'Hola CALL FIRE, quiero hacer una consulta.',
        '',
        'Nombre: ' + (d.get('nombre') || '').trim()
      ];
      if (empresa) lineas.push('Empresa: ' + empresa);
      lineas.push('Interés: ' + d.get('interes'));
      lineas.push('');
      lineas.push((d.get('mensaje') || '').trim());

      window.open('https://wa.me/' + TELEFONO + '?text=' +
                  encodeURIComponent(lineas.join('\n')), '_blank', 'noopener');
    });
  }

  /* ── Año del pie ──────────────────────────────────────────────────────── */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
