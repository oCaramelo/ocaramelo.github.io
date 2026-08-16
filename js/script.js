// Theme toggle -------------------------------------------------
(function themeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);

  function current() {
    if (root.getAttribute('data-theme')) return root.getAttribute('data-theme');
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paint() {
    btn.textContent = current() === 'dark' ? 'Light mode' : 'Dark mode';
  }
  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    paint();
  });
  paint();
})();

// Signal-grid canvas ---------------------------------------------
// Nodes drifting slowly, edges drawn between near neighbours -
// a graph that reads equally as a dialogue-routing map or a
// geospatial sensor network.
(function signalGrid() {
  const canvas = document.getElementById('signal-grid');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, nodes;

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function makeNodes() {
    const count = Math.round((canvas.offsetWidth * canvas.offsetHeight) / 26000);
    nodes = Array.from({ length: Math.max(14, Math.min(count, 46)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.18 * devicePixelRatio,
    }));
  }

  function accentColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim() || '#146b63';
  }
  function dotColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c1541f';
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const link = accentColor();
    const dot = dotColor();
    const maxDist = 140 * devicePixelRatio;

    for (const n of nodes) {
      if (!reduceMotion) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxDist) {
          ctx.strokeStyle = link;
          ctx.globalAlpha = (1 - d / maxDist) * 0.35;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = dot;
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (!reduceMotion) requestAnimationFrame(frame);
  }

  function init() {
    resize();
    makeNodes();
    frame();
  }

  window.addEventListener('resize', () => { resize(); makeNodes(); if (reduceMotion) frame(); });
  init();
})();

// Easter egg: the CV's own joke, five clicks away ------------------
(function secretStash() {
  const trigger = document.getElementById('secret-trigger');
  const overlay = document.getElementById('egg-overlay');
  const closeBtn = document.getElementById('egg-close');
  if (!trigger || !overlay) return;

  let clicks = 0;
  let resetTimer;

  function open() {
    overlay.classList.add('open');
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    trigger.focus();
  }

  function bump() {
    clicks += 1;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { clicks = 0; }, 1500);
    if (clicks >= 5) { clicks = 0; open(); }
  }

  trigger.addEventListener('click', bump);
  document.getElementById('avatar-img').addEventListener('click', bump);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
})();
