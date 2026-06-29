/* ============================================================
   scripts.js — QNetSys
   Módulos:
   1. Navbar — sombra al hacer scroll
   2. Menú móvil — toggle y cierre
   3. Scroll Reveal — IntersectionObserver
   4. Contadores animados
   5. Modal de servicios — datos + apertura/cierre
   6. Formulario Web3Forms
   7. Año en el footer
   ============================================================ */


/* ── 1. NAVBAR ────────────────────────────────────────────── */
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('nav-scrolled', window.scrollY > 20);
  }, { passive: true });
})();


/* ── 2. MENÚ MÓVIL ────────────────────────────────────────── */
function toggleMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
}

(function () {
  var menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.add('hidden');
    });
  });
})();


/* ── 3. SCROLL REVEAL ─────────────────────────────────────── */
(function () {
  var els = document.querySelectorAll('.scroll-reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el) { io.observe(el); });
})();


/* ── 4. CONTADORES ANIMADOS ───────────────────────────────── */
(function () {
  var counters = document.querySelectorAll('.counter-value');
  if (!counters.length) return;

  function animate(el) {
    var target   = parseInt(el.dataset.target, 10);
    var suffix   = el.dataset.suffix || '';
    var duration = 1800;
    var start    = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var e = 1 - Math.pow(1 - p, 3);          /* ease-out cubic */
      el.textContent = Math.floor(e * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (el) {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { io.observe(el); });
})();


/* ── 5. MODAL DE SERVICIOS ────────────────────────────────── */
var serviceData = {
  cctv: {
    title: 'CCTV & Video Vigilancia',
    color: 'bg-cyan-500/10 text-cyan-400',
    icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>',
    description: 'Sistemas de videovigilancia profesional con cámaras IP 4K/8K, análisis por IA, almacenamiento cloud o local y alertas en tiempo real.',
    features: ['Cámaras IP 4K/8K con visión nocturna','Detección de personas y vehículos por IA','Grabación en nube y NVR local redundante','Alertas por app o email en tiempo real','Integración con control de acceso','Hasta 256 cámaras por servidor']
  },
  access: {
    title: 'Control de Acceso',
    color: 'bg-indigo-500/10 text-indigo-400',
    icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
    description: 'Biometría facial, huella dactilar, tarjetas RFID y lectores QR. Gestión centralizada con registro de eventos en tiempo real.',
    features: ['Reconocimiento facial y huella dactilar','Tarjetas inteligentes RFID / NFC','Torniquetes, barreras y puertas automáticas','Integración con RRHH y ERP','Reportes de asistencia y auditoría','Gestión remota vía app móvil']
  },
  iot: {
    title: 'Integración IoT',
    color: 'bg-emerald-500/10 text-emerald-400',
    icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>',
    description: 'Conectamos sensores, actuadores y dispositivos en una red unificada. Desde temperatura y humo hasta iluminación y HVAC automatizados.',
    features: ['Protocolos MQTT, Modbus, BACnet, Zigbee','Edge computing para procesamiento local','Dashboards personalizados en tiempo real','Automatización de procesos y alertas','Integración con AWS / Azure','De 10 a 10.000+ dispositivos']
  },
  cyber: {
    title: 'Ciberseguridad',
    color: 'bg-purple-500/10 text-purple-400',
    icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 8"/></svg>',
    description: 'Protección integral de redes y sistemas críticos con firewall NGFW, cifrado end-to-end y monitoreo continuo de amenazas.',
    features: ['Firewall NGFW e IDS/IPS','Cifrado end-to-end en tránsito y en reposo','SIEM y monitoreo de amenazas 24/7','Análisis de vulnerabilidades y pentesting','Segmentación de red y Zero Trust','Cumplimiento ISO 27001 y GDPR']
  },
  cloud: {
    title: 'Plataforma Cloud',
    color: 'bg-blue-500/10 text-blue-400',
    icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>',
    description: 'Gestión centralizada desde cualquier dispositivo. Dashboards en tiempo real, reportes automáticos y almacenamiento con redundancia geográfica.',
    features: ['Dashboard web y app móvil (iOS/Android)','Almacenamiento cifrado AES-256','Reportes automáticos programados','APIs REST para integración de terceros','Uptime 99.9% garantizado','Backup y recuperación ante desastres']
  },
  support: {
    title: 'Soporte 24/7',
    color: 'bg-orange-500/10 text-orange-400',
    icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
    description: 'Centro de monitoreo permanente con técnicos especializados disponibles las 24 horas. Respuesta inmediata a incidentes y mantenimiento preventivo.',
    features: ['Mesa de ayuda 24/7/365','Respuesta garantizada en menos de 2 horas','Mantenimiento preventivo trimestral','Actualizaciones de firmware y software','Monitoreo remoto proactivo','SLA documentado con penalidades']
  }
};

function showServiceDetail(key) {
  var d = serviceData[key];
  if (!d) return;
  var modal = document.getElementById('serviceModal');
  if (!modal) return;

  var iconEl = document.getElementById('modalIcon');
  iconEl.className = 'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ' + d.color;
  iconEl.innerHTML = d.icon;
  document.getElementById('modalTitle').textContent       = d.title;
  document.getElementById('modalDescription').textContent = d.description;
  document.getElementById('modalFeatures').innerHTML = d.features.map(function (f) {
    return '<li class="flex items-center gap-2 text-sm text-gray-300">'
      + '<svg class="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
      + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
      + f + '</li>';
  }).join('');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
  var modal = document.getElementById('serviceModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeServiceModal();
});


/* ── 6. FORMULARIO WEB3FORMS ──────────────────────────────── */
(function () {
  var form    = document.getElementById('contactForm');
  if (!form) return;

  var btn     = document.getElementById('submitBtn');
  var btnText = document.getElementById('submitBtnText');
  var icon    = document.getElementById('submitIcon');
  var spinner = document.getElementById('submitSpinner');
  var success = document.getElementById('formSuccess');
  var error   = document.getElementById('formError');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    /* Estado: enviando */
    btn.disabled        = true;
    btnText.textContent = 'Enviando…';
    if (icon)    icon.classList.add('hidden');
    if (spinner) spinner.classList.remove('hidden');
    if (success) success.classList.add('hidden');
    if (error)   error.classList.add('hidden');

    try {
      var obj = {};
      new FormData(form).forEach(function (v, k) { obj[k] = v; });

      //var res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(obj)
      });
      var json = await res.json();

      if (res.ok && json.success) {
        if (success) { success.classList.remove('hidden'); success.style.display = 'flex'; }
        form.reset();
      } else {
        throw new Error(json.message || 'Error');
      }
    } catch (err) {
      console.error('Web3Forms:', err);
      if (error) { error.classList.remove('hidden'); error.style.display = 'flex'; }
    } finally {
      btn.disabled        = false;
      btnText.textContent = 'Enviar Consulta';
      if (icon)    icon.classList.remove('hidden');
      if (spinner) spinner.classList.add('hidden');
    }
  });
})();


/* ── 7. AÑO EN EL FOOTER ──────────────────────────────────── */
(function () {
  var el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();



/* ── 8. MOVIMIENTO DEL BRAND 3 ──────────────────────────────────── */
const track3 = document.querySelector('.brands-track-3');
let scrollPos = 0;
const scrollStep = 1; // velocidad (más bajo = más lento)
const delay = 70; // tiempo entre pasos (ms)

function autoScroll() {
  scrollPos += scrollStep;
  track3.scrollLeft = scrollPos;
  if (scrollPos >= track3.scrollWidth / 2) scrollPos = 0;
}

let autoScrollInterval = setInterval(autoScroll, delay);

// Pausa cuando el usuario interactúa
track3.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
track3.addEventListener('mouseleave', () => autoScrollInterval = setInterval(autoScroll, delay));

