import { animate, onScroll, stagger } from 'animejs';

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

const root = document.documentElement;

if (root.classList.contains('motion')) {
  window.__motionReady = true;

  // Presentación: entrada escalonada al cargar
  animate('[data-hero]', {
    opacity: [0, 1],
    translateY: [24, 0],
    delay: stagger(90, { start: 100 }),
    duration: 900,
    ease: 'outExpo',
  });

  // Foto: aparece con escala y luego un anillo cian pulsa en loop
  animate('[data-hero-photo]', {
    opacity: [0, 1],
    scale: [0.92, 1],
    duration: 1100,
    delay: 250,
    ease: 'outExpo',
  });
  animate('[data-pulse]', {
    scale: [1, 1.18],
    opacity: [0.5, 0],
    duration: 2400,
    loop: true,
    loopDelay: 800,
    delay: 1400,
    ease: 'outQuad',
  });

  // Grupos que se revelan al hacer scroll
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    animate(group.querySelectorAll('[data-reveal]'), {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(80),
      duration: 800,
      ease: 'outExpo',
      autoplay: onScroll({ target: group, enter: { container: '88%', target: 'top' } }),
    });
  });

  // Línea de tiempo de docencia: la línea se dibuja siguiendo el scroll
  const timeline = document.querySelector<HTMLElement>('[data-timeline]');
  if (timeline) {
    animate('[data-timeline-line]', {
      scaleY: [0, 1],
      ease: 'linear',
      autoplay: onScroll({
        target: timeline,
        enter: { container: '80%', target: 'top' },
        leave: { container: '60%', target: 'bottom' },
        sync: 0.3,
      }),
    });
  }
}
