import { animate, createTimeline, onScroll, splitText, stagger, utils } from 'animejs';

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];

// Encabezado: fondo al hacer scroll y enlace activo según la sección visible.
// No es animación decorativa, así que corre aunque se reduzca el movimiento.
const header = $('[data-header]');
if (header) {
  const update = () => header.toggleAttribute('data-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

$$('[data-section]').forEach((section) => {
  const link = $(`[data-nav="${section.id}"]`);
  if (!link) return;
  onScroll({
    target: section,
    enter: { container: 'center', target: 'top' },
    leave: { container: 'center', target: 'bottom' },
    onEnter: () => link.setAttribute('data-active', ''),
    onLeave: () => link.removeAttribute('data-active'),
  });
});

if (root.classList.contains('motion')) {
  window.__motionReady = true;

  // Barra de progreso de lectura bajo el encabezado
  animate('[data-progress]', {
    scaleX: [0, 1],
    ease: 'linear',
    autoplay: onScroll({ target: document.body, enter: 'top top', leave: 'bottom bottom', sync: 0.4 }),
  });

  // ─── Presentación ───────────────────────────────────────────────
  const name = $('[data-hero-name]');
  const nameChars = name ? splitText(name, { words: { wrap: 'clip' }, chars: true }).chars : [];
  if (name) utils.set(name, { opacity: 1 });
  utils.set(nameChars, { translateY: '110%' });

  createTimeline({ defaults: { ease: 'outExpo' } })
    .add('[data-hero]', { opacity: [0, 1], translateY: [24, 0], duration: 900, delay: stagger(80) }, 0)
    .add(nameChars, { translateY: '0%', duration: 1100, delay: stagger(22) }, 200)
    .add('[data-hero-photo]', { opacity: [0, 1], scale: [0.85, 1], rotate: [-6, 0], duration: 1400 }, 150);

  // Anillo punteado que gira lento y pulso cian alrededor de la foto
  animate('[data-ring]', { rotate: 360, duration: 40000, ease: 'linear', loop: true });
  animate('[data-pulse]', {
    scale: [1, 1.2],
    opacity: [0.5, 0],
    duration: 2400,
    loop: true,
    loopDelay: 800,
    delay: 1600,
    ease: 'outQuad',
  });

  // Indicador de scroll
  animate('[data-scroll-cue]', {
    translateY: ['-100%', '200%'],
    duration: 1800,
    loop: true,
    ease: 'inOutQuad',
  });

  // Parallax al salir de la presentación: el texto sube y se desvanece,
  // la foto se queda atrás y el halo se desplaza.
  const hero = $('[data-hero-section]');
  if (hero) {
    const heroScroll = () =>
      onScroll({ target: hero, enter: 'top top', leave: 'top bottom', sync: 0.25 });
    animate('[data-hero-content]', { translateY: [0, -80], opacity: [1, 0], ease: 'linear', autoplay: heroScroll() });
    animate('[data-hero-parallax]', { translateY: [0, 60], scale: [1, 0.92], ease: 'linear', autoplay: heroScroll() });
    animate('[data-glow]', { translateY: [0, 160], scale: [1, 1.3], ease: 'linear', autoplay: heroScroll() });
  }

  // ─── Secciones ──────────────────────────────────────────────────
  $$('[data-section]').forEach((section) => {
    const title = section.querySelector<HTMLElement>('[data-split]');
    if (title) {
      const words = splitText(title, { words: { wrap: 'clip' } }).words;
      utils.set(title, { opacity: 1 });
      utils.set(words, { translateY: '110%' });
      animate(words, {
        translateY: '0%',
        duration: 900,
        delay: stagger(70),
        ease: 'outExpo',
        autoplay: onScroll({ target: title, enter: { container: '90%', target: 'top' } }),
      });
    }

    const line = section.querySelector('[data-accent-line]');
    if (line) {
      animate(line, {
        scaleX: [0, 1],
        duration: 900,
        delay: 250,
        ease: 'outExpo',
        autoplay: onScroll({ target: line, enter: { container: '90%', target: 'top' } }),
      });
    }

    const kicker = section.querySelector('[data-reveal-self]');
    if (kicker) {
      animate(kicker, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 800,
        delay: 350,
        ease: 'outExpo',
        autoplay: onScroll({ target: kicker, enter: { container: '90%', target: 'top' } }),
      });
    }

    // Número de sección con parallax suave ligado al scroll
    const index = section.querySelector('[data-index]');
    if (index) {
      animate(index, {
        translateY: [40, -40],
        opacity: [0, 1, 1],
        ease: 'linear',
        autoplay: onScroll({ target: section, enter: 'bottom top', leave: 'top bottom', sync: 0.3 }),
      });
    }
  });

  // Grupos que se revelan al hacer scroll
  $$('[data-reveal-group]').forEach((group) => {
    animate(group.querySelectorAll('[data-reveal]'), {
      opacity: [0, 1],
      translateY: [32, 0],
      scale: [0.98, 1],
      delay: stagger(90),
      duration: 1000,
      ease: 'outExpo',
      autoplay: onScroll({ target: group, enter: { container: '88%', target: 'top' } }),
    });
  });

  // Docencia: la línea se dibuja siguiendo el scroll y cada hito aparece
  // cuando la línea lo alcanza.
  const timeline = $('[data-timeline]');
  if (timeline) {
    animate('[data-timeline-line]', {
      scaleY: [0, 1],
      ease: 'linear',
      autoplay: onScroll({
        target: timeline,
        enter: { container: '75%', target: 'top' },
        leave: { container: '55%', target: 'bottom' },
        sync: 0.3,
      }),
    });

    $$('[data-timeline-item]').forEach((item) => {
      const trigger = () => onScroll({ target: item, enter: { container: '70%', target: 'top' } });
      animate(item, { opacity: [0, 1], translateX: [-16, 0], duration: 800, ease: 'outExpo', autoplay: trigger() });
      animate(item.querySelector('[data-dot]')!, {
        scale: [0, 1.4, 1],
        duration: 700,
        ease: 'outBack',
        autoplay: trigger(),
      });
    });
  }

  // Contacto: la tarjeta crece al entrar y el halo sigue el scroll
  const contact = $('[data-contact]');
  if (contact) {
    animate(contact, {
      scale: [0.94, 1],
      borderRadius: ['3rem', '1.5rem'],
      ease: 'linear',
      autoplay: onScroll({ target: contact, enter: 'bottom top', leave: 'center center', sync: 0.3 }),
    });
    animate('[data-contact-glow]', {
      translateX: [120, 0],
      translateY: [-80, 40],
      ease: 'linear',
      autoplay: onScroll({ target: contact, enter: 'bottom top', leave: 'top bottom', sync: 0.3 }),
    });
  }
}
