document.documentElement.classList.add('js');

const motionPreference = new URLSearchParams(window.location.search).get('motion');
const motionReduced = motionPreference === 'reduced';
document.documentElement.classList.toggle('motion-full', !motionReduced);
document.documentElement.classList.toggle('motion-reduced', motionReduced);
const motionToggle = document.querySelector('[data-motion-toggle]');
if (motionToggle) {
  motionToggle.setAttribute('aria-pressed', String(!motionReduced));
  motionToggle.textContent = motionReduced ? 'Enable motion' : 'Reduce motion';
  motionToggle.addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    params.set('motion', motionReduced ? 'full' : 'reduced');
    window.location.search = params.toString();
  });
}
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function closeNavigation(returnFocus = false) {
  if (!toggle || !navLinks) return;
  navLinks.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) toggle.focus();
}

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) closeNavigation(true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav') && navLinks.classList.contains('open')) closeNavigation();
  });
}

const progress = document.querySelector('[data-progress]');
function updateProgress() {
  if (!progress) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const value = total > 0 ? Math.min(1, window.scrollY / total) : 0;
  progress.style.width = `${value * 100}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const revealItems = [...document.querySelectorAll('.reveal')];
if (motionReduced || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const stage = document.querySelector('[data-gundex-stage]');
const storySteps = [...document.querySelectorAll('[data-screen]')];
const stageLabel = document.querySelector('[data-stage-label]');
const stageDots = [...document.querySelectorAll('[data-stage-dot]')];
const stageStory = document.querySelector('.case-story');
function selectStage(step) {
  if (!stage || !step) return;
  stage.dataset.gundexStage = step.dataset.screen;
  if (stageLabel) stageLabel.textContent = step.dataset.label || '';
  storySteps.forEach((item) => item.classList.toggle('is-active', item === step));
  stageDots.forEach((dot) => dot.classList.toggle('is-active', dot.dataset.stageDot === step.dataset.screen));
}
if (storySteps[0]) selectStage(storySteps[0]);

const systemNodes = [...document.querySelectorAll('[data-system-node]')];
const systemTitle = document.querySelector('[data-system-title]');
const systemCopy = document.querySelector('[data-system-copy]');
systemNodes.forEach((node) => {
  node.setAttribute('aria-pressed', String(node.classList.contains('is-active')));
  node.addEventListener('click', () => {
    systemNodes.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });
    node.classList.add('is-active');
    node.setAttribute('aria-pressed', 'true');
    if (systemTitle) systemTitle.textContent = node.dataset.title || '';
    if (systemCopy) systemCopy.textContent = node.dataset.copy || '';
  });
});

const tilt = document.querySelector('[data-tilt]');
const canTilt = window.matchMedia('(pointer: fine)');
if (tilt && canTilt.matches && !motionReduced) {
  const machine = tilt.closest('.hero-machine');
  machine?.addEventListener('pointermove', (event) => {
    const box = machine.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    tilt.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg) rotateZ(5deg)`;
  });
  machine?.addEventListener('pointerleave', () => {
    tilt.style.transform = 'rotate(5deg)';
  });
}

const heroScreens = [...document.querySelectorAll('.hero-app-screen')];
if (heroScreens.length) {
  let activeHeroScreen = Math.max(0, heroScreens.findIndex((screen) => screen.classList.contains('is-active')));
  heroScreens.forEach((screen, index) => screen.classList.toggle('is-active', index === activeHeroScreen));
  if (!motionReduced) {
    window.setInterval(() => {
      heroScreens[activeHeroScreen].classList.remove('is-active');
      activeHeroScreen = (activeHeroScreen + 1) % heroScreens.length;
      heroScreens[activeHeroScreen].classList.add('is-active');
    }, 3000);
  }
}

const proofRail = document.querySelector('.proof-rail');
const counters = [...document.querySelectorAll('[data-count]')];
function settleCounters() {
  counters.forEach((counter) => {
    const value = Number(counter.dataset.count || 0);
    counter.textContent = `${counter.dataset.prefix || ''}${value.toLocaleString()}${counter.dataset.suffix || ''}`;
  });
}
function animateCounters() {
  const duration = 1100;
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    counters.forEach((counter) => {
      const end = Number(counter.dataset.count || 0);
      const value = Math.round(end * eased);
      counter.textContent = `${counter.dataset.prefix || ''}${value.toLocaleString()}${counter.dataset.suffix || ''}`;
    });
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
if (proofRail && counters.length && !motionReduced && 'IntersectionObserver' in window) {
  const countObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    animateCounters();
    observer.disconnect();
  }, { threshold: .45 });
  countObserver.observe(proofRail);
} else {
  settleCounters();
}

const canvas = document.querySelector('[data-signal-canvas]');
if (canvas) {
  const context = canvas.getContext('2d');
  const nodes = [
    { x: .08, y: .28, label: 'CLIENT' },
    { x: .29, y: .16, label: 'AUTH' },
    { x: .48, y: .36, label: 'DATA' },
    { x: .72, y: .18, label: 'BILLING' },
    { x: .89, y: .42, label: 'RELEASE' },
    { x: .63, y: .68, label: 'EVENTS' },
    { x: .24, y: .72, label: 'FEEDBACK' }
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,0],[1,6],[4,5]];
  let width = 0;
  let height = 0;
  let ratio = 1;
  let running = true;
  let pointer = { x: .5, y: .5 };

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function point(node) {
    return { x: node.x * width + (pointer.x - .5) * 11, y: node.y * height + (pointer.y - .5) * 7 };
  }

  function draw(time = 0) {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    edges.forEach(([from, to], index) => {
      const a = point(nodes[from]);
      const b = point(nodes[to]);
      context.strokeStyle = 'rgba(76, 201, 240, .18)';
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
      const cycle = motionReduced ? .55 : ((time * .00012 + index * .17) % 1);
      const x = a.x + (b.x - a.x) * cycle;
      const y = a.y + (b.y - a.y) * cycle;
      context.fillStyle = index % 3 === 0 ? '#39f5d0' : '#43c7ff';
      context.beginPath();
      context.arc(x, y, 2.2, 0, Math.PI * 2);
      context.fill();
    });
    nodes.forEach((node, index) => {
      const p = point(node);
      context.fillStyle = index === 2 ? '#39f5d0' : '#071012';
      context.strokeStyle = index === 2 ? '#39f5d0' : 'rgba(244,240,230,.42)';
      context.beginPath();
      context.arc(p.x, p.y, index === 2 ? 6 : 4, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = 'rgba(244,240,230,.46)';
      context.font = '600 8px ui-monospace, Consolas, monospace';
      context.fillText(node.label, p.x + 10, p.y + 3);
    });
    if (running && !motionReduced) requestAnimationFrame(draw);
  }

  resizeCanvas();
  draw();
  window.addEventListener('resize', resizeCanvas);
  canvas.closest('.hero')?.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight };
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    const canvasObserver = new IntersectionObserver((entries) => {
      const next = entries[0].isIntersecting;
      if (next && !running && !motionReduced) {
        running = true;
        requestAnimationFrame(draw);
      } else if (!next) {
        running = false;
      }
    }, { threshold: .01 });
    canvasObserver.observe(canvas);
  }
}

const motionDot = document.querySelector('[data-motion-dot]');
const motionLabel = document.querySelector('[data-motion-label]');
const motionSections = [
  { element: document.querySelector('.hero'), label: 'OPENING SIGNAL' },
  { element: document.querySelector('.systems-intro'), label: 'SELECTED SYSTEMS' },
  { element: document.querySelector('.gundex-case'), label: 'GUNDEX / LIVE' },
  { element: document.querySelector('.cleanstream-case'), label: 'CLEAN STREAM / BUILD' },
  { element: document.querySelector('.experiments'), label: 'ENGINEERING EXPERIMENTS' },
  { element: document.querySelector('.operator-log'), label: 'OPERATOR LOG' },
  { element: document.querySelector('.engineering-method'), label: 'ENGINEERING METHOD' },
  { element: document.querySelector('.contact'), label: 'NEXT SYSTEM' }
].filter((item) => item.element);
const parallaxHeadings = [
  { section: document.querySelector('.systems-intro'), target: document.querySelector('.systems-intro h2'), amount: 90 },
  { section: document.querySelector('.gundex-case'), target: document.querySelector('.gundex-case .case-heading h2'), amount: -130 },
  { section: document.querySelector('.cleanstream-case'), target: document.querySelector('.cleanstream-case .case-heading h2'), amount: 115 },
  { section: document.querySelector('.experiments'), target: document.querySelector('.section-heading-dark h2'), amount: -90 },
  { section: document.querySelector('.operator-log'), target: document.querySelector('.operator-heading h2'), amount: 85 }
].filter((item) => item.section && item.target);
const movingRows = [...document.querySelectorAll('.experiment, .log-entry')];
const cleanNodes = [...document.querySelectorAll('.system-node')];
const cleanCase = document.querySelector('.cleanstream-case');
const cleanBrandStage = document.querySelector('.clean-brand-stage');
const cleanManifestoMark = document.querySelector('.clean-manifesto-mark');
const heroSection = document.querySelector('.hero');
const stagePhone = document.querySelector('.phone-stack');
let motionFrame = 0;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function sectionProgress(element) {
  const rect = element.getBoundingClientRect();
  return clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
}

function updateScrollMotion() {
  motionFrame = 0;
  const documentRange = document.documentElement.scrollHeight - window.innerHeight;
  const pageProgress = documentRange > 0 ? clamp(window.scrollY / documentRange, 0, 1) : 0;
  if (motionDot) motionDot.style.top = `${pageProgress * 100}%`;

  const viewportCenter = window.innerHeight * .5;
  let activeSection = null;
  let activeDistance = Number.POSITIVE_INFINITY;
  motionSections.forEach((item) => {
    const rect = item.element.getBoundingClientRect();
    if (rect.top <= viewportCenter && rect.bottom > viewportCenter) {
      activeSection = item;
      activeDistance = 0;
      return;
    }
    if (activeDistance === 0) return;
    const distance = Math.abs(rect.top + rect.height * .5 - viewportCenter);
    if (distance < activeDistance) {
      activeDistance = distance;
      activeSection = item;
    }
  });
  if (motionLabel && activeSection) motionLabel.textContent = activeSection.label;

  if (stage && stageStory && storySteps.length) {
    const storyRect = stageStory.getBoundingClientRect();
    const storyProgress = clamp((viewportCenter - storyRect.top) / Math.max(storyRect.height, 1), 0, 1);
    stage.style.setProperty('--story-progress', storyProgress.toFixed(4));
    if (storyRect.top < window.innerHeight * .72 && storyRect.bottom > window.innerHeight * .28) {
      const closestStep = storySteps.reduce((closest, step) => {
        const rect = step.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * .5 - viewportCenter);
        return !closest || distance < closest.distance ? { step, distance } : closest;
      }, null);
      if (closestStep) selectStage(closestStep.step);
    }
  }

  if (motionReduced) return;

  if (heroSection) {
    const heroProgress = clamp(window.scrollY / Math.max(heroSection.offsetHeight, 1), 0, 1);
    heroSection.style.setProperty('--hero-copy-shift', `${heroProgress * 105}px`);
    heroSection.style.setProperty('--hero-machine-shift', `${heroProgress * -72}px`);
  }

  parallaxHeadings.forEach(({ section, target, amount }) => {
    const progressValue = sectionProgress(section);
    target.style.setProperty('--section-shift', `${(progressValue - .5) * amount}px`);
  });

  if (stagePhone) {
    const gundex = document.querySelector('.gundex-case');
    if (gundex) {
      const progressValue = sectionProgress(gundex);
      stagePhone.style.setProperty('--stage-shift', `${(progressValue - .5) * -105}px`);
      stagePhone.style.setProperty('--stage-rotation', `${(progressValue - .5) * 7}deg`);
    }
  }

  if (cleanCase) {
    const cleanProgress = sectionProgress(cleanCase);
    if (cleanBrandStage) {
      cleanBrandStage.style.setProperty('--clean-stage-shift', `${(cleanProgress - .5) * -92}px`);
      cleanBrandStage.style.setProperty('--clean-stage-rotation', `${2.5 + (cleanProgress - .5) * -5}deg`);
    }
    if (cleanManifestoMark) cleanManifestoMark.style.transform = `translateX(${(cleanProgress - .5) * 52}px)`;
  }

  movingRows.forEach((row, index) => {
    const rect = row.getBoundingClientRect();
    const distance = clamp((rect.top + rect.height * .5 - viewportCenter) / window.innerHeight, -1, 1);
    const direction = index % 2 === 0 ? 1 : -1;
    row.style.setProperty('--row-shift', `${distance * 38 * direction}px`);
  });

  cleanNodes.forEach((node, index) => {
    const rect = node.getBoundingClientRect();
    const distance = clamp((rect.top + rect.height * .5 - viewportCenter) / window.innerHeight, -1, 1);
    node.style.setProperty('--node-drift', `${distance * (16 + index * 3)}px`);
  });
}

function requestScrollMotion() {
  if (motionFrame) return;
  motionFrame = requestAnimationFrame(updateScrollMotion);
}

window.addEventListener('scroll', requestScrollMotion, { passive: true });
window.addEventListener('resize', requestScrollMotion);
updateScrollMotion();
