/** Progressive enhancement: content stays visible without JS or with reduced motion. */
export function reveal(node: HTMLElement) {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Never hide a section that the browser has already brought into view (e.g. a deep link).
  if (node.getBoundingClientRect().top < window.innerHeight) return;
  node.dataset.reveal = 'waiting';
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { node.dataset.reveal = 'visible'; observer.disconnect(); }
  }, { threshold: 0.06, rootMargin: '0px 0px 24px 0px' });
  observer.observe(node);
  return { destroy() { observer.disconnect(); } };
}
export function tilt(node: HTMLElement) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let frame = 0;
  const move = (event: PointerEvent) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = node.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      node.style.setProperty('--rx', `${(0.5 - y) * 3}deg`);
      node.style.setProperty('--ry', `${(x - 0.5) * 4}deg`);
      node.style.setProperty('--px', `${x * 100}%`);
      node.style.setProperty('--py', `${y * 100}%`);
    });
  };
  const reset = () => { cancelAnimationFrame(frame); node.style.setProperty('--rx', '0deg'); node.style.setProperty('--ry', '0deg'); };
  node.addEventListener('pointermove', move); node.addEventListener('pointerleave', reset);
  return { destroy() { reset(); node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', reset); } };
}
/** Swipe only on touch pointers; ordinary vertical page scrolling remains native. */
export function swipe(node: HTMLElement, change: (direction: number) => void) {
  let start: { x: number; y: number; id: number } | undefined;
  const down = (event: PointerEvent) => { if (event.pointerType === 'touch') start = { x: event.clientX, y: event.clientY, id: event.pointerId }; };
  const up = (event: PointerEvent) => {
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x, y = event.clientY - start.y; start = undefined;
    if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.3) change(x < 0 ? 1 : -1);
  };
  const cancel = () => { start = undefined; };
  node.addEventListener('pointerdown', down); node.addEventListener('pointerup', up); node.addEventListener('pointercancel', cancel);
  return { destroy() { node.removeEventListener('pointerdown', down); node.removeEventListener('pointerup', up); node.removeEventListener('pointercancel', cancel); } };
}
/** Keep keyboard focus inside an open modal, including reverse tabbing. */
export function modalFocus(node: HTMLDialogElement) {
  const keydown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !node.open) return;
    const controls = [...node.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')].filter(control => control.getClientRects().length > 0);
    const first = controls[0], last = controls.at(-1);
    if (!first || !last) { event.preventDefault(); node.focus(); return; }
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  node.addEventListener('keydown', keydown);
  return { destroy() { node.removeEventListener('keydown', keydown); } };
}

/** Decorative depth is pointer-only, frame-throttled, and never needed to use the hero. */
export function heroDepth(node: HTMLElement) {
  const preference = window.matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)');
  let frame = 0;
  const reset = () => {
    cancelAnimationFrame(frame);
    node.style.setProperty('--drift-x', '0px');
    node.style.setProperty('--drift-y', '0px');
    node.style.setProperty('--light-x', '65%');
    node.style.setProperty('--light-y', '40%');
  };
  const move = (event: PointerEvent) => {
    if (!preference.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = node.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      node.style.setProperty('--drift-x', `${(x - .5) * 12}px`);
      node.style.setProperty('--drift-y', `${(y - .5) * 10}px`);
      node.style.setProperty('--light-x', `${x * 100}%`);
      node.style.setProperty('--light-y', `${y * 100}%`);
    });
  };
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerleave', reset);
  preference.addEventListener('change', reset);
  return { destroy() {
    reset();
    node.removeEventListener('pointermove', move);
    node.removeEventListener('pointerleave', reset);
    preference.removeEventListener('change', reset);
  } };
}
