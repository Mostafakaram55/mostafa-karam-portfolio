/*
  Scroll Motion Layer — Mostafa Karam Saeed Portfolio
  Progress bar, word-reveal headings, card stagger, hero parallax,
  number count-up, pointer spotlight, section dot rail.
*/

(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    initSpotlight();
    if (reduce) return;
    initHeadingReveal();
    initStagger();
    initBullets();
    initCountUp();
    initHeroParallax();
    initSectionRail();
  });

  /* Shared one-shot visibility observer */
  function onceVisible(els, cb, options) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        cb(entry.target);
        io.unobserve(entry.target);
      });
    }, options || { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* One rAF-throttled scroll loop for everything that follows scrollY */
  const scrollTasks = [];
  function onScroll(fn) {
    scrollTasks.push(fn);
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.pageYOffset;
      scrollTasks.forEach((fn) => fn(y));
      ticking = false;
    });
  }, { passive: true });

  /* Top progress bar */
  function initProgressBar() {
    if (reduce) return;
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    const update = (y) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
    };
    update(window.pageYOffset);
    onScroll(update);
    window.addEventListener('resize', () => update(window.pageYOffset));
  }

  /* Section titles: each word rises out of a mask; tag line + subtitle follow */
  function initHeadingReveal() {
    const titles = document.querySelectorAll('.section-title');
    titles.forEach((title) => {
      let w = 0;
      const wrap = (node) => {
        Array.from(node.childNodes).forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(' '));
                return;
              }
              const outer = document.createElement('span');
              outer.className = 'split-word';
              const inner = document.createElement('span');
              inner.style.setProperty('--w', w++);
              inner.textContent = part;
              outer.appendChild(inner);
              frag.appendChild(outer);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            wrap(child);
          }
        });
      };
      wrap(title);
    });

    onceVisible(titles, (title) => {
      title.classList.add('in');
      const section = title.closest('.container') || title.parentElement;
      const tag = section.querySelector('.section-tag');
      const sub = section.querySelector('.section-subtitle');
      if (tag) tag.classList.add('in');
      if (sub) sub.classList.add('in');
    }, { threshold: 0.4, rootMargin: '0px 0px -5% 0px' });
  }

  /* Cards in the same grid enter one after another (by row position) */
  function initStagger() {
    const groups = document.querySelectorAll(
      '.strengths-grid, .projects-grid, .skills-grid, .bento-interests-grid, .contact-grid'
    );
    groups.forEach((group) => {
      const cols = getComputedStyle(group).gridTemplateColumns.split(' ').length || 1;
      Array.from(group.children).forEach((child, i) => {
        child.style.setProperty('--stagger', i % Math.max(cols, 1));
      });
    });
  }

  /* Experience bullets cascade when their card appears */
  function initBullets() {
    const cards = document.querySelectorAll('.timeline-content');
    cards.forEach((card) => {
      card.querySelectorAll('.timeline-bullets li').forEach((li, i) => li.style.setProperty('--b', i));
    });
    onceVisible(cards, (card) => card.classList.add('in'), { threshold: 0.15 });
  }

  /* Hero stat numbers count up once the hero card is in view */
  function initCountUp() {
    const nums = document.querySelectorAll('.stat-number');
    onceVisible(nums, (el) => {
      const match = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2];
      const DURATION = 1200;
      let start = null;
      const step = (ts) => {
        if (start === null) start = ts;
        const t = Math.min((ts - start) / DURATION, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = '0' + suffix;
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
  }

  /* Hero layers drift at different speeds while the hero is on screen */
  function initHeroParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    onScroll((y) => {
      if (y > hero.offsetHeight) return;
      hero.style.setProperty('--hero-y', y);
    });
  }

  /* Soft light that follows the pointer inside cards */
  function initSpotlight() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const sel = '.strength-card, .project-card, .skill-card, .bento-card, .edu-card';
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest && e.target.closest(sel);
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* Dot rail on the right edge: where you are, jump anywhere */
  function initSectionRail() {
    const sections = Array.from(document.querySelectorAll('main section[id]'))
      .filter((s) => s.id !== 'hero' && s.id !== 'stack');
    if (!sections.length) return;

    const rail = document.createElement('nav');
    rail.className = 'section-rail';
    rail.setAttribute('aria-label', 'Page sections');
    const links = sections.map((s) => {
      const a = document.createElement('a');
      a.href = '#' + s.id;
      const tag = s.querySelector('.section-tag');
      a.dataset.label = tag ? tag.textContent.trim() : s.id;
      a.setAttribute('aria-label', a.dataset.label);
      rail.appendChild(a);
      return a;
    });
    document.body.appendChild(rail);

    const hero = document.getElementById('hero');
    onScroll((y) => {
      rail.classList.toggle('visible', y > (hero ? hero.offsetHeight * 0.6 : 400));
      const mid = y + window.innerHeight * 0.4;
      let current = -1;
      sections.forEach((s, i) => { if (s.offsetTop <= mid) current = i; });
      links.forEach((a, i) => a.classList.toggle('active', i === current));
    });
  }
})();

/* ===== Stage 2: marquee, tilt, magnetic buttons, cursor ===== */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce) return;

  document.addEventListener('DOMContentLoaded', () => {
    initMarquee();
    if (!fine) return;
    initTilt();
    initMagnetic();
    initCursor();
  });

  /* Chips scroll sideways forever; scrolling the page speeds them up (and flips direction) */
  function initMarquee() {
    const chips = document.querySelector('.stack-chips');
    if (!chips) return;
    Array.from(chips.children).forEach((c) => {
      const clone = c.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      chips.appendChild(clone);
    });

    const wrap = document.createElement('div');
    wrap.className = 'stack-marquee';
    chips.parentNode.insertBefore(wrap, chips);
    wrap.appendChild(chips);

    let x = 0;
    let lastY = window.pageYOffset;
    let boost = 0;
    let dir = -1;
    let paused = false;
    let visible = true;
    let loopW = 0;
    const measure = () => { loopW = chips.scrollWidth / 2; };
    measure();
    window.addEventListener('resize', measure);
    wrap.addEventListener('mouseenter', () => { paused = true; });
    wrap.addEventListener('mouseleave', () => { paused = false; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(wrap);

    (function frame() {
      const y = window.pageYOffset;
      const delta = y - lastY;
      lastY = y;
      if (Math.abs(delta) > 0.5) {
        boost = Math.min(Math.abs(delta) * 0.35, 14);
        dir = delta > 0 ? -1 : 1;
      }
      boost *= 0.92;
      if (visible && !paused && loopW) {
        x += dir * (0.6 + boost);
        if (x <= -loopW) x += loopW;
        if (x > 0) x -= loopW;
        chips.style.transform = `translate3d(${x}px,0,0)`;
      }
      requestAnimationFrame(frame);
    })();
  }

  /* Project banners lean toward the pointer */
  function initTilt() {
    document.querySelectorAll('.project-banner').forEach((el) => {
      const MAX = 7;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.setProperty('--ry', ((px - 0.5) * 2 * MAX).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - py) * 2 * MAX).toFixed(2) + 'deg');
        el.style.setProperty('--bx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--by', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-tilting');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* Buttons and social icons are gently pulled toward the pointer */
  function initMagnetic() {
    const items = document.querySelectorAll('.hero-cta .btn, .nav-actions .btn, .social-icon, #form-submit-btn');
    const state = Array.from(items).map((el) => ({ el, x: 0, y: 0, tx: 0, ty: 0 }));
    let running = false;

    document.addEventListener('pointermove', (e) => {
      state.forEach((s) => {
        const r = s.el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9;
        s.tx = near ? dx * 0.25 : 0;
        s.ty = near ? dy * 0.3 : 0;
      });
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });

    function tick() {
      let moving = false;
      state.forEach((s) => {
        s.x += (s.tx - s.x) * 0.18;
        s.y += (s.ty - s.y) * 0.18;
        if (!s.tx && !s.ty && Math.abs(s.x) < 0.05 && Math.abs(s.y) < 0.05) {
          s.x = s.y = 0;
          s.el.style.translate = '';
        } else {
          s.el.style.translate = `${s.x.toFixed(2)}px ${s.y.toFixed(2)}px`;
          moving = true;
        }
      });
      if (moving) requestAnimationFrame(tick); else running = false;
    }
  }

  /* Ring that trails the pointer, grows on links, says "View" on project images */
  function initCursor() {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.innerHTML = '<span>View</span>';
    document.body.appendChild(ring);

    let tx = -100, ty = -100, x = tx, y = ty;
    document.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      ring.classList.add('on');
      const view = e.target.closest('.project-banner');
      const link = e.target.closest('a, button, .filter-btn, .contact-item, .stack-chip, .skill-card');
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-link', !view && !!link);
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => ring.classList.remove('on'));

    (function frame() {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      ring.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      requestAnimationFrame(frame);
    })();
  }
})();
