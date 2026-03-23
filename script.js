gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const appData = {
  featuredCalculators: [
    {
      key: "giganet",
      type: "Internet",
      badge: "Główne narzędzie",
      title: "GigaNET",
      desc: "Kalkulator oferty internetowej dla zespołu sprzedażowego i obsługi klienta. Najszybsza ścieżka wejścia do pracy na ofercie solo.",
      link: "https://multiplay-pages.github.io/giganet_kalkulator/",
      cta: "Otwórz kalkulator",
      meta: "Najczęściej używany kalkulator internetowy",
      tags: ["Internet", "Sprzedaż", "BOK", "Nowy / obecny klient"],
      image: "assets/previews/giganet-preview.png"
    },
    {
      key: "gigabox",
      type: "Pakiety + TV",
      badge: "Główne narzędzie",
      title: "GigaBOX",
      desc: "Kalkulator pakietów z TV i dodatkami. Lepszy do ofert łączonych, upsellu, konfiguracji premium i rozmów o wariantach z telewizją.",
      link: "https://multiplay-pages.github.io/gigabox_kalkulator/",
      cta: "Otwórz kalkulator",
      meta: "Pakiety internet + TV + dodatki",
      tags: ["Pakiety", "TV", "Upsell", "Dodatki premium"],
      image: "assets/previews/gigabox-preview.png"
    }
  ],

  quickLinks: [
    {
      title: "Sandbox",
      desc: "Testy UI i modułów",
      link: "https://multiplay-pages.github.io/test/index2.html"
    },
    {
      title: "GitHub Pages",
      desc: "Repozytoria i publikacje",
      link: "https://github.com/multiplay-pages"
    }
  ],

  calculators: [
    {
      index: "03",
      title: "Wersja testowa / sandbox",
      desc: "Miejsce na testy nowego UI, modułów promocyjnych i eksperymentów przed wdrożeniem.",
      status: "beta",
      meta: "Środowisko robocze",
      link: "https://multiplay-pages.github.io/test/index2.html",
      cta: "Otwórz test",
      tags: ["Testy", "UI", "Eksperymenty"]
    },
    {
      index: "04",
      title: "Nowy kalkulator",
      desc: "Rezerwowe miejsce pod kolejny konfigurator, np. B2B, promocje albo warianty specjalne.",
      status: "soon",
      meta: "Do uzupełnienia",
      link: "#",
      cta: "Dodaj link",
      tags: ["Nowe", "Rozwój"]
    },
    {
      index: "05",
      title: "Kalkulator pomocniczy",
      desc: "Blok pod narzędzie wspierające pracę BOK, techniki lub ofert specjalnych.",
      status: "soon",
      meta: "Placeholder",
      link: "#",
      cta: "Dodaj link",
      tags: ["Support", "BOK"]
    },
    {
      index: "06",
      title: "Kalkulator dedykowany",
      desc: "Miejsce na przyszły wariant narzędzia z logiką dla konkretnych promocji lub kanału sprzedaży.",
      status: "soon",
      meta: "Placeholder",
      link: "#",
      cta: "Dodaj link",
      tags: ["Dedykowane", "Kanały"]
    }
  ],

  tools: [
    {
      index: "01",
      title: "Google My Maps",
      desc: "Skrót do map roboczych, adresów, wizualizacji i operacyjnych warstw terenowych.",
      status: "beta",
      meta: "Podmień link",
      link: "#",
      cta: "Dodaj link",
      tags: ["Mapy", "Adresy", "GIS"]
    },
    {
      index: "02",
      title: "Repozytoria GitHub Pages",
      desc: "Dostęp do repo z kalkulatorami i stronami roboczymi, np. do aktualizacji layoutu i cen.",
      status: "live",
      meta: "GitHub / Pages",
      link: "https://github.com/multiplay-pages",
      cta: "Otwórz repo",
      tags: ["GitHub", "Kod", "Publikacja"]
    },
    {
      index: "03",
      title: "Power Automate / SharePoint",
      desc: "Miejsce na skróty do flow, list, dashboardów i formularzy operacyjnych.",
      status: "soon",
      meta: "Podmień link",
      link: "#",
      cta: "Dodaj link",
      tags: ["Automatyzacja", "SharePoint"]
    }
  ],

  resources: [
    {
      index: "01",
      title: "Ofertówki i cenniki",
      desc: "Sekcja na aktualne dokumenty sprzedażowe, warianty ofert i materiały dla pracowników.",
      status: "soon",
      meta: "Folder / wiki",
      link: "#",
      cta: "Dodaj link",
      tags: ["Oferta", "Cenniki"]
    },
    {
      index: "02",
      title: "Procedury i instrukcje",
      desc: "Miejsce na checklisty, SOP-y, instrukcje pracy i dokumentację wdrożeniową.",
      status: "soon",
      meta: "Folder / wiki",
      link: "#",
      cta: "Dodaj link",
      tags: ["Procedury", "Instrukcje"]
    },
    {
      index: "03",
      title: "Materiały robocze",
      desc: "Sekcja pod pliki pomocnicze, testy, briefy, dokumenty tymczasowe i wersje robocze.",
      status: "soon",
      meta: "Folder / wiki",
      link: "#",
      cta: "Dodaj link",
      tags: ["Robocze", "Wersje"]
    }
  ]
};

function getStatusClass(status) {
  if (status === "live") return "status-live";
  if (status === "beta") return "status-beta";
  return "status-soon";
}

function getStatusLabel(status) {
  if (status === "live") return "Aktywne";
  if (status === "beta") return "Test / beta";
  return "W przygotowaniu";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createPreviewMarkup(item) {
  const safeTitle = escapeHtml(item.title);
  const imagePath = item.image ? escapeHtml(item.image) : "";

  const imageMarkup = imagePath
    ? `
      <img
        class="preview-image"
        src="${imagePath}"
        alt="Podgląd interfejsu kalkulatora ${safeTitle}"
        loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.hidden=false;"
      />
      <div class="preview-placeholder" hidden>
        <div class="placeholder-row">
          <div class="placeholder-line w-80"></div>
          <div class="placeholder-line w-44"></div>
        </div>
        <div class="placeholder-cards">
          <div class="placeholder-card"></div>
          <div class="placeholder-card"></div>
        </div>
        <div class="placeholder-row">
          <div class="placeholder-line w-66"></div>
          <div class="placeholder-line w-52"></div>
          <div class="placeholder-line w-36"></div>
        </div>
      </div>
    `
    : `
      <div class="preview-placeholder">
        <div class="placeholder-row">
          <div class="placeholder-line w-80"></div>
          <div class="placeholder-line w-44"></div>
        </div>
        <div class="placeholder-cards">
          <div class="placeholder-card"></div>
          <div class="placeholder-card"></div>
        </div>
        <div class="placeholder-row">
          <div class="placeholder-line w-66"></div>
          <div class="placeholder-line w-52"></div>
          <div class="placeholder-line w-36"></div>
        </div>
      </div>
    `;

  return `
    <div class="preview-frame" aria-hidden="true">
      <div class="preview-bar">
        <span class="preview-dot red"></span>
        <span class="preview-dot yellow"></span>
        <span class="preview-dot green"></span>
      </div>
      <div class="preview-canvas">
        ${imageMarkup}
      </div>
    </div>
  `;
}

function createFeaturedCard(item) {
  const article = document.createElement("article");
  article.className = "featured-card";

  const tagsHtml = (item.tags || [])
    .map((tag) => `<span class="featured-tag">${escapeHtml(tag)}</span>`)
    .join("");

  article.innerHTML = `
    <a
      class="featured-card-link"
      href="${escapeHtml(item.link)}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="featured-card-content">
        <div class="featured-topline">
          <span class="featured-badge">${escapeHtml(item.badge)}</span>
          <span class="featured-type">${escapeHtml(item.type)}</span>
        </div>

        <h3 class="featured-title">${escapeHtml(item.title)}</h3>
        <p class="featured-desc">${escapeHtml(item.desc)}</p>

        <div class="featured-tags">
          ${tagsHtml}
        </div>

        <div class="featured-footer">
          <span class="featured-cta">${escapeHtml(item.cta)} →</span>
          <span class="featured-meta">${escapeHtml(item.meta)}</span>
        </div>
      </div>

      <div class="preview-shell">
        ${createPreviewMarkup(item)}
      </div>
    </a>
  `;

  return article;
}

function createQuickLink(item) {
  const link = document.createElement("a");
  link.className = "quick-link-compact";
  link.href = item.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  link.innerHTML = `
    <strong>${escapeHtml(item.title)}</strong>
    <small>${escapeHtml(item.desc)}</small>
  `;

  return link;
}

function createCard(item) {
  const article = document.createElement("article");
  const isPlaceholder = item.link === "#";

  article.className = `tool-card ${isPlaceholder ? "placeholder-card-item" : ""}`;

  const tagsHtml = (item.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  article.innerHTML = `
    <div class="card-top">
      <div class="card-index">${escapeHtml(item.index)}</div>
      <span class="card-status ${getStatusClass(item.status)}">${getStatusLabel(item.status)}</span>
    </div>

    <div>
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <p class="card-desc" style="margin-top: 10px;">${escapeHtml(item.desc)}</p>
    </div>

    <div class="card-tags">${tagsHtml}</div>

    <div class="card-footer">
      <a
        class="card-link ${isPlaceholder ? "secondary" : ""}"
        href="${escapeHtml(item.link)}"
        ${isPlaceholder ? "" : 'target="_blank" rel="noopener noreferrer"'}
      >
        ${escapeHtml(item.cta)}
      </a>
      <span class="card-meta">${escapeHtml(item.meta)}</span>
    </div>
  `;

  return article;
}

function renderFeaturedCalculators() {
  const heroGrid = document.getElementById("featured-calculators");
  const sectionGrid = document.getElementById("priority-calculators-grid");
  const quickLinks = document.getElementById("quick-links-compact");

  if (heroGrid) {
    heroGrid.innerHTML = "";
    appData.featuredCalculators.forEach((item) => {
      heroGrid.appendChild(createFeaturedCard(item));
    });
  }

  if (sectionGrid) {
    sectionGrid.innerHTML = "";
    appData.featuredCalculators.forEach((item) => {
      sectionGrid.appendChild(createFeaturedCard(item));
    });
  }

  if (quickLinks) {
    quickLinks.innerHTML = "";
    appData.quickLinks.forEach((item) => {
      quickLinks.appendChild(createQuickLink(item));
    });
  }
}

function renderSection(gridId, items) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = "";
  items.forEach((item) => grid.appendChild(createCard(item)));
}

function initNavigation() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      lenis.scrollTo(target, {
        offset: -92,
        duration: 1.02
      });
    });
  });
}

function initAnimations() {
  gsap.from(".hero-main, .hero-side", {
    y: 24,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.08
  });

  gsap.from(".featured-card", {
    y: 18,
    opacity: 0,
    duration: 0.72,
    ease: "power2.out",
    stagger: 0.08,
    delay: 0.12
  });

  gsap.utils.toArray(".section-shell").forEach((section) => {
    gsap.from(section, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 86%"
      }
    });
  });
}

function initApp() {
  renderFeaturedCalculators();
  renderSection("calculators-grid", appData.calculators);
  renderSection("tools-grid", appData.tools);
  renderSection("resources-grid", appData.resources);
  initNavigation();
  initAnimations();
  ScrollTrigger.refresh();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
