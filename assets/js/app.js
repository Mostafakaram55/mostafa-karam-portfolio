/* 
  Main Application Logic — Mostafa Karam Saeed Portfolio
  Dark/Light Theme Toggle, Active Navigation, Skills Filtering, Mobile Drawer
*/

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initSkillsFilter();
  initScrollHighlight();
  initContactForm();
  initScrollReveal();
  initBackToTop();
  initCopyFeedback();
});

/* Theme Toggle System */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('mk_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mk_portfolio_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

/* Mobile Drawer Menu */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const isOpen = navLinks.classList.contains('mobile-open');
    menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  // Close drawer on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* Skills Category Filter */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-category');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 250);
        }
      });
    });
  });
}

/* Scroll Active Link Highlight */
function initScrollHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* Contact Form Submission to Email via FormSubmit.co */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const btnIcon = document.getElementById('submit-btn-icon');
  const btnText = document.getElementById('submit-btn-text');
  const statusDiv = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) return;

    // Loading State
    submitBtn.disabled = true;
    btnIcon.className = 'fa-solid fa-circle-notch fa-spin';
    btnText.innerText = 'Sending to Email...';
    statusDiv.className = 'form-status';
    statusDiv.style.display = 'none';

    try {
      const response = await fetch('https://formsubmit.co/ajax/mostafakaram345678@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || data.message)) {
        statusDiv.className = 'form-status success';
        statusDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent directly to Mostafa\'s email.';
        statusDiv.style.display = 'flex';
        form.reset();
      } else {
        triggerGmailFallback(name, email, message);
      }
    } catch (err) {
      triggerGmailFallback(name, email, message);
    } finally {
      submitBtn.disabled = false;
      btnIcon.className = 'fa-solid fa-paper-plane';
      btnText.innerText = 'Send Message to Email';
    }
  });
}

function triggerGmailFallback(name, email, message) {
  const statusDiv = document.getElementById('form-status');
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=mostafakaram345678@gmail.com&su=${encodeURIComponent('Portfolio Contact from ' + name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
  
  statusDiv.className = 'form-status success';
  statusDiv.innerHTML = `<i class="fa-solid fa-circle-info"></i> <a href="${gmailUrl}" target="_blank" style="color: inherit; text-decoration: underline; font-weight: bold;">Click here to send directly via Gmail</a>`;
  statusDiv.style.display = 'flex';
}

/* Scroll Reveal Animations Observer */
function initScrollReveal() {
  const elements = document.querySelectorAll('.strength-card, .project-card, .skill-card, .bento-card, .timeline-item, .edu-card, .contact-item');
  
  elements.forEach((el, idx) => {
    el.classList.add('reveal-on-scroll');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* Back to Top Floating Button */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* Quick Copy to Clipboard for Contact Info */
function initCopyFeedback() {
  const copyableItems = document.querySelectorAll('.contact-item[data-copy]');
  copyableItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const textToCopy = item.getAttribute('data-copy');
      if (textToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy);
        const label = item.querySelector('.contact-label');
        if (label) {
          const originalText = label.innerText;
          label.innerHTML = '<span style="color: var(--accent-emerald);"><i class="fa-solid fa-check"></i> Copied to Clipboard!</span>';
          setTimeout(() => {
            label.innerText = originalText;
          }, 2000);
        }
      }
    });
  });
}
