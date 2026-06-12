/* ================================================================
   scripts.js — QNetSys
   Funciones organizadas por bloque para fácil mantenimiento:
   1. Mobile menu
   2. Scroll reveal (IntersectionObserver)
   3. Counters animados
   4. Navbar scroll (blur/opacidad)
   5. Smooth scroll en links internos
   6. Modal de detalle de servicios (las cards de #servicios)
   7. Formulario de contacto (listo para conectar)
   8. Footer year
   ================================================================ */


/* ----------------------------------------------------------------
   1. MOBILE MENU
   ---------------------------------------------------------------- */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    menu.classList.toggle('hidden');
}

// Cerrar el menú mobile al hacer clic en un link
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('mobileMenu')?.classList.add('hidden');
        });
    });
});


/* ----------------------------------------------------------------
   2. SCROLL REVEAL
   Todos los elementos con clase .scroll-reveal se animan al entrar
   en viewport. Para desactivar en un elemento: quitá la clase.
   ---------------------------------------------------------------- */
function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}


/* ----------------------------------------------------------------
   3. COUNTERS ANIMADOS
   Lee data-target (número final) y data-suffix (opcional, ej: "+", "%").
   La animación se dispara cuando el elemento entra en viewport.
   ---------------------------------------------------------------- */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        // Formatear números grandes con separador de miles
        const formatted = Math.floor(current).toLocaleString('es-UY');
        el.textContent = formatted + suffix;
    }, stepTime);
}

function initCounters() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    document.querySelectorAll('.counter-value[data-target]').forEach(el => observer.observe(el));
}


/* ----------------------------------------------------------------
   4. NAVBAR SCROLL
   Aumenta la opacidad del navbar al hacer scroll.
   ---------------------------------------------------------------- */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 26, 0.98)';
            navbar.style.borderBottomColor = 'rgba(255,255,255,0.08)';
        } else {
            navbar.style.background = 'rgba(10, 14, 26, 0.85)';
            navbar.style.borderBottomColor = 'rgba(255,255,255,0.05)';
        }
    });
}


/* ----------------------------------------------------------------
   5. SMOOTH SCROLL EN LINKS INTERNOS
   ---------------------------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;
            e.preventDefault();
            const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
            const top = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}


/* ----------------------------------------------------------------
   6. MODAL DE DETALLE DE SERVICIOS
   Las cards de #servicios llaman a showServiceDetail(id).
   Editá el objeto SERVICES para cambiar el contenido del modal.
   ---------------------------------------------------------------- */
const SERVICES = {
    cctv: {
        title: 'CCTV & Video Vigilancia',
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`,
        color: 'cyan',
        description: 'Instalamos sistemas de videovigilancia IP de alta resolución con analítica de video embebida. Desde cámaras domo interiores hasta PTZ outdoor con visión nocturna extendida.',
        features: [
            'Cámaras 4K/8K con IA embebida (detección facial, conteo, intrusión)',
            'Grabación continua 24/7 en NVR con redundancia RAID',
            'Acceso remoto en tiempo real desde app móvil o web',
            'Alertas automáticas por email, SMS o push',
            'Retención de video configurable: 30 a 365 días',
            'Integración con sistemas de control de acceso',
        ],
    },
    access: {
        title: 'Control de Acceso Biométrico',
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
        color: 'indigo',
        description: 'Controlá quién entra, cuándo y a qué zona. Sistemas de control de acceso con biometría multimodal, reportes de auditoría y gestión centralizada.',
        features: [
            'Reconocimiento facial, huella dactilar, vena de palma e iris',
            'Tarjetas inteligentes MIFARE / DESFire',
            'Lectores QR y PIN para visitantes',
            'Software de gestión con reportes y auditoría completa',
            'Integración con RRHH y Active Directory',
            'Bloqueo / apertura remota de puertas',
        ],
    },
    alarm: {
        title: 'Alarmas y Detección',
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>`,
        color: 'purple',
        description: 'Sistemas de detección de intrusión, sensores de movimiento PIR, detectores de rotura de vidrio, humo y gas. Paneles IP con monitoreo central.',
        features: [
            'Paneles IP con comunicación dual (SIM + Ethernet)',
            'Sensores PIR, magnéticos y volumétricos',
            'Detección de humo, gas y temperatura',
            'Botones de pánico cableados e inalámbricos',
            'Sirenas interior/exterior con verificación de alarma',
            'Monitoreo central 24/7 opcional',
        ],
    },
    intercom: {
        title: 'Porteros IP & Intercomunicadores',
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`,
        color: 'cyan',
        description: 'Porteros IP con video HD, apertura remota desde app móvil, historial de llamadas y capturas de imagen de cada visita.',
        features: [
            'Video HD con visión nocturna',
            'Apertura remota desde smartphone (donde estés)',
            'Historial de visitas con fotos',
            'Multi-apartamento con directorio digital',
            'Integración con control de acceso vehicular',
            'Grabación de llamadas perdidas con imagen',
        ],
    },
    monitoring: {
        title: 'Monitoreo Remoto 24/7',
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/></svg>`,
        color: 'indigo',
        description: 'Centro de monitoreo propio con operadores capacitados. Verificación de alarmas, coordinación con fuerzas de seguridad y reportes mensuales de actividad.',
        features: [
            'Operadores capacitados 24/7/365',
            'Verificación de alarmas antes de despachar',
            'Coordinación con policía y bomberos',
            'Reporte mensual de eventos e incidentes',
            'Acceso a cámaras en tiempo real por el operador',
            'SLA garantizado por contrato',
        ],
    },
    maintenance: {
        title: 'Mantenimiento Preventivo',
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
        color: 'purple',
        description: 'Planes de mantenimiento periódico para mantener tu sistema operando al 100%. Limpieza, actualizaciones de firmware, revisión de grabaciones y reporte de estado.',
        features: [
            'Visita técnica programada (mensual, trimestral o semestral)',
            'Limpieza de cámaras y lectores biométricos',
            'Actualización de firmware y software',
            'Revisión de grabaciones y almacenamiento',
            'Informe de estado del sistema',
            'Descuentos en reposición de equipos',
        ],
    },
};

function showServiceDetail(id) {
    const service = SERVICES[id];
    if (!service) return;

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'serviceModal';
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm';
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeServiceModal();
    });

    const colorMap = {
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', dot: 'bg-cyan-400' },
        indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', dot: 'bg-indigo-400' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-400' },
    };
    const c = colorMap[service.color] || colorMap.cyan;

    overlay.innerHTML = `
        <div class="glass-card rounded-2xl max-w-lg w-full p-8 relative animate-fade-in" style="animation:fadeInUp .3s ease-out both">
            <button onclick="closeServiceModal()" class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-xl ${c.bg} flex items-center justify-center ${c.text} shrink-0">
                    ${service.icon}
                </div>
                <h3 class="text-xl font-bold text-white">${service.title}</h3>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">${service.description}</p>
            <ul class="space-y-2 mb-8">
                ${service.features.map(f => `
                    <li class="flex items-start gap-2 text-sm text-gray-300">
                        <span class="w-1.5 h-1.5 rounded-full ${c.dot} shrink-0 mt-1.5"></span>
                        ${f}
                    </li>
                `).join('')}
            </ul>
            <a href="#contacto" onclick="closeServiceModal()" class="w-full block text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                Consultar por este servicio
            </a>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
}

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeServiceModal();
});


/* ----------------------------------------------------------------
   7. FORMULARIO DE CONTACTO
   Por defecto solo hace validación cliente y muestra el estado.
   
   PARA CONECTAR CON EMAILJS:
   1. Incluir: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   2. Descomentar el bloque emailjs abajo y completar los IDs.
   
   PARA CONECTAR CON FORMSPREE:
   1. Agregar action="https://formspree.io/f/TU_ID" method="POST" al form.
   2. Podés dejar el handler actual o usar el submit nativo del form.
   
   PARA BACKEND PROPIO:
   1. Cambiar FORM_ENDPOINT abajo por tu URL.
   2. El form ya envía JSON con los campos: name, company, email, phone, service, message.
   ---------------------------------------------------------------- */

// EDITAR: poner tu endpoint aquí cuando esté listo
const FORM_ENDPOINT = null; // ej: 'https://tu-backend.com/api/contact'

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const btnText = document.getElementById('submitBtnText');
        const successEl = document.getElementById('formSuccess');
        const errorEl = document.getElementById('formError');

        // Reset estado
        successEl?.classList.add('hidden');
        errorEl?.classList.add('hidden');

        // Recopilar datos
        const data = {
            name: form.contact_name?.value.trim(),
            company: form.contact_company?.value.trim(),
            email: form.contact_email?.value.trim(),
            phone: form.contact_phone?.value.trim(),
            service: form.contact_service?.value,
            message: form.contact_message?.value.trim(),
        };

        // Validación básica
        if (!data.name || !data.email || !data.message) {
            // Resaltar campos vacíos
            [form.contact_name, form.contact_email, form.contact_message].forEach(field => {
                if (field && !field.value.trim()) {
                    field.classList.add('border-red-500/50');
                    field.addEventListener('input', () => field.classList.remove('border-red-500/50'), { once: true });
                }
            });
            return;
        }

        // Estado de carga
        btn.disabled = true;
        btnText.textContent = 'Enviando...';

        try {
            if (FORM_ENDPOINT) {
                // ---- OPCIÓN A: fetch a backend propio ----
                const res = await fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error('Server error');

            } /* else if (typeof emailjs !== 'undefined') {
                // ---- OPCIÓN B: EmailJS ----
                // Completar con tus IDs de EmailJS
                await emailjs.send(
                    'SERVICE_ID',    // tu Service ID de EmailJS
                    'TEMPLATE_ID',   // tu Template ID de EmailJS
                    data,
                    'PUBLIC_KEY'     // tu Public Key de EmailJS
                );

            } */ else {
                // Sin endpoint configurado: simular envío (quitar en producción)
                await new Promise(r => setTimeout(r, 1000));
                console.info('[QNetSys] Datos del form (sin endpoint):', data);
            }

            // Éxito
            successEl?.classList.remove('hidden');
            form.reset();

        } catch (err) {
            console.error('[QNetSys] Error al enviar formulario:', err);
            errorEl?.classList.remove('hidden');
        } finally {
            btn.disabled = false;
            btnText.textContent = 'Enviar consulta';
        }
    });
});


/* ----------------------------------------------------------------
   8. FOOTER YEAR
   ---------------------------------------------------------------- */
function initFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
}


/* ----------------------------------------------------------------
   INIT — ejecutar todo al cargar el DOM
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initNavbarScroll();
    initSmoothScroll();
    initFooterYear();
});

// Keyframe fadeInUp para el modal (se inyecta una vez)
if (!document.getElementById('qnet-keyframes')) {
    const style = document.createElement('style');
    style.id = 'qnet-keyframes';
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(style);
}
