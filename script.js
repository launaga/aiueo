const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const panels = document.querySelectorAll('.nav-panel');
const triggers = document.querySelectorAll('.nav-trigger');

function closeNavigation() {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  panels.forEach((panel) => panel.classList.remove('open'));
  triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
}

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

triggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const panel = document.querySelector(`#${trigger.getAttribute('aria-controls')}`);
    const willOpen = !panel.classList.contains('open');
    panels.forEach((item) => item.classList.remove('open'));
    triggers.forEach((item) => item.setAttribute('aria-expanded', 'false'));
    if (willOpen) {
      panel.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeNavigation();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNavigation();
});

document.querySelectorAll('.site-nav a, .nav-panel a').forEach((link) => link.addEventListener('click', closeNavigation));

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
}

const progress = document.querySelector('.page-progress i');
function updateScrollEffects() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
  if (!reducedMotion && window.innerWidth > 700) {
    document.querySelector('.hero-ticket').style.transform = `translateY(${window.scrollY * .06}px) rotate(7deg)`;
    document.querySelector('.hero-image').style.marginBottom = `${window.scrollY * -.025}px`;
  }
}
document.addEventListener('scroll', updateScrollEffects, { passive: true });
updateScrollEffects();

const cursor = document.querySelector('.cursor');
if (!reducedMotion && window.matchMedia('(hover:hover)').matches) {
  let pointerX = -100;
  let pointerY = -100;
  let cursorX = -100;
  let cursorY = -100;
  document.addEventListener('pointermove', (event) => { pointerX = event.clientX; pointerY = event.clientY; });
  function renderCursor() {
    cursorX += (pointerX - cursorX) * .18;
    cursorY += (pointerY - cursorY) * .18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();
  document.querySelectorAll('[data-cursor]').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      cursor.querySelector('span').textContent = item.dataset.cursor;
    });
    item.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

document.querySelectorAll('.magnetic').forEach((item) => {
  if (reducedMotion) return;
  item.addEventListener('pointermove', (event) => {
    const bounds = item.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    item.style.transform = `translate(${x * .09}px, ${y * .15}px)`;
  });
  item.addEventListener('pointerleave', () => { item.style.transform = ''; });
});

const serviceData = [
  { name: 'Corporate Event', type: 'Company-wide / Purpose-led', description: 'A sharp concept, seamless production, and a room that feels fully switched on, from opening cue to final applause.', image: 'assets/images/events/corporate-event.jpg', alt: 'Corporate participants gathered during a facilitated program', stamp: 'IDEA<br>TO<br>IMPACT', includes: ['Creative concept', 'Production & show flow', 'Talent & venue', 'On-site management'] },
  { name: 'Annual Kick Off', type: 'Alignment / Momentum', description: 'Turn the year’s ambition into something people can feel. Clear direction, shared energy, and a start that actually moves the team.', image: 'assets/images/events/annual-kickoff.jpg', alt: 'Company team gathered after an annual kick off program', stamp: 'START<br>WITH<br>ENERGY', includes: ['Theme & narrative', 'Leadership moments', 'Stage production', 'Engagement design'] },
  { name: 'Employee Gathering', type: 'Connection / Celebration', description: 'A day where titles loosen up, teams mix, and the people behind the work get to genuinely enjoy being together.', image: 'assets/images/events/employee-gathering.jpg', alt: 'Employees celebrating together after an outdoor activity', stamp: 'PEOPLE<br>MAKE<br>IT', includes: ['Experience format', 'Games & activities', 'Food & hospitality', 'Full logistics'] },
  { name: 'Family Gathering', type: 'Inclusive / All generations', description: 'Built for colleagues, partners, kids, and every pace in between, with enough variety to keep the whole crowd involved.', image: 'assets/images/events/family-gathering.jpg', alt: 'Guests sharing a meal during a company family gathering', stamp: 'ALL<br>AGES<br>IN', includes: ['Family-friendly concept', 'Kids & adult zones', 'Entertainment', 'Safety & comfort'] },
  { name: 'Outing & Outbound', type: 'Outside / Energized', description: 'Get out of routine and into an environment that makes people move, laugh, explore, and return with a new team story.', image: 'assets/images/events/outing-beach.jpg', alt: 'Company group preparing for water activities at an outing destination', stamp: 'GET<br>OUT<br>THERE', includes: ['Destination planning', 'Outdoor program', 'Transport & meals', 'Risk management'] },
  { name: 'Team Building', type: 'Behavior / Better together', description: 'Challenges with a point. Every activity is designed around the dynamics your team actually needs to strengthen.', image: 'assets/images/events/team-building.jpg', alt: 'Facilitator briefing participants during a team activity', stamp: 'MOVE<br>AS<br>ONE', includes: ['Needs mapping', 'Custom modules', 'Facilitation', 'Reflection session'] },
  { name: 'Company Anniversary', type: 'Legacy / Next chapter', description: 'Honor how far you’ve come without getting stuck in the past, a celebration with history, spectacle, and forward momentum.', image: 'assets/images/events/company-anniversary.jpg', alt: 'Participants laughing together during an evening celebration', stamp: 'THEN<br>NOW<br>NEXT', includes: ['Milestone story', 'Awards & recognition', 'Show production', 'Memory capture'] },
  { name: 'Custom Event Management', type: 'Your brief / Our full attention', description: 'No template, no awkward fit. Bring us the reason, the constraint, or the wild first thought. We’ll build the right format around it.', image: 'assets/images/events/custom-event.jpg', alt: 'Facilitator guiding a custom participant activity', stamp: 'MAKE<br>IT<br>YOURS', includes: ['Strategic consultation', 'Bespoke concept', 'End-to-end production', 'Post-event wrap'] }
];

const serviceUrls = [
  'corporate-event.html', 'annual-kick-off.html', 'employee-gathering.html',
  'family-gathering.html', 'outing-outbound.html', 'team-building.html',
  'company-anniversary.html', 'custom-event-management.html'
];

const serviceTabs = [...document.querySelectorAll('.service-tabs button')];
const serviceVisual = document.querySelector('.service-visual');
const serviceImage = serviceVisual.querySelector('img');
const serviceNumber = document.querySelector('.service-number');
const serviceStamp = document.querySelector('.service-stamp');
const serviceType = document.querySelector('.service-type');
const serviceName = document.querySelector('.service-copy h3');
const serviceDescription = document.querySelector('.service-description');
const serviceIncludes = document.querySelector('.service-includes');
const serviceDetailLink = document.querySelector('.service-detail-link');

function selectService(index, focusTab = false) {
  const data = serviceData[index];
  serviceTabs.forEach((tab, tabIndex) => tab.setAttribute('aria-selected', String(tabIndex === index)));
  serviceVisual.classList.add('changing');
  window.setTimeout(() => {
    serviceImage.src = data.image;
    serviceImage.alt = data.alt;
    serviceNumber.textContent = '';
    serviceStamp.innerHTML = data.stamp;
    serviceType.textContent = data.type;
    serviceName.textContent = data.name;
    serviceDescription.textContent = data.description;
    serviceIncludes.innerHTML = data.includes.map((item) => `<li>${item}</li>`).join('');
    serviceDetailLink.href = serviceUrls[index];
    serviceVisual.classList.remove('changing');
  }, reducedMotion ? 0 : 180);
  if (focusTab) serviceTabs[index].focus();
}

serviceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectService(index));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    selectService((index + direction + serviceTabs.length) % serviceTabs.length, true);
  });
});

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => selectService(Number(link.dataset.service)));
});

const filterButtons = document.querySelectorAll('.resource-switcher button');
const resourceCards = document.querySelectorAll('.resource-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    resourceCards.forEach((card) => card.classList.toggle('filtered', button.dataset.filter !== 'all' && card.dataset.kind !== button.dataset.filter));
  });
});

const briefForm = document.querySelector('form.brief-form');
briefForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const output = briefForm.querySelector('output');
  if (!briefForm.checkValidity()) {
    briefForm.reportValidity();
    output.textContent = 'Drop a valid email so we know where to send the next step.';
    return;
  }
  const eventType = briefForm.elements['event-type'].value;
  output.textContent = `Signal received. We’ll follow up about your ${eventType.toLowerCase()}.`;
  briefForm.reset();
});
