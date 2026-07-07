(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var SERVICES = CFG.services || [];
  var HOURS = CFG.businessHours || { startMin: 540, endMin: 1140, satEndMin: 1020 };
  var isTouch = window.matchMedia('(pointer: coarse)').matches;

  // ============================================================
  // Transición de carga de página
  // ============================================================
  document.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });
  });

  // ============================================================
  // EmailJS init (si hay Public Key configurada)
  // ============================================================
  var emailjsReady = false;
  if (window.emailjs && CFG.emailjs && CFG.emailjs.publicKey) {
    try {
      emailjs.init({ publicKey: CFG.emailjs.publicKey });
      emailjsReady = true;
    } catch (err) {
      console.warn('EmailJS no se pudo inicializar:', err);
    }
  }

  // ============================================================
  // Header: sombra + barra de progreso de scroll
  // ============================================================
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    var progressBar = document.getElementById('scroll-progress');
    if (!header || !progressBar) return;

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================================
  // Menú móvil
  // ============================================================
  function initMobileMenu() {
    var menuToggle = document.getElementById('menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    if (!menuToggle || !mobileMenu) return;
    var menuOpen = false;

    function setMenu(open) {
      menuOpen = open;
      menuToggle.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    menuToggle.addEventListener('click', function () { setMenu(!menuOpen); });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) { setMenu(false); menuToggle.focus(); }
    });
  }

  // ============================================================
  // Revelado al hacer scroll (con efecto escalonado por grupo)
  // ============================================================
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    els.forEach(function (el) {
      var parent = el.parentElement;
      var siblings = Array.prototype.filter.call(parent.children, function (c) {
        return c.classList.contains('reveal');
      });
      var idx = siblings.indexOf(el);
      el.style.setProperty('--d', Math.min(idx * 90, 360) + 'ms');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { observer.observe(el); });
  }

  // ============================================================
  // Contadores animados
  // ============================================================
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('es-CO') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { observer.observe(el); });
  }

  // ============================================================
  // Tilt 3D (tarjetas / foto que siguen el cursor)
  // ============================================================
  function initTilt() {
    if (isTouch) return;
    var els = document.querySelectorAll('.tilt');
    if (!els.length) return;

    els.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add('is-tilting');
        el.style.transform = 'perspective(700px) rotateX(' + (py * -7) + 'deg) rotateY(' + (px * 7) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () {
        el.classList.remove('is-tilting');
        el.style.transform = '';
      });
    });
  }

  // ============================================================
  // Parallax del hero (los blobs siguen el cursor)
  // ============================================================
  function initHeroParallax() {
    if (isTouch) return;
    var hero = document.querySelector('.hero');
    var wrap = document.querySelector('.hero__blob-wrap');
    if (!hero || !wrap) return;

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      wrap.style.transform = 'translate(' + (px * 34) + 'px, ' + (py * 34) + 'px)';
    });
    hero.addEventListener('mouseleave', function () { wrap.style.transform = ''; });
  }

  // ============================================================
  // Botones magnéticos (siguen levemente el cursor)
  // ============================================================
  function initMagnetic() {
    if (isTouch) return;
    var els = document.querySelectorAll('.magnetic');
    if (!els.length) return;
    els.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.25) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  // ============================================================
  // Mascota interactiva (avatar animado de Kimberly)
  // ============================================================
  function initMascot() {
    var toggle = document.getElementById('mascot-toggle');
    var bubble = document.getElementById('mascot-bubble');
    var closeBtn = document.getElementById('mascot-close');
    var avatar = document.getElementById('mascot-avatar');
    if (!toggle || !bubble) return;

    var open = false;
    function setOpen(v) {
      open = v;
      bubble.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        var firstLink = bubble.querySelector('a, button');
        if (firstLink) firstLink.focus({ preventScroll: true });
      }
    }
    toggle.addEventListener('click', function () { setOpen(!open); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); toggle.focus(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (open && !bubble.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    // Saludo periódico: cada tanto agita la mano para llamar la atención,
    // incluso sin que nadie interactúe con ella.
    if (avatar && !isTouch) {
      setInterval(function () {
        if (open) return;
        avatar.classList.add('is-waving');
        setTimeout(function () { avatar.classList.remove('is-waving'); }, 700);
      }, 9000);
    }
  }

  // ============================================================
  // Antes / Después — slider comparador
  // ============================================================
  function initBeforeAfter() {
    var sliders = document.querySelectorAll('.ba-slider');
    if (!sliders.length) return;
    sliders.forEach(function (slider) {
      var range = slider.querySelector('.ba-slider__range');
      var after = slider.querySelector('.ba-slider__after');
      var handle = slider.querySelector('.ba-slider__handle');
      function update() {
        var val = range.value + '%';
        after.style.width = val;
        handle.style.left = val;
      }
      range.addEventListener('input', update);
      update();
    });
  }

  // ============================================================
  // Testimonios — carrusel
  // ============================================================
  function initTestimonials() {
    var testiTrack = document.getElementById('testi-track');
    var testiDotsWrap = document.getElementById('testi-dots');
    var testiPrev = document.getElementById('testi-prev');
    var testiNext = document.getElementById('testi-next');
    if (!testiTrack || !testiDotsWrap) return;

    var slides = Array.from(testiTrack.children);
    if (!slides.length) return;
    var testiIndex = 0;
    var testiTimer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testi-dot';
      dot.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
      dot.addEventListener('click', function () { goToTesti(i); restart(); });
      testiDotsWrap.appendChild(dot);
    });
    var testiDots = Array.from(testiDotsWrap.children);

    function goToTesti(i) {
      testiIndex = (i + slides.length) % slides.length;
      testiTrack.style.transform = 'translateX(-' + (testiIndex * 100) + '%)';
      testiDots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === testiIndex); });
    }
    function startAutoplay() { stopAutoplay(); testiTimer = setInterval(function () { goToTesti(testiIndex + 1); }, 5500); }
    function stopAutoplay() { if (testiTimer) clearInterval(testiTimer); }
    function restart() { stopAutoplay(); startAutoplay(); }

    goToTesti(0);
    startAutoplay();
    if (testiPrev) testiPrev.addEventListener('click', function () { goToTesti(testiIndex - 1); restart(); });
    if (testiNext) testiNext.addEventListener('click', function () { goToTesti(testiIndex + 1); restart(); });
    testiTrack.parentElement.addEventListener('mouseenter', stopAutoplay);
    testiTrack.parentElement.addEventListener('mouseleave', startAutoplay);

    var touchStartX = null;
    testiTrack.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    testiTrack.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { goToTesti(testiIndex + (dx < 0 ? 1 : -1)); restart(); }
      touchStartX = null;
    });
  }

  // ============================================================
  // Back to top + año del footer
  // ============================================================
  function initBackToTop() {
    var backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
  function initFooterYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Pequeña ráfaga de "confeti" en los colores de marca, al confirmar la cita
  function burstConfetti(container) {
    if (!container) return;
    var wrap = document.createElement('div');
    wrap.className = 'confetti-wrap';
    container.appendChild(wrap);
    var colors = ['#E271A8', '#F3A8D1', '#DB8CB4', '#B33E79'];
    for (var i = 0; i < 16; i++) {
      var dot = document.createElement('span');
      dot.className = 'confetti-dot';
      var angle = Math.random() * Math.PI * 2;
      var dist = 60 + Math.random() * 70;
      dot.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      dot.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      dot.style.setProperty('--rot', Math.random() * 360 + 'deg');
      dot.style.background = colors[i % colors.length];
      dot.style.animationDelay = Math.random() * 120 + 'ms';
      wrap.appendChild(dot);
    }
    setTimeout(function () { wrap.remove(); }, 1300);
  }

  // =========================================================
  // ===================  MÓDULO DE AGENDA  ==================
  // =========================================================
  function initBooking() {
    var form = document.getElementById('booking-form');
    var track = document.getElementById('agenda-track');
    if (!form || !track) return;

    var state = { service: null, weekOffset: 0, date: null, time: null };

    function formatDuration(min) {
      if (min < 60) return min + ' min';
      var h = Math.floor(min / 60), m = min % 60;
      return h + 'h' + (m ? ' ' + m + 'm' : '');
    }
    function formatDateLong(d) {
      return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    // ---- Tarjetas de servicio seleccionables ----
    var serviceList = document.getElementById('service-list');
    var toStep2Btn = document.getElementById('to-step-2');

    function renderServiceList() {
      serviceList.innerHTML = '';
      SERVICES.forEach(function (svc) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'service-list-item';
        card.setAttribute('aria-pressed', 'false');
        card.setAttribute('data-id', svc.id);
        card.innerHTML =
          '<h4>' + svc.name + '</h4>' +
          '<p>' + svc.desc + '</p>' +
          '<span class="badge">' + formatDuration(svc.duration) + '</span>';
        card.addEventListener('click', function () { selectService(svc, card); });
        serviceList.appendChild(card);
      });
    }
    function selectService(svc, cardEl) {
      state.service = svc;
      serviceList.querySelectorAll('.service-list-item').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      var target = cardEl || serviceList.querySelector('[data-id="' + svc.id + '"]');
      if (target) target.setAttribute('aria-pressed', 'true');
      toStep2Btn.disabled = false;
    }
    renderServiceList();

    // Preselección al llegar desde Servicios (agenda.html?servicio=alisado)
    var params = new URLSearchParams(window.location.search);
    var preId = params.get('servicio');
    if (preId) {
      var pre = SERVICES.find(function (s) { return s.id === preId; });
      if (pre) selectService(pre, null);
    }

    // ---- Riel deslizante del stepper ----
    function goToStep(n) {
      track.style.transform = 'translateX(-' + (n - 1) * 100 + '%)';
      for (var i = 1; i <= 3; i++) {
        var dot = document.getElementById('dot-' + i);
        if (dot) dot.classList.toggle('is-active', i <= Math.min(n, 3));
      }
      var line1 = document.getElementById('line-1');
      var line2 = document.getElementById('line-2');
      if (line1) line1.classList.toggle('is-filled', n >= 2);
      if (line2) line2.classList.toggle('is-filled', n >= 3);
      if (n === 2) renderCalendar();
    }
    document.getElementById('to-step-2').addEventListener('click', function () { goToStep(2); });
    document.getElementById('to-step-1').addEventListener('click', function () { goToStep(1); });
    document.getElementById('to-step-2-back').addEventListener('click', function () { goToStep(2); });
    document.getElementById('to-step-3').addEventListener('click', function () {
      document.getElementById('summary-service').textContent = state.service.name;
      document.getElementById('summary-date').textContent = formatDateLong(state.date);
      document.getElementById('summary-time').textContent = state.time;
      goToStep(3);
    });

    // ---- Calendario ----
    var calGrid = document.getElementById('cal-grid');
    var calLabel = document.getElementById('cal-label');
    var timeWrap = document.getElementById('time-wrap');
    var timeList = document.getElementById('time-list');
    var toStep3Btn = document.getElementById('to-step-3');
    var MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

    function startOfWeek(offset) {
      var d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + offset * 7 - d.getDay());
      return d;
    }

    function renderCalendar() {
      calGrid.innerHTML = '';
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var weekStart = startOfWeek(state.weekOffset);
      calLabel.textContent = MONTHS[weekStart.getMonth()] + ' ' + weekStart.getFullYear();

      for (var i = 0; i < 7; i++) {
        var d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day';
        btn.textContent = d.getDate();
        btn.setAttribute('aria-pressed', 'false');
        var isPast = d < today;
        var isSunday = d.getDay() === 0;
        if (isPast || isSunday) {
          btn.disabled = true;
        } else {
          btn.addEventListener('click', (function (day) {
            return function () {
              state.date = day;
              state.time = null;
              toStep3Btn.disabled = true;
              calGrid.querySelectorAll('.cal-day').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
              btn.setAttribute('aria-pressed', 'true');
              renderTimesWithSkeleton(day);
            };
          })(d));
        }
        calGrid.appendChild(btn);
      }
    }
    document.getElementById('cal-prev').addEventListener('click', function () { state.weekOffset--; renderCalendar(); });
    document.getElementById('cal-next').addEventListener('click', function () { state.weekOffset++; renderCalendar(); });

    function seededOccupied(dateStr, minutes) {
      var str = dateStr + '-' + minutes;
      var hash = 0;
      for (var i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
      return hash % 5 === 0;
    }

    // Simula una breve consulta de disponibilidad (skeleton) antes de mostrar
    // los horarios reales — sensación de sistema en vivo, sin backend real.
    function renderTimesWithSkeleton(day) {
      timeWrap.classList.remove('is-hidden');
      timeList.innerHTML = '<div class="skeleton-row">' +
        '<span class="skeleton-chip"></span><span class="skeleton-chip"></span>' +
        '<span class="skeleton-chip"></span><span class="skeleton-chip"></span>' +
        '</div>';
      setTimeout(function () { renderTimes(day); }, 420);
    }

    function renderTimes(day) {
      timeList.innerHTML = '';
      var duration = state.service.duration;
      var isSat = day.getDay() === 6;
      var end = isSat ? HOURS.satEndMin : HOURS.endMin;
      var now = new Date();
      var isToday = day.toDateString() === now.toDateString();
      var nowMinutes = now.getHours() * 60 + now.getMinutes();
      var dateStr = day.toISOString().slice(0, 10);
      var any = false;

      for (var m = HOURS.startMin; m + duration <= end; m += 30) {
        if (isToday && m <= nowMinutes) continue;
        any = true;
        var hh = Math.floor(m / 60), mm = m % 60;
        var label = (hh % 12 === 0 ? 12 : hh % 12) + ':' + String(mm).padStart(2, '0') + (hh < 12 ? 'am' : 'pm');
        var occupied = seededOccupied(dateStr, m);

        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'time-chip';
        chip.textContent = label;
        chip.setAttribute('aria-pressed', 'false');
        if (occupied) {
          chip.disabled = true;
        } else {
          chip.addEventListener('click', (function (lbl, btnEl) {
            return function () {
              state.time = lbl;
              timeList.querySelectorAll('.time-chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
              btnEl.setAttribute('aria-pressed', 'true');
              toStep3Btn.disabled = false;
            };
          })(label, chip));
        }
        timeList.appendChild(chip);
      }
      if (!any) {
        timeList.innerHTML = '<p style="color:var(--color-ink-soft);font-size:.9rem;">No hay horarios disponibles este día. Prueba otra fecha.</p>';
      }
    }

    // ---- Validación del formulario ----
    var submitBtn = document.getElementById('submit-btn');
    var serverErrorEl = document.getElementById('form-server-error');
    var validators = {
      'f-name': function (v) { return v.trim().length > 1; },
      'f-email': function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
      'f-phone': function (v) { return /^[0-9]{7,10}$/.test(v.replace(/\D/g, '')); },
    };
    Object.keys(validators).forEach(function (id) {
      document.getElementById(id).addEventListener('blur', function () { validateField(id); });
    });
    function validateField(id) {
      var input = document.getElementById(id);
      var errorEl = document.querySelector('.field-error[data-for="' + id + '"]');
      var valid = validators[id](input.value);
      errorEl.classList.toggle('is-visible', !valid);
      input.classList.toggle('is-invalid', !valid);
      return valid;
    }

    function buildBookingMessage(datos) {
      return 'Nueva solicitud de cita — Centro de Alisados\n' +
        'Servicio: ' + state.service.name + '\n' +
        'Fecha: ' + formatDateLong(state.date) + '\n' +
        'Hora: ' + state.time + '\n' +
        'Cliente: ' + datos.name + '\n' +
        'Teléfono: ' + datos.phone + '\n' +
        'Correo: ' + datos.email;
    }
    function buildWhatsAppUrl(datos) {
      return 'https://wa.me/' + CFG.whatsappNumber + '?text=' + encodeURIComponent(buildBookingMessage(datos));
    }
    function buildMailtoUrl(datos) {
      var subject = 'Nueva solicitud de cita — ' + datos.name;
      return 'mailto:' + CFG.ownerEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(buildBookingMessage(datos));
    }

    function sendEmails(datos) {
      if (!emailjsReady) return Promise.resolve({ sent: false });
      var fecha = formatDateLong(state.date);
      var baseParams = {
        cliente_nombre: datos.name,
        cliente_email: datos.email,
        cliente_telefono: datos.phone,
        servicio: state.service.name,
        fecha: fecha,
        hora: state.time,
        negocio: 'Kimberly Vásquez – Centro de Alisados',
        owner_email: CFG.ownerEmail,
      };
      var envios = [];
      if (CFG.emailjs.templateCliente) envios.push(emailjs.send(CFG.emailjs.serviceId, CFG.emailjs.templateCliente, baseParams));
      if (CFG.emailjs.templateDueno) envios.push(emailjs.send(CFG.emailjs.serviceId, CFG.emailjs.templateDueno, baseParams));
      return Promise.allSettled(envios).then(function (results) {
        return { sent: results.some(function (r) { return r.status === 'fulfilled'; }) };
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ids = Object.keys(validators);
      var allValid = ids.map(validateField).every(Boolean);
      if (!allValid) return;

      var datos = {
        name: document.getElementById('f-name').value.trim(),
        email: document.getElementById('f-email').value.trim(),
        phone: document.getElementById('f-phone').value.trim(),
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';
      serverErrorEl.classList.add('is-hidden');

      // Automatización WhatsApp: se abre YA, síncrono dentro del clic del
      // usuario (si se espera a EmailJS, el navegador bloquea la ventana).
      var waUrl = buildWhatsAppUrl(datos);
      window.open(waUrl, '_blank', 'noopener');

      // Botones de respaldo en la pantalla de confirmación — garantizan que
      // la notificación llegue aunque el pop-up se haya bloqueado o el
      // cliente prefiera reenviarla manualmente.
      var waBtn = document.getElementById('notify-whatsapp-btn');
      var mailBtn = document.getElementById('notify-email-btn');
      if (waBtn) waBtn.href = waUrl;
      if (mailBtn) mailBtn.href = buildMailtoUrl(datos);

      var confirmMsg = document.getElementById('confirm-message');
      goToStep(4);
      burstConfetti(document.getElementById('step-confirm'));
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirmar cita';

      sendEmails(datos)
        .catch(function () { return { sent: false }; })
        .then(function (result) {
          confirmMsg.textContent = result.sent
            ? 'Te escribimos la confirmación a tu correo. Además, le avisamos a Kimberly al instante por WhatsApp.'
            : 'Le avisamos a Kimberly al instante por WhatsApp con todos los datos de tu cita. Si quieres, también puedes confirmarle por correo con el botón de abajo.';
        });
    });

    document.getElementById('restart-booking').addEventListener('click', function () {
      state = { service: null, weekOffset: 0, date: null, time: null };
      serviceList.querySelectorAll('.service-list-item').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      toStep2Btn.disabled = true;
      toStep3Btn.disabled = true;
      timeWrap.classList.add('is-hidden');
      form.reset();
      document.querySelectorAll('.field-error').forEach(function (el) { el.classList.remove('is-visible'); });
      document.querySelectorAll('.field input').forEach(function (el) { el.classList.remove('is-invalid'); });
      goToStep(1);
    });
  }

  // =========================================================
  // Arranque
  // =========================================================
  initHeaderScroll();
  initMobileMenu();
  initReveal();
  initCounters();
  initTilt();
  initHeroParallax();
  initMagnetic();
  initMascot();
  initBeforeAfter();
  initTestimonials();
  initBackToTop();
  initFooterYear();
  initBooking();

})();
