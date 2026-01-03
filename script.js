// Import fabric data
const fabrics = fabricsData;

// DOM Elements
const grid = document.getElementById('collectionGrid');
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');
const searchClearBtn = document.getElementById('searchClearBtn');
const filterOptions = document.querySelectorAll('.filter-option input');
const fabricSlider = document.getElementById('fabricSlider');
const sliderWrapper = document.getElementById('sliderWrapper');
const sliderClose = document.getElementById('sliderClose');
const sliderProgress = document.getElementById('sliderProgress');
const themeToggle = document.getElementById('themeToggle');

let currentCategory = 'todos';
let searchTerm = '';
let filteredFabrics = [...fabrics];
let currentSlideIndex = 0;
let slidesToShow = [];
let activeFilter = 'category'; // 'category' or 'search' - for mutual exclusion

// Theme Toggle
function toggleTheme() {
  const isDark = document.body.dataset.theme === 'dark';
  document.body.dataset.theme = isDark ? '' : 'dark';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.dataset.theme = 'dark';
}

themeToggle?.addEventListener('click', toggleTheme);

// Update clear button visibility
function updateClearButton() {
  if (searchClearBtn) {
    if (searchInput?.value.trim()) {
      searchClearBtn.classList.add('visible');
    } else {
      searchClearBtn.classList.remove('visible');
    }
  }
}

// Render fabric cards with empty state
function render(list) {
  const t = typeof getCurrentTranslations === 'function' ? getCurrentTranslations() : {};
  if (searchCount) searchCount.textContent = `${list.length} ${t.fabrics || 'tecidos'}`;
  filteredFabrics = list;
  if (!grid) return;

  // Empty state
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">Nenhum tecido encontrado</h3>
        <p class="empty-state-message">Tente ajustar sua busca ou selecionar outra categoria.</p>
        <button class="empty-state-btn" onclick="clearAllFilters()">Ver todos os tecidos</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(f => {
    // Check for saved image
    const savedImageUrl = typeof getFabricImageUrl === 'function' ? getFabricImageUrl(f.id) : null;
    const imageContent = savedImageUrl
      ? `<img src="${savedImageUrl}" alt="${f.name}" class="fabric-image-1x1">`
      : `<span class="fabric-card-placeholder">🧵</span>`;

    return `
      <article class="fabric-card" data-fabric-id="${f.id}" onclick="openSlider(${f.id})">
        <div class="fabric-card-image">
          ${imageContent}
        </div>
        <h3 class="fabric-card-title">${f.name}</h3>
      </article>
    `;
  }).join('');
}

// Clear all filters and show all fabrics
function clearAllFilters() {
  searchTerm = '';
  currentCategory = 'todos';
  activeFilter = 'category';

  if (searchInput) searchInput.value = '';
  updateClearButton();

  // Reset category radio to "todos"
  filterOptions.forEach(opt => {
    if (opt.value === 'todos') opt.checked = true;
  });

  render(fabrics);
}

// Make function global
window.clearAllFilters = clearAllFilters;

// Filter fabrics - Mutual Exclusion: search OR category, never both
function filter() {
  let list = fabrics;

  // Mutual exclusion: use only active filter type
  if (activeFilter === 'search' && searchTerm) {
    // Search by text (ignores category)
    list = list.filter(f =>
      f.name.toLowerCase().includes(searchTerm) ||
      f.desc.toLowerCase().includes(searchTerm) ||
      f.fiber.toLowerCase().includes(searchTerm) ||
      f.tagline.toLowerCase().includes(searchTerm)
    );
  } else if (activeFilter === 'category' && currentCategory !== 'todos') {
    // Filter by category (ignores search)
    list = list.filter(f => f.cat === currentCategory);
  }

  // Preserve scroll position during render to prevent jumping
  const scrollY = window.scrollY;

  // Use requestAnimationFrame for smoother rendering
  requestAnimationFrame(() => {
    render(list);
    // Restore scroll position after render
    window.scrollTo({ top: scrollY, behavior: 'instant' });
  });
}

// Generate slide HTML - Premium Modern Design with i18n
function generateSlideHTML(f, index, total) {
  // Get current translations
  const t = typeof getCurrentTranslations === 'function' ? getCurrentTranslations() : translations?.pt || {};

  // Season translations and classes
  const seasonMap = {
    Spring: t.spring || 'Primavera',
    Summer: t.summer || 'Verão',
    Autumn: t.autumn || 'Outono',
    Winter: t.winter || 'Inverno'
  };
  const seasonClass = { Spring: 'spring', Summer: 'summer', Autumn: 'autumn', Winter: 'winter' };
  const allSeasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

  // Check for saved image
  const savedImageUrl = typeof getFabricImageUrl === 'function' ? getFabricImageUrl(f.id) : null;
  const hasImage = !!savedImageUrl;
  const imageHTML = hasImage
    ? `<img src="${savedImageUrl}" alt="${f.name}" class="slide-fabric-image">`
    : '';
  const placeholderStyle = hasImage ? 'display: none;' : '';

  return `
    <div class="slide" data-index="${index}" data-fabric-id="${f.id}">
      <div class="slide-image-section" onclick="toggleImageZoom(this)">
        <div class="slide-image-container">
          ${imageHTML}
          <span class="slide-image-placeholder" style="${placeholderStyle}">🧵</span>
          
          <button class="slide-zoom-btn" onclick="event.stopPropagation(); toggleImageZoom(this.closest('.slide-image-section'))">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
            </svg>
          </button>
        </div>
        <div class="slide-fabric-badge">${f.label}</div>
        <div class="slide-counter"><strong>${String(index + 1).padStart(2, '0')}</strong> / ${total}</div>
      </div>
      <!-- Admin Upload Button - Below Image -->
      <div class="slide-upload-admin" data-fabric-id="${f.id}">
        <button class="admin-upload-btn" onclick="event.stopPropagation(); handleMediaEditClick(${f.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span>Enviar Foto</span>
        </button>
      </div>
      <div class="slide-content-section">
        <div class="slide-header">
          <div class="slide-origin">${f.orig}</div>
          <h1 class="slide-title">${f.name}</h1>
          <p class="slide-tagline">"${f.tagline}"</p>
        </div>
        
        <div class="tactile-accords">
          <div class="tactile-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            ${t.sensoryCharacteristics || 'Características Sensoriais'}
          </div>
          <div class="accord-item">
            <span class="accord-label">${t.colorIntensity || 'Intensidade de Cor'}</span>
            <div class="accord-bar"><div class="accord-fill color" style="width: ${f.accords.color}%"></div></div>
            <span class="accord-value">${f.accords.color}%</span>
          </div>
          <div class="accord-item">
            <span class="accord-label">${t.touchSoftness || 'Toque e Maciez'}</span>
            <div class="accord-bar"><div class="accord-fill softness" style="width: ${f.accords.softness}%"></div></div>
            <span class="accord-value">${f.accords.softness}%</span>
          </div>
          <div class="accord-item">
            <span class="accord-label">${t.thermalComfort || 'Conforto Térmico'}</span>
            <div class="accord-bar"><div class="accord-fill warmth" style="width: ${f.accords.warmth}%"></div></div>
            <span class="accord-value">${f.accords.warmth}%</span>
          </div>
          <div class="accord-item">
            <span class="accord-label">${t.easyCare || 'Facilidade de Cuidado'}</span>
            <div class="accord-bar"><div class="accord-fill maintenance" style="width: ${100 - f.accords.maintenance}%"></div></div>
            <span class="accord-value">${100 - f.accords.maintenance}%</span>
          </div>
          <div class="accord-item">
            <span class="accord-label">${t.luminosity || 'Luminosidade'}</span>
            <div class="accord-bar"><div class="accord-fill lustre" style="width: ${f.accords.lustre}%"></div></div>
            <span class="accord-value">${f.accords.lustre}%</span>
          </div>
        </div>
        
        <div class="fabric-icons">
          <div class="fabric-icon-item">
            <div class="fabric-icon">🧶</div>
            <div class="fabric-icon-label">${t.composition || 'Composição'}</div>
            <div class="fabric-icon-value">${f.fiber}</div>
          </div>
          <div class="fabric-icon-item">
            <div class="fabric-icon">🪡</div>
            <div class="fabric-icon-label">${t.structure || 'Estrutura'}</div>
            <div class="fabric-icon-value">${f.weave}</div>
          </div>
          <div class="fabric-icon-item">
            <div class="fabric-icon">✨</div>
            <div class="fabric-icon-label">${t.finishing || 'Acabamento'}</div>
            <div class="fabric-icon-value">${f.finish}</div>
          </div>
        </div>
        
        <div class="about-fabric">
          <h3>${t.knowThisFabric || 'Conheça Este Tecido'}</h3>
          <p>${f.desc}</p>
        </div>
        
        <div class="specs-care-grid">
          <div class="specs-section">
            <h4>${t.technicalSheet || '📐 Ficha Técnica'}</h4>
            <div class="spec-row"><span class="spec-label">${t.weight || 'Gramatura'}</span><span class="spec-value">${f.specs.weight}</span></div>
            <div class="spec-row"><span class="spec-label">${t.thickness || 'Espessura'}</span><span class="spec-value">${f.specs.thickness}</span></div>
            <div class="spec-row"><span class="spec-label">${t.transparency || 'Transparência'}</span><span class="spec-value">${f.specs.transparency}</span></div>
            <div class="spec-row"><span class="spec-label">${t.stretch || 'Elasticidade'}</span><span class="spec-value">${f.specs.stretch}</span></div>
          </div>
          <div class="care-section">
            <h4>${t.howToCare || '🧺 Como Cuidar'}</h4>
            <p>${f.care}</p>
          </div>
        </div>
        
        <div class="best-suited">
          <h4>${t.recommendedApps || 'Aplicações Recomendadas'}</h4>
          <div class="suited-tags">
            ${f.suited.map(s => `<span class="suited-tag">${s}</span>`).join('')}
          </div>
        </div>
        
        <div class="seasonality">
          <h4>${t.bestSeason || 'Melhor Época para Uso'}</h4>
          <div class="season-ratings">
            ${getSeasonRatingsHTML(f, allSeasons, seasonMap, seasonClass)}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Generate season ratings HTML with icons
function getSeasonRatingsHTML(f, allSeasons, seasonMap, seasonClass) {
  const seasonIcons = {
    Winter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 9.5L2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2zm0 4.24L13.17 12l4.83 1.17L13.17 14.34L12 19.76L10.83 14.34L6 13.17l4.83-1.17L12 6.24z"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
    Spring: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>`,
    Summer: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.74 5.47C15.1 6.5 16.35 9.03 15.92 11.5c-.17.96-.6 1.87-1.26 2.61l-.05.05-.01.01-.01.01-.01.01a4.47 4.47 0 01-6.82-5.76c1.11-1.76 2.97-2.96 4.98-2.96zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c1.03 0 2.02.2 2.94.55-1.68.58-3.14 1.91-3.82 3.74-.67 1.82-.48 3.89.53 5.51.55.88 1.29 1.59 2.15 2.08-1.93.1-3.86-.78-4.92-2.48-1.66-2.66-.86-6.17 1.8-7.83A5.49 5.49 0 0112 4z"/><circle cx="12" cy="12" r="3"/></svg>`,
    Autumn: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>`
  };

  const seasonColors = {
    Winter: '#4ECDC4',
    Spring: '#95D5B2',
    Summer: '#FF6B6B',
    Autumn: '#F4D35E'
  };

  return allSeasons.map(s => {
    const isRecommended = f.seasons.includes(s);
    const baseRating = isRecommended ? 7 + Math.floor((f.accords.warmth + f.accords.softness) / 50) : 1 + Math.floor(f.accords.warmth / 40);
    const rating = Math.min(10, Math.max(1, baseRating));
    const percentage = rating * 10;

    return `
      <div class="season-card ${isRecommended ? 'active' : ''}">
        <div class="season-icon ${seasonClass[s]}">${seasonIcons[s]}</div>
        <span class="season-name">${seasonMap[s]}</span>
        <div class="season-meter">
          <div class="season-meter-fill" style="width: ${percentage}%; background: ${seasonColors[s]};"></div>
        </div>
      </div>
    `;
  }).join('');
}

// Navigation arrows HTML
function getNavArrowsHTML() {
  return `
    <button class="slider-nav slider-nav-prev" id="sliderNavPrev" aria-label="Anterior">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button class="slider-nav slider-nav-next" id="sliderNavNext" aria-label="Próximo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
    <div class="slide-navigation-info" id="slideNavInfo">
      <span>Tecido</span> <strong id="slideCurrentNum">01</strong> <span>de</span> <strong id="slideTotalNum">120</strong>
    </div>
  `;
}

// Open slider
function openSlider(fabricId) {
  const startIndex = filteredFabrics.findIndex(f => f.id === fabricId);
  if (startIndex === -1) return;

  slidesToShow = filteredFabrics.slice(startIndex);
  currentSlideIndex = 0;

  const slidesHTML = slidesToShow.map((f, i) => generateSlideHTML(f, i, slidesToShow.length)).join('');
  sliderWrapper.innerHTML = slidesHTML;

  // Add navigation arrows
  const existingNav = fabricSlider.querySelectorAll('.slider-nav, .slide-navigation-info');
  existingNav.forEach(el => el.remove());
  fabricSlider.insertAdjacentHTML('beforeend', getNavArrowsHTML());

  // Update progress bar
  sliderProgress.innerHTML = '<div class="slider-progress-bar" style="width: 0%"></div>';

  // Event listeners for navigation
  document.getElementById('sliderNavPrev')?.addEventListener('click', () => navigateSlide(-1));
  document.getElementById('sliderNavNext')?.addEventListener('click', () => navigateSlide(1));

  sliderWrapper.addEventListener('scroll', handleScroll);

  fabricSlider.classList.add('active');
  document.body.style.overflow = 'hidden';

  updateNavInfo();

  // Trigger bar animations for first slide
  setTimeout(() => animateBars(0), 100);
}

function navigateSlide(direction) {
  // Calculate target slide index
  const targetIndex = Math.max(0, Math.min(slidesToShow.length - 1, currentSlideIndex + direction));

  if (targetIndex === currentSlideIndex) return;

  // Get the actual slide element and scroll to it
  const slides = sliderWrapper.querySelectorAll('.slide');
  const targetSlide = slides[targetIndex];

  if (targetSlide) {
    // Calculate exact scroll position based on slide offset
    const targetScrollLeft = targetSlide.offsetLeft;
    sliderWrapper.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
  }
}

function handleScroll() {
  const scrollLeft = sliderWrapper.scrollLeft;
  const slides = sliderWrapper.querySelectorAll('.slide');

  // Find the closest slide based on scroll position
  let newIndex = 0;
  let minDistance = Infinity;

  slides.forEach((slide, index) => {
    const distance = Math.abs(slide.offsetLeft - scrollLeft);
    if (distance < minDistance) {
      minDistance = distance;
      newIndex = index;
    }
  });

  if (newIndex !== currentSlideIndex && newIndex >= 0 && newIndex < slidesToShow.length) {
    currentSlideIndex = newIndex;
    updateNavInfo();
    // Animate bars on slide change with delay for rendering
    animateBars(newIndex);
  }

  updateProgress();
}

// Animate bars function for slide transitions
function animateBars(slideIndex) {
  const slides = sliderWrapper.querySelectorAll('.slide');
  const currentSlide = slides[slideIndex];
  if (!currentSlide) return;

  // Get all bar elements - both accord bars and season meters
  const accordBars = currentSlide.querySelectorAll('.accord-fill');
  const seasonBars = currentSlide.querySelectorAll('.season-meter-fill');
  const allBars = [...accordBars, ...seasonBars];

  // First, reset all bars: remove animation and set to zero
  allBars.forEach(bar => {
    bar.classList.remove('animate');
    bar.style.animation = 'none';
    bar.style.transform = 'scaleX(0)';
  });

  // Force reflow to ensure the reset takes effect
  void currentSlide.offsetWidth;
  void currentSlide.offsetHeight;

  // Trigger animation after a brief delay
  setTimeout(() => {
    allBars.forEach((bar, index) => {
      bar.style.animation = '';
      bar.style.transform = '';
      // Stagger the animation slightly
      bar.style.animationDelay = `${index * 0.08}s`;
      bar.classList.add('animate');
    });
  }, 50);
}

function updateNavInfo() {
  const currentNum = document.getElementById('slideCurrentNum');
  const totalNum = document.getElementById('slideTotalNum');

  if (currentNum) currentNum.textContent = String(currentSlideIndex + 1).padStart(2, '0');
  if (totalNum) totalNum.textContent = slidesToShow.length;
}

function updateProgress() {
  const scrollLeft = sliderWrapper.scrollLeft;
  const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
  const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
  const progressBar = sliderProgress.querySelector('.slider-progress-bar');
  if (progressBar) progressBar.style.width = `${progress}%`;
}

function closeSlider() {
  fabricSlider.classList.remove('active');
  document.body.style.overflow = '';
  sliderWrapper.removeEventListener('scroll', handleScroll);

  // Remove navigation elements
  const navElements = fabricSlider.querySelectorAll('.slider-nav, .slide-navigation-info');
  navElements.forEach(el => el.remove());
}

// Toggle Image Zoom
// Toggle Image Zoom (Pan & Zoom)
function toggleImageZoom(element) {
  if (!element) return;

  element.classList.toggle('zoomed');
  const isZoomed = element.classList.contains('zoomed');
  const img = element.querySelector('.slide-fabric-image') || element.querySelector('img');

  // Handle Pan Logic
  if (isZoomed) {
    element.onmousemove = function (e) {
      if (!img) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    };
  } else {
    element.onmousemove = null;
    if (img) {
      img.style.transformOrigin = 'center center'; // Reset
    }
  }

  // Update zoom button icon
  const btn = element.querySelector('.slide-zoom-btn svg');
  if (btn) {
    if (isZoomed) {
      btn.innerHTML = '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/>';
    } else {
      btn.innerHTML = '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>';
    }
  }
} // End toggleImageZoom


// Make function globally accessible
window.toggleImageZoom = toggleImageZoom;

// Event Listeners

// Category filter - Smart Reset: clears search when category is clicked
filterOptions.forEach(opt => {
  opt.addEventListener('change', () => {
    // Clear search when selecting category
    searchTerm = '';
    if (searchInput) searchInput.value = '';
    updateClearButton();

    // Set active filter and category
    activeFilter = 'category';
    currentCategory = opt.value;
    filter();
  });
});

// Search input - Smart Reset: clears category when typing
searchInput?.addEventListener('input', e => {
  const value = e.target.value.toLowerCase().trim();

  if (value) {
    // Clear category when searching
    activeFilter = 'search';
    searchTerm = value;

    // Visual: uncheck category (keep todos visually selected but inactive)
    filterOptions.forEach(opt => {
      if (opt.value === 'todos') opt.checked = true;
    });
    currentCategory = 'todos';
  } else {
    // If search is cleared, switch back to category mode
    activeFilter = 'category';
    searchTerm = '';
  }

  updateClearButton();
  filter();
});

// Clear button click
searchClearBtn?.addEventListener('click', () => {
  searchTerm = '';
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  updateClearButton();
  activeFilter = 'category';
  filter();
});

sliderClose?.addEventListener('click', closeSlider);

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!fabricSlider.classList.contains('active')) return;

  if (e.key === 'Escape') closeSlider();
  if (e.key === 'ArrowLeft') navigateSlide(-1);
  if (e.key === 'ArrowRight') navigateSlide(1);
});

// ==========================================
// Hero Rotating Text Effect (4 second interval)
// ==========================================
const heroRotatingText = document.getElementById('heroRotatingText');
const rotatingPhrases = [
  'Uma jornada sensorial pela essência do vestuário',
  'Explore texturas que dão vida ao movimento',
  'Descubra a origem nobre e a pureza de cada fibra selecionada',
  'Sinta a suavidade de tramas que abraçam'
];
let currentTextIndex = 0;

function rotateHeroText() {
  if (!heroRotatingText) return;

  heroRotatingText.style.opacity = '0';
  heroRotatingText.style.transform = 'translateY(10px)';

  setTimeout(() => {
    currentTextIndex = (currentTextIndex + 1) % rotatingPhrases.length;
    heroRotatingText.textContent = rotatingPhrases[currentTextIndex];
    heroRotatingText.style.opacity = '1';
    heroRotatingText.style.transform = 'translateY(0)';
  }, 400);
}

// Start text rotation (4 seconds) - infinite loop
setInterval(rotateHeroText, 4000);

// ==========================================
// Brand Slide Effect - GRACEXPRESS to GRACEX
// ==========================================
const brandSlide = document.getElementById('brandSlide');
let isCollapsed = false;

function toggleBrandSlide() {
  if (!brandSlide) return;

  isCollapsed = !isCollapsed;

  if (isCollapsed) {
    // Slide out "PRESS" - keep "GRACEX" visible
    brandSlide.classList.add('collapsed');
  } else {
    // Slide in "PRESS" - show full "GRACEXPRESS"
    brandSlide.classList.remove('collapsed');
  }
}

// Start brand slide effect (every 5 seconds) - 1.3s duration - infinite loop
setInterval(toggleBrandSlide, 5000);

// ==========================================
// Dim Light Effect (10 second interval)
// ==========================================
const heroDimOverlay = document.getElementById('heroDimOverlay');
let isDimmed = false;

function toggleDimLight() {
  if (!heroDimOverlay) return;

  isDimmed = !isDimmed;

  if (isDimmed) {
    heroDimOverlay.classList.add('dimmed');
  } else {
    heroDimOverlay.classList.remove('dimmed');
  }
}

// Start dim light effect (10 seconds) - infinite loop
setInterval(toggleDimLight, 10000);

// ==========================================
function applyTranslations(lang) {
  const t = window.translations?.[lang];
  if (!t) return;

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      el.placeholder = t[key];
    }
  });

  // Update fabric count text
  const fabricCount = document.querySelector('.fabric-count');
  if (fabricCount) {
    const count = fabricCount.textContent.match(/\d+/)?.[0] || '0';
    fabricCount.textContent = `${count} ${t.fabrics || 'tecidos'}`;
  }
}

// Unified language change handler
function changeLanguage(lang) {
  // Save to localStorage
  localStorage.setItem('language', lang);
  localStorage.setItem('lang', lang);

  // Update currentLang in translations.js
  if (typeof window.currentLang !== 'undefined') {
    window.currentLang = lang;
  }

  // Apply translations to page
  applyTranslations(lang);

  // Update document language
  document.documentElement.lang = lang;

  // Sync all selectors
  document.querySelectorAll('#langSelect, .lang-selector select').forEach(select => {
    if (select) select.value = lang;
  });
}

// Listen for language change
document.querySelectorAll('#langSelect, .lang-selector select').forEach(select => {
  select?.addEventListener('change', (e) => {
    changeLanguage(e.target.value);
  });
});

// Apply saved language on load
const savedLang = localStorage.getItem('language') || localStorage.getItem('lang') || 'pt';
document.querySelectorAll('#langSelect, .lang-selector select').forEach(select => {
  if (select) select.value = savedLang;
});
applyTranslations(savedLang);
document.documentElement.lang = savedLang;

// Initialize
document.addEventListener('DOMContentLoaded', () => render(fabrics));

// ==========================================
// Mobile Menu Toggle
// ==========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');

function toggleMobileMenu() {
  mobileNavOverlay?.classList.toggle('active');

  // Toggle hamburger icon animation
  if (mobileMenuBtn) {
    const isOpen = mobileNavOverlay?.classList.contains('active');
    if (isOpen) {
      mobileMenuBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      `;
    } else {
      mobileMenuBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      `;
    }
  }
}

mobileMenuBtn?.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
mobileNavOverlay?.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNavOverlay.classList.remove('active');
    if (mobileMenuBtn) {
      mobileMenuBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      `;
    }
  });
});

// Close mobile menu on escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNavOverlay?.classList.contains('active')) {
    toggleMobileMenu();
  }
});
