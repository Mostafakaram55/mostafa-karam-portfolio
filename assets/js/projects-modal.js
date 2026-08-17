/* 
  Projects & Screenshot Lightbox Modal System
  Mostafa Karam Saeed Portfolio
*/

const projectsData = {
  korlen: {
    title: "KORLEN — E-Commerce App (with HTG & Veron clones)",
    tech: ["Flutter", "Dart", "Firebase Auth", "Firestore", "FCM Push", "REST APIs", "Bloc/Cubit", "Clean Architecture", "MVVM"],
    description: "Full-featured e-commerce ecosystem including product catalog browsing, dynamic search & filtering, cart management, and multi-step secure checkout. Features 2 white-label clones (HTG and Veron) built on a shared modular architecture with customized theme assets and store configurations. Real-time order updates and targeted push notifications powered by FCM.",
    playStore: "https://play.google.com/store/apps/details?id=com.mdsoft.korlen&hl=en",
    appStore: "https://apps.apple.com/eg/app/%D9%83%D9%88%D8%B1%D9%84%D9%86/id6758906505",
    dashboard: "https://korlen-test.md-soft.app/",
    icon: "assets/images/korlen-icon.png",
    screenshots: [
      "assets/images/korlen-ss-2.png",
      "assets/images/korlen-ss-3.png",
      "assets/images/korlen-ss-4.png"
    ]
  },
  tok_tok_taxi: {
    title: "Tok Tok Taxi — Delivery & Ride-Hailing Platform",
    tech: ["Flutter", "Dart", "Google Maps SDK", "Firebase", "REST APIs", "WebSockets", "Bluetooth Receipt Printing", "Bloc/Cubit", "MVVM"],
    description: "Complete multi-application ride-hailing and localized delivery ecosystem. Includes separate native Flutter applications for Customers, Drivers, and Agents, alongside a web management dashboard. Integrates live Google Maps GPS trip tracking, dynamic fare calculation, internal thermal receipt printing, and Bluetooth mobile printer integration.",
    playStoreUser: "https://play.google.com/store/apps/details?id=com.mdsoft.tok_tok_taxi_user&hl=ar",
    playStoreDriver: "https://play.google.com/store/apps/details?id=com.mdsoft.tok_tok_taxi_drivers",
    playStoreAgent: "https://play.google.com/store/apps/details?id=com.mdsoft.tok_tok_taxi_agent",
    dashboard: "https://new-toktok-test.md-soft.app/",
    icon: "assets/images/tok_tok_taxi_user-icon.png",
    screenshots: [
      "assets/images/tok_tok_taxi_user-ss-2.png",
      "assets/images/tok_tok_taxi_user-ss-3.png",
      "assets/images/tok_tok_taxi_user-ss-4.png",
      "assets/images/tok_tok_taxi_driver-ss-3.png",
      "assets/images/tok_tok_taxi_agent-ss-3.png"
    ]
  },
  gbghadir: {
    title: "Gb Ghadir — E-Commerce App with Live Chat Support",
    tech: ["Flutter", "Dart", "Firebase", "REST APIs", "WebSockets", "Bloc/Cubit", "Clean Architecture", "WhatsApp API"],
    description: "Comprehensive e-commerce mobile application featuring product catalog discovery, item reviews, cart management, and order checkout. Features real-time technical customer support built directly into the app using custom WebSockets as well as direct WhatsApp chat integration.",
    playStore: "https://play.google.com/store/apps/details?id=com.mdsoft.gbghadir&hl=en",
    icon: "assets/images/gbghadir-icon.png",
    screenshots: [
      "assets/images/gbghadir-ss-2.png",
      "assets/images/gbghadir-ss-3.png",
      "assets/images/gbghadir-ss-4.png"
    ]
  },
  vanote: {
    title: "VA Note — Patient Management & Appointment App",
    tech: ["Flutter", "Dart", "Firebase Firestore", "FCM Push Notifications", "REST APIs", "Bloc/Cubit", "MVVM", "Clean Architecture"],
    description: "Healthcare patient management and clinic scheduling platform. Organizes patient records, medical history, doctor visit notes, and consultation schedules in real time using Firebase Firestore. Sends automated push notifications via FCM to remind patients of upcoming appointments.",
    playStore: "https://play.google.com/store/apps/details?id=com.mdsoft.vanotesclinic",
    dashboard: "https://www.va-note.com/clinic/",
    icon: "assets/images/vanote-icon.png",
    screenshots: [
      "assets/images/vanote-ss-2.png",
      "assets/images/vanote-ss-3.png",
      "assets/images/vanote-ss-4.png"
    ]
  }
};

let currentModalProjectKey = null;
let currentShotIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

function openProjectModal(projectKey) {
  const data = projectsData[projectKey];
  if (!data) return;

  currentModalProjectKey = projectKey;
  currentShotIndex = 0;

  const modal = document.getElementById('project-modal');
  const titleEl = document.getElementById('modal-project-title');
  const descEl = document.getElementById('modal-project-desc');
  const techEl = document.getElementById('modal-project-tech');
  const linksEl = document.getElementById('modal-project-links');
  const thumbsContainer = document.getElementById('gallery-thumbs');

  titleEl.innerText = data.title;
  descEl.innerText = data.description;

  // Render Tech Pills
  techEl.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

  // Render Links
  let linksHtml = '';
  if (data.playStore) {
    linksHtml += `<a href="${data.playStore}" target="_blank" rel="noopener" class="btn btn-sm btn-primary"><i class="fa-brands fa-google-play"></i> Play Store</a>`;
  }
  if (data.appStore) {
    linksHtml += `<a href="${data.appStore}" target="_blank" rel="noopener" class="btn btn-sm btn-secondary"><i class="fa-brands fa-apple"></i> App Store</a>`;
  }
  if (data.playStoreUser) {
    linksHtml += `<a href="${data.playStoreUser}" target="_blank" rel="noopener" class="btn btn-sm btn-primary"><i class="fa-brands fa-google-play"></i> User App</a>`;
  }
  if (data.playStoreDriver) {
    linksHtml += `<a href="${data.playStoreDriver}" target="_blank" rel="noopener" class="btn btn-sm btn-outline"><i class="fa-brands fa-google-play"></i> Driver App</a>`;
  }
  if (data.playStoreAgent) {
    linksHtml += `<a href="${data.playStoreAgent}" target="_blank" rel="noopener" class="btn btn-sm btn-outline"><i class="fa-brands fa-google-play"></i> Agent App</a>`;
  }
  if (data.dashboard) {
    linksHtml += `<a href="${data.dashboard}" target="_blank" rel="noopener" class="btn btn-sm btn-secondary"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>`;
  }

  linksEl.innerHTML = linksHtml;

  // Render Gallery Thumbnails
  thumbsContainer.innerHTML = data.screenshots.map((imgSrc, idx) => `
    <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="selectGalleryImage(${idx})">
      <img src="${imgSrc}" alt="Thumbnail ${idx + 1}" />
    </div>
  `).join('');

  // Preload Images in Background
  data.screenshots.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  updateGalleryState(0, false);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  initGalleryListeners();
}

function selectGalleryImage(idx) {
  if (idx === currentShotIndex) return;
  const data = projectsData[currentModalProjectKey];
  if (!data || !data.screenshots[idx]) return;

  const direction = idx > currentShotIndex ? 1 : -1;
  updateGalleryState(idx, true, direction);
}

function navigateGallery(direction) {
  const data = projectsData[currentModalProjectKey];
  if (!data || !data.screenshots) return;

  let newIndex = currentShotIndex + direction;
  if (newIndex < 0) newIndex = data.screenshots.length - 1;
  if (newIndex >= data.screenshots.length) newIndex = 0;

  updateGalleryState(newIndex, true, direction);
}

function updateGalleryState(newIndex, animate = true, direction = 1) {
  const data = projectsData[currentModalProjectKey];
  if (!data || !data.screenshots[newIndex]) return;

  currentShotIndex = newIndex;
  const mainImgEl = document.getElementById('gallery-main-img');
  const counterEl = document.getElementById('gallery-counter');

  if (counterEl) {
    counterEl.innerText = `${newIndex + 1} / ${data.screenshots.length}`;
  }

  // Active thumb update
  const thumbs = document.querySelectorAll('#gallery-thumbs .thumb-item');
  thumbs.forEach((t, i) => {
    if (i === newIndex) {
      t.classList.add('active');
      t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      t.classList.remove('active');
    }
  });

  if (animate && mainImgEl) {
    mainImgEl.classList.remove('gallery-img-slide-left', 'gallery-img-slide-right');
    
    // Trigger reflow
    void mainImgEl.offsetWidth;

    const animClass = direction > 0 ? 'gallery-img-slide-right' : 'gallery-img-slide-left';
    mainImgEl.classList.add(animClass);

    setTimeout(() => {
      mainImgEl.src = data.screenshots[newIndex];
    }, 150);
  } else if (mainImgEl) {
    mainImgEl.src = data.screenshots[newIndex];
  }
}

function initGalleryListeners() {
  const container = document.getElementById('gallery-container');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');

  if (prevBtn) {
    prevBtn.onclick = function(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      navigateGallery(-1);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = function(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      navigateGallery(1);
    };
  }

  if (!container || container.dataset.listenersAttached) return;
  container.dataset.listenersAttached = 'true';

  // Touch Swipe Handling
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  // Keyboard Arrow Handling
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('project-modal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'ArrowRight') {
      navigateGallery(1);
    } else if (e.key === 'ArrowLeft') {
      navigateGallery(-1);
    } else if (e.key === 'Escape') {
      closeProjectModal();
    }
  });
}

function handleSwipe() {
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > 40) {
    if (diff < 0) {
      navigateGallery(1);
    } else {
      navigateGallery(-1);
    }
  }
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Global window exposure
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.selectGalleryImage = selectGalleryImage;
window.navigateGallery = navigateGallery;
