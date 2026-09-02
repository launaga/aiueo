const blueprintClock = document.querySelector('[data-blueprint-time]');
const blueprintHero = document.querySelector('.hero');
const methodSection = document.querySelector('.method-section');
const methodTrack = document.querySelector('.method-track');

function updateBlueprintClock() {
  if (!blueprintClock) return;
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
  blueprintClock.textContent = `LIVE ${time} WIB`;
}

updateBlueprintClock();
window.setInterval(updateBlueprintClock, 1000);

if (blueprintHero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  blueprintHero.addEventListener('pointermove', (event) => {
    const bounds = blueprintHero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    blueprintHero.style.setProperty('--pointer-x', x.toFixed(3));
    blueprintHero.style.setProperty('--pointer-y', y.toFixed(3));
    const image = blueprintHero.querySelector('.hero-image');
    const ticket = blueprintHero.querySelector('.hero-ticket');
    if (image) image.style.translate = `${x * -6}px ${y * -4}px`;
    if (ticket) ticket.style.translate = `${x * 8}px ${y * 5}px`;
  });
}

function updateMethodProgress() {
  if (!methodSection || !methodTrack) return;
  const bounds = methodSection.getBoundingClientRect();
  const distance = bounds.height + window.innerHeight;
  const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / distance));
  methodTrack.style.setProperty('--method-progress', progress.toFixed(3));
}

document.addEventListener('scroll', updateMethodProgress, { passive: true });
updateMethodProgress();
