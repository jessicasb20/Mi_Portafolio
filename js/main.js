// ============================================
//   ESTRELLAS
// ============================================
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 180; i++) {
    const s = document.createElement('div');
    s.classList.add('star');
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%; left:${Math.random()*100}%;
      --dur:${(Math.random()*4+2).toFixed(1)}s;
      --op:${(Math.random()*0.5+0.3).toFixed(2)};
      animation-delay:${(Math.random()*5).toFixed(1)}s;
    `;
    container.appendChild(s);
  }
}

// ============================================
//   TYPEWRITER
// ============================================
function typeWriter() {
  const roles = ['Desarrolladora Web','Diseñadora UI/UX','Frontend Developer','Creadora Digital'];
  const el = document.querySelector('.typed-text');
  if (!el) return;
  let ri = 0, ci = 0, del = false;
  function type() {
    const cur = roles[ri];
    if (!del) {
      el.textContent = cur.substring(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(type, 1600); return; }
    } else {
      el.textContent = cur.substring(0, --ci);
      if (ci === 0) { del = false; ri = (ri+1) % roles.length; }
    }
    setTimeout(type, del ? 55 : 105);
  }
  type();
}

// ============================================
//   NAVBAR — SCROLL
// ============================================
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const fn = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', fn, { passive:true });
  fn();
}

// ============================================
//   NAVBAR — HAMBURGER
// ============================================
function initHamburger() {
  const toggle  = document.getElementById('navToggle');
  const links   = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !links || !overlay) return;

  const open  = () => {
    toggle.classList.add('open'); links.classList.add('open');
    overlay.classList.add('active'); overlay.style.display='block';
    document.body.style.overflow='hidden';
  };
  const close = () => {
    toggle.classList.remove('open'); links.classList.remove('open');
    overlay.classList.remove('active'); document.body.style.overflow='';
    setTimeout(() => { overlay.style.display='none'; }, 300);
  };

  toggle.addEventListener('click', () => links.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key==='Escape') close(); });
}

// ============================================
//   NAVBAR — ACTIVE LINK
// ============================================
function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold:0.4 });
  sections.forEach(s => obs.observe(s));
}

// ============================================
//   CURSOR — crosshair con 4 esquinas
// ============================================
function initCustomCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot     = document.getElementById('cursorDot');
  const ring    = document.getElementById('cursorRing');
  const corners = document.getElementById('cursorCorners');
  if (!dot || !ring || !corners) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  // Dot sigue inmediato
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring + corners con lag suave
  (function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left    = rx + 'px';
    ring.style.top     = ry + 'px';
    corners.style.left = rx + 'px';
    corners.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Hover interactivos
  const targets = 'a, button, input, textarea, label, [data-cursor], .nav-logo, .btn-primary, .btn-outline, .social-link';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(targets)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
      corners.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(targets)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
      corners.classList.remove('hovering');
    }
  });

  // Click
  document.addEventListener('mousedown', () => {
    dot.classList.add('clicking');
    ring.classList.add('clicking');
    corners.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('clicking');
    ring.classList.remove('clicking');
    corners.classList.remove('clicking');
  });

  // Sale del viewport
  document.addEventListener('mouseleave', () => {
    [dot, ring, corners].forEach(el => el.style.opacity = '0');
  });
  document.addEventListener('mouseenter', () => {
    [dot, ring, corners].forEach(el => el.style.opacity = '1');
  });
}

// ============================================
//   PARALLAX SUAVE — texto e imagen con el mouse
// ============================================
function initHeroParallax() {
  const text  = document.getElementById('heroText');
  const image = document.getElementById('heroImage');
  if (!text || !image) return;

  // Solo en desktop
  if (window.matchMedia('(max-width: 900px)').matches) return;

  let tgtTx = 0, tgtTy = 0;
  let tgtIx = 0, tgtIy = 0;
  let curTx = 0, curTy = 0;
  let curIx = 0, curIy = 0;

  document.addEventListener('mousemove', e => {
    // Normaliza -1 a 1
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;

    // Texto: se mueve suavemente en la misma dirección (leve)
    tgtTx = nx * 8;
    tgtTy = ny * 5;

    // Imagen: se mueve en sentido contrario (efecto profundidad)
    tgtIx = nx * -14;
    tgtIy = ny * -9;
  });

  (function animParallax() {
    // Interpolación suave
    curTx += (tgtTx - curTx) * 0.06;
    curTy += (tgtTy - curTy) * 0.06;
    curIx += (tgtIx - curIx) * 0.06;
    curIy += (tgtIy - curIy) * 0.06;

    text.style.transform  = `translate(${curTx.toFixed(2)}px, ${curTy.toFixed(2)}px)`;
    image.style.transform = `translate(${curIx.toFixed(2)}px, ${curIy.toFixed(2)}px)`;

    requestAnimationFrame(animParallax);
  })();
}

// ============================================
//   SCROLL REVEAL — todas las clases de animación
// ============================================
function initScrollReveal() {
  // Selecciona todos los elementos con cualquier clase reveal
  const els = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

// ============================================
//   INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  typeWriter();
  initNavScroll();
  initHamburger();
  initActiveLink();
  initCustomCursor();
  initHeroParallax();
  initScrollReveal();
});

// ============================================
//   FORMULARIO DE CONTACTO — EmailJS
//   Instrucciones para configurar:
//   1. Entra a https://www.emailjs.com y crea cuenta GRATIS
//   2. Ve a "Email Services" → conecta tu Gmail
//   3. Ve a "Email Templates" → crea template con estas variables:
//      {{from_name}}, {{from_email}}, {{asunto}}, {{mensaje}}
//   4. Copia tu Public Key, Service ID y Template ID
//   5. Reemplaza los 3 valores de abajo
// ============================================
function initContactForm() {
  const form     = document.getElementById('contactForm');
  const status   = document.getElementById('formStatus');
  if (!form || !status) return;

  // ↓↓↓ REEMPLAZA ESTOS 3 VALORES CON LOS DE TU CUENTA EMAILJS ↓↓↓
  const SERVICE_ID  = 'service_mktg09n';
  const TEMPLATE_ID = 'template_yxhw4o5';
  // La Public Key ya va en el HTML (emailjs.init)

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    // Estado cargando
    btn.innerHTML = 'Enviando...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    status.textContent = '';
    status.style.color = 'var(--purple-light)';

    // Datos del formulario
    const templateParams = {
      from_name:  form.nombre.value.trim(),
      from_email: form.email.value.trim(),
      asunto:     form.asunto.value.trim(),
      mensaje:    form.mensaje.value.trim(),
      to_email:   'jessicaserpabuitron@gmail.com',
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

      // Éxito
      status.textContent  = '✅ ¡Mensaje enviado! Te responderé pronto.';
      status.style.color  = '#a0f0a0';
      form.reset();

    } catch (err) {
      // Error — muestra el error exacto en consola para depurar
      console.error('EmailJS error completo:', err);
      console.error('Status:', err.status);
      console.error('Texto:', err.text);
      status.textContent = '❌ Hubo un error. Escríbeme directamente a jessicaserpabuitron@gmail.com';
      status.style.color = '#f08080';
    }

    // Restaurar botón
    btn.innerHTML = originalText;
    btn.disabled  = false;
    btn.style.opacity = '1';

    // Limpiar mensaje después de 6 seg
    setTimeout(() => { status.textContent = ''; }, 6000);
  });
}


// ============================================
//   PROYECTOS — toque en móvil
//   Al tocar una tarjeta muestra el overlay,
//   al tocar fuera lo oculta
// ============================================
function initProjectTouch() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  // Solo activo en dispositivos touch
  if (!('ontouchstart' in window)) return;

  cards.forEach(card => {
    card.addEventListener('touchstart', (e) => {
      // Si ya está activa, seguir el link
      if (card.classList.contains('touched')) return;
      e.preventDefault();
      // Desactivar todas las demás
      cards.forEach(c => c.classList.remove('touched'));
      // Activar esta
      card.classList.add('touched');
    }, { passive: false });
  });

  // Toque fuera cierra todas
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.project-card')) {
      cards.forEach(c => c.classList.remove('touched'));
    }
  });
}
// ============================================
//   INIT ADICIONAL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initProjectTouch();
});