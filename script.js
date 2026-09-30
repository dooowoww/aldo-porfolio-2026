if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('pageshow', () => window.scrollTo(0, 0));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

const nav = document.querySelector('.nav');
const updateNavigation = () => nav.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();

const format = (value, target, suffix) => {
  if (target % 1) return value.toFixed(1) + suffix;
  return Math.round(value) + suffix;
};
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = 'true';
    const target = Number(entry.target.dataset.target), suffix = entry.target.dataset.suffix;
    const start = performance.now(), duration = 1350;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      entry.target.textContent = format(target * (1 - Math.pow(1 - p, 3)), target, suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: .55 });
document.querySelectorAll('.count').forEach(el => counterObserver.observe(el));

const revealObserver = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('in-view', e.isIntersecting)), { threshold: .2 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const alignmentSection = document.querySelector('.alignment-section');
if (alignmentSection) {
  const updateAlignment = () => {
    const rect = alignmentSection.getBoundingClientRect();
    const distance = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    alignmentSection.style.setProperty('--alignment-intro', Math.min(1, progress * 4).toFixed(3));
    // Start drawing only once the final “Grow Revenue 15%” goal is reached.
    alignmentSection.style.setProperty('--alignment-line-progress', Math.min(1, Math.max(0, (progress - .72) / .28)).toFixed(3));
    alignmentSection.classList.toggle('alignment-active', progress > .025);
  };
  let alignmentFrame;
  const requestAlignmentUpdate = () => {
    if (alignmentFrame) return;
    alignmentFrame = requestAnimationFrame(() => { alignmentFrame = undefined; updateAlignment(); });
  };
  window.addEventListener('scroll', requestAlignmentUpdate, { passive: true });
  window.addEventListener('resize', updateAlignment);
  updateAlignment();
}

const magnetSection = document.querySelector('.magnet');
if (magnetSection) {
  const updateMagnetLine = () => {
    const rect = magnetSection.getBoundingClientRect();
    const distance = Math.max(1, rect.height + window.innerHeight);
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / distance));
    magnetSection.style.setProperty('--magnet-line-progress', progress.toFixed(3));
  };
  let magnetLineFrame;
  const requestMagnetLineUpdate = () => {
    if (magnetLineFrame) return;
    magnetLineFrame = requestAnimationFrame(() => {
      magnetLineFrame = undefined;
      updateMagnetLine();
    });
  };
  window.addEventListener('scroll', requestMagnetLineUpdate, { passive: true });
  window.addEventListener('resize', updateMagnetLine);
  updateMagnetLine();

  const magnetEntranceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (entry.target === magnetSection) magnetSection.classList.add('magnet-title-visible');
      else entry.target.classList.add('is-visible');
      magnetEntranceObserver.unobserve(entry.target);
    });
  }, { threshold: .18 });
  magnetEntranceObserver.observe(magnetSection);
  magnetSection.querySelectorAll('.profile').forEach(profile => magnetEntranceObserver.observe(profile));
}

const projectShowcase = document.querySelector('.project-showcase');
if (projectShowcase) {
  const projectCopies = [...projectShowcase.querySelectorAll('.project-copy')];
  const progressMarks = [...projectShowcase.querySelectorAll('.project-progress span')];
  const artTitle = projectShowcase.querySelector('.art-title');
  const documentTab = projectShowcase.querySelector('.document-tab');
  const floatingChip = projectShowcase.querySelector('.floating-chip');
  const projectArt = projectShowcase.querySelector('.project-art');
  const projectEntry = projectShowcase.querySelector('.project-entry');
  const projectThemes = [
    { title: 'JDIH<br />PORTAL', card: '#fdfaff', chip: 'linear-gradient(135deg,#b610ca,#e942e7)', image: 'assets/img/card-design/jdih-card.png' },
    { title: 'KIMIA<br />FARMA', card: '#f8fbff', chip: 'linear-gradient(135deg,#176bcb,#53b7ec)', image: 'assets/img/card-design/kimia-farma-card.png' },
    { title: 'EV<br />PULSE', card: '#fffdf8', chip: 'linear-gradient(135deg,#e95a24,#f2ad2a)', image: 'assets/img/card-design/gaikindo-card.png' },
    { title: 'AI<br />JOB', card: '#fbf9ff', chip: 'linear-gradient(135deg,#5453c9,#a76be8)', image: 'assets/img/card-design/ai-job-card.png' }
  ];
  const projectResults = [
    { value: '↑ 41%', label: 'faster access' },
    { value: '↑ 36%', label: 'clearer insights' },
    { value: '↑ 29%', label: 'market visibility' },
    { value: '↑ 52%', label: 'team engagement' }
  ];
  const projectDocument = projectShowcase.querySelector('.project-document');
  let activeProject = -1;

  const setProject = index => {
    if (index === activeProject) return;
    activeProject = index;
    projectCopies.forEach((copy, i) => copy.classList.toggle('is-active', i === index));
    progressMarks.forEach((mark, i) => mark.classList.toggle('is-active', i === index));
    const theme = projectThemes[index];
    const result = projectResults[index];
    artTitle.innerHTML = theme.title;
    documentTab.textContent = String(index + 1).padStart(2, '0');
    floatingChip.querySelector('small').textContent = 'KEY RESULT';
    floatingChip.querySelector('b').textContent = result.value;
    floatingChip.querySelector('span').textContent = result.label;

    projectDocument.style.backgroundColor = theme.card;
    projectDocument.style.backgroundImage = theme.image ? `url("${theme.image}")` : 'none';
    projectDocument.classList.toggle('has-image', Boolean(theme.image));

    floatingChip.style.background = theme.chip;
    projectArt.style.transform = 'translateY(15px) rotate(' + (index % 2 ? 1.5 : -1.5) + 'deg)';
  };

  const updateProjects = () => {
    const rect = projectShowcase.getBoundingClientRect();
    const available = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / available));
    const introProgress = Math.min(1, progress * 5);
    const projectProgress = Math.min(1, Math.max(0, (progress - .2) / .8));
    projectEntry.style.setProperty('--intro-progress', introProgress.toFixed(3));
    projectShowcase.classList.toggle('projects-started', progress >= .18);
    setProject(Math.min(3, Math.floor(projectProgress * 4)));
  };
  let projectFrame;
  const requestProjectUpdate = () => {
    if (projectFrame) return;
    projectFrame = requestAnimationFrame(() => {
      projectFrame = undefined;
      updateProjects();
    });
  };
  window.addEventListener('scroll', requestProjectUpdate, { passive: true });
  window.addEventListener('resize', updateProjects);
  setProject(0);
  updateProjects();
}

const toolPhase = document.querySelector('.tool-phase');
if (toolPhase) {
  const toolPills = [...toolPhase.querySelectorAll('.tool-cloud span')];
  const experiencePhase = document.querySelector('.experience-phase');
  let toolFrame;
  const updateTools = () => {
    const rect = toolPhase.getBoundingClientRect();
    const distance = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    // Reserve the first part of the sticky scene as a fully empty right panel.
    const revealProgress = Math.min(1, Math.max(0, (progress - .16) / .84));
    const visibleTools = Math.min(toolPills.length, Math.floor(revealProgress * (toolPills.length + 1)));
    toolPills.forEach((pill, index) => pill.classList.toggle('tool-visible', index < visibleTools));
    if (experiencePhase) {
      const experienceTop = experiencePhase.getBoundingClientRect().top;
      const coverProgress = Math.min(1, Math.max(0, (window.innerHeight - experienceTop) / (window.innerHeight * .85)));
      toolPhase.style.setProperty('--tool-exit', coverProgress.toFixed(3));
      toolPhase.style.setProperty('--tool-exit-y', `${Math.round(-230 * coverProgress)}px`);
      toolPhase.style.setProperty('--tool-text-y', `${Math.round(-85 * coverProgress)}px`);
      toolPhase.style.setProperty('--tool-text-opacity', (1 - coverProgress * .72).toFixed(3));
      experiencePhase.style.setProperty('--experience-cover', coverProgress.toFixed(3));
      experiencePhase.style.setProperty('--experience-y', `${Math.round((1 - coverProgress) * window.innerHeight * .2)}px`);
      experiencePhase.style.setProperty('--experience-clip', `${Math.round((1 - coverProgress) * 24)}%`);
    }
  };
  const requestToolUpdate = () => {
    if (toolFrame) return;
    toolFrame = requestAnimationFrame(() => {
      toolFrame = undefined;
      updateTools();
    });
  };
  window.addEventListener('scroll', requestToolUpdate, { passive: true });
  window.addEventListener('resize', updateTools);
  updateTools();
}
