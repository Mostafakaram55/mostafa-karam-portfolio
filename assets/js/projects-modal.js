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
  },
  taxi_beirut: {
    title: "Taxi Beirut — Ride-Hailing System (Customer & Agent Apps)",
    tech: ["Flutter", "Dart", "Google Maps SDK", "Firebase Auth", "Firestore", "QR Wallet Top-Up", "iOS & Android", "Clean Architecture"],
    description: "Live ride-hailing system deployed on both Google Play Store and Apple App Store for customer and agent applications. Features real-time pickup/destination route selection with Google Maps, dynamic pricing calculation by vehicle class, agent wallet management, QR code top-up transactions, and FCM alerts.",
    playStoreCustomer: "https://play.google.com/store/apps/details?id=com.taxi.md_soft.taxi_customer_app",
    appStoreCustomer: "https://apps.apple.com/eg/app/%D8%AA%D9%83%D8%B3%D9%8A-%D8%A8%D9%8A%D8%B1%D9%88%D8%AA/id6748995437",
    playStoreAgent: "https://play.google.com/store/apps/details?id=com.mdsoft.taxibeirutagent",
    appStoreAgent: "https://apps.apple.com/eg/app/taxi-beirut-agent/id6760011080",
    icon: "assets/images/taxi_beirut_customer-icon.png",
    screenshots: [
      "assets/images/taxi_beirut_customer-ss-2.png",
      "assets/images/taxi_beirut_customer-ss-3.png",
      "assets/images/taxi_beirut_customer-ss-4.png",
      "assets/images/taxi_beirut_agent-ss-3.png"
    ]
  }
};

let currentModalProjectKey = null;
let currentShotIndex = 0;

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
  const mainImgEl = document.getElementById('gallery-main-img');
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
  if (data.playStoreUser) {
    linksHtml += `<a href="${data.playStoreUser}" target="_blank" rel="noopener" class="btn btn-sm btn-primary"><i class="fa-brands fa-google-play"></i> User App</a>`;
  }
  if (data.playStoreDriver) {
    linksHtml += `<a href="${data.playStoreDriver}" target="_blank" rel="noopener" class="btn btn-sm btn-outline"><i class="fa-brands fa-google-play"></i> Driver App</a>`;
  }
  if (data.playStoreAgent) {
    linksHtml += `<a href="${data.playStoreAgent}" target="_blank" rel="noopener" class="btn btn-sm btn-outline"><i class="fa-brands fa-google-play"></i> Agent App</a>`;
  }
  if (data.playStoreCustomer) {
    linksHtml += `<a href="${data.playStoreCustomer}" target="_blank" rel="noopener" class="btn btn-sm btn-primary"><i class="fa-brands fa-google-play"></i> Customer (Android)</a>`;
  }
  if (data.appStoreCustomer) {
    linksHtml += `<a href="${data.appStoreCustomer}" target="_blank" rel="noopener" class="btn btn-sm btn-secondary"><i class="fa-brands fa-apple"></i> Customer (iOS)</a>`;
  }
  if (data.dashboard) {
    linksHtml += `<a href="${data.dashboard}" target="_blank" rel="noopener" class="btn btn-sm btn-secondary"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>`;
  }

  linksEl.innerHTML = linksHtml;

  // Render Gallery
  mainImgEl.src = data.screenshots[0];
  thumbsContainer.innerHTML = data.screenshots.map((imgSrc, idx) => `
    <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="selectGalleryImage(${idx})">
      <img src="${imgSrc}" alt="Thumbnail ${idx + 1}" />
    </div>
  `).join('');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function selectGalleryImage(idx) {
  const data = projectsData[currentModalProjectKey];
  if (!data || !data.screenshots[idx]) return;

  currentShotIndex = idx;
  document.getElementById('gallery-main-img').src = data.screenshots[idx];

  const thumbs = document.querySelectorAll('#gallery-thumbs .thumb-item');
  thumbs.forEach((t, i) => {
    if (i === idx) t.classList.add('active');
    else t.classList.remove('active');
  });
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
