/**
 * Multi-page routes need an explicit reading start after an in-site navigation.
 * Direct arrivals keep the browser's normal Tab order, so the skip link remains
 * the first keyboard stop. The browser restores this module on Back/Forward.
 */
function announceRoute() {
  const heading = document.querySelector<HTMLElement>('main h1');
  const announcer = document.getElementById('route-announcer');
  if (!heading || !announcer) return;
  heading.focus({ preventScroll: true });
  announcer.textContent = `${document.title}. Main content loaded.`;
}

const focusMarker = 'casefile:route-focus';
const shouldFocus = (() => {
  try {
    const marked = sessionStorage.getItem(focusMarker) === '1';
    sessionStorage.removeItem(focusMarker);
    return marked || performance.getEntriesByType('navigation').some((entry) =>
      (entry as PerformanceNavigationTiming).type === 'back_forward');
  } catch { return false; }
})();

document.querySelectorAll<HTMLAnchorElement>('header nav a').forEach((link) => {
  link.addEventListener('click', () => {
    try { sessionStorage.setItem(focusMarker, '1'); } catch { /* storage may be disabled */ }
  });
});

if (shouldFocus) requestAnimationFrame(announceRoute);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) requestAnimationFrame(announceRoute);
});
