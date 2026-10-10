(() => {
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const kinetic = document.querySelector('[data-kinetic]');
if (kinetic && !reduceMotion) {
const text = kinetic.textContent.trim();
kinetic.setAttribute('aria-label', text);
kinetic.setAttribute('aria-hidden', 'true');
kinetic.innerHTML = [...text].map((char, index) => `<span class="letter" style="--i:${index}">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
}
const progress = document.getElementById('progress');
const parallaxItems = [...document.querySelectorAll('.parallax')];
let scrollQueued = false;
function updateScrollEffects() {
const max = document.documentElement.scrollHeight - window.innerHeight;
if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
if (!reduceMotion && window.innerWidth > 680) {
const y = window.scrollY;
parallaxItems.forEach(item => {
const depth = Number(item.dataset.depth || 0);
const box = item.parentElement.getBoundingClientRect();
const offset = (box.top + box.height / 2 - window.innerHeight / 2) * depth;
item.style.setProperty('--px', `${Math.sin(y / 320 + depth * 10) * 9}px`);
item.style.setProperty('--py', `${offset}px`);
});
}
scrollQueued = false;
}
window.addEventListener('scroll', () => {
if (!scrollQueued) { window.requestAnimationFrame(updateScrollEffects); scrollQueued = true; }
}, { passive: true });
window.addEventListener('resize', updateScrollEffects, { passive: true });
updateScrollEffects();
const revealObserver = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('is-visible');
revealObserver.unobserve(entry.target);
}
});
}, { threshold: 0.13 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
const open = menuToggle.getAttribute('aria-expanded') !== 'true';
menuToggle.setAttribute('aria-expanded', String(open));
menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
nav?.classList.toggle('is-open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
nav.classList.remove('is-open');
menuToggle?.setAttribute('aria-expanded', 'false');
menuToggle?.setAttribute('aria-label', 'Open navigation');
}));
const lensCopy = {
time: 'A route can feel different when the clock changes.',
place: 'The places along the way shape what feels within reach.',
choice: 'Every journey holds choices that a straight line cannot show.'
};
document.querySelectorAll('.lens-button').forEach(button => button.addEventListener('click', () => {
document.querySelectorAll('.lens-button').forEach(item => {
const active = item === button;
item.classList.toggle('is-active', active);
item.setAttribute('aria-pressed', String(active));
});
const map = document.querySelector('.concept-map');
map?.setAttribute('data-map-lens', button.dataset.lens);
const caption = document.getElementById('lens-caption');
if (caption) caption.textContent = lensCopy[button.dataset.lens];
}));
const events = {
'2023': {
year: '2023', kicker: 'Social impact & expression', heading: 'Finding a voice.|Helping others be heard.',
description: 'Joined the core team at Bridge the Gap, shaping social content and outreach, and volunteered with children aged 7–13. Also performed a Kathak presentation for the Society for Child Development.',
tags: ['Social media', 'Education', 'Kathak']
},
'2025': {
year: '2025—', kicker: 'Economics & inquiry', heading: 'Learning to see|the system underneath.',
description: 'Began a B.Sc. in Economics at NMIMS Sarlā Anil Modi School of Economics. Alongside coursework, authored a research paper on post-2020 GST reforms and household savings in urban Haryana.',
tags: ['Economics', 'Research', 'Mumbai']
},
'2026': {
year: '2026', kicker: 'Research & strategy', heading: 'From a question|to a clearer picture.',
description: 'As a Business Analyst Intern at A.T. Kearney Consulting (India), researched market and policy questions across 40+ official sources and worked with route, location, and market-related data.',
tags: ['Market research', 'QGIS', 'Data']
},
campus: {
year: '2025—27', kicker: 'Campus & collaboration', heading: 'Making the room|work for everyone.',
description: 'Held active roles across five NMIMS SAMSOE student bodies spanning arts, management, debating, economics and politics, and sports. Promoted to Marketing Director of Ka-Ching in second year.',
tags: ['Leadership', 'Marketing', 'Teamwork']
}
};
const tabs = [...document.querySelectorAll('.timeline-tab')];
const panel = document.getElementById('timeline-panel');
const marker = document.getElementById('timeline-marker');
function selectEvent(tab) {
const data = events[tab.dataset.event];
if (!data) return;
tabs.forEach(item => {
const active = item === tab;
item.classList.toggle('is-active', active);
item.setAttribute('aria-selected', String(active));
item.tabIndex = active ? 0 : -1;
});
panel?.setAttribute('aria-labelledby', tab.id);
document.getElementById('timeline-year').textContent = data.year;
document.getElementById('timeline-kicker').textContent = data.kicker;
document.getElementById('timeline-heading').innerHTML = data.heading.split('|').map((line, index) => index ? `<br><em>${line}</em>` : line).join('');
document.getElementById('timeline-description').textContent = data.description;
const tags = document.getElementById('timeline-tags');
tags.replaceChildren(...data.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
const index = tabs.indexOf(tab);
if (marker) marker.style.left = `calc(${index * 100 / (tabs.length - 1)}% - 4px)`;
}
tabs.forEach((tab, index) => {
tab.tabIndex = index === 0 ? 0 : -1;
tab.addEventListener('click', () => selectEvent(tab));
tab.addEventListener('keydown', event => {
if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
event.preventDefault();
const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
tabs[next].focus();
selectEvent(tabs[next]);
});
});
document.getElementById('year').textContent = new Date().getFullYear();
})();
