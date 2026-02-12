/**
 * Hero Section Admin Manager
 * Handles:
 * 1. Injecting Edit Buttons when in Admin Mode
 * 2. Managing the Edit Modal
 * 3. Uploading images to Cloudinary
 * 4. Saving Slide config to localStorage
 */
(function () {
    const STORAGE_KEY = 'HERO_SLIDES_V1';
    const SLIDER_SELECTOR = '.hero-slider';

    // Default Configuration (mirrors initial HTML)
    const DEFAULT_SLIDES = [
        { id: 1, image: 'hero-slide-1.png', link: '#', title: 'MODA FESTA' },
        { id: 2, image: 'hero-slide-2.jpg', link: '#', title: 'ALFAIATARIA' },
        { id: 3, image: 'hero-slide-3.png', link: '#', title: 'COLEÇÃO VERÃO' },
        { id: 4, image: 'hero-slide-4.png', link: '#', title: 'NOVIDADES' }
    ];

    // Initialize
    function init() {
        if (localStorage.getItem('isAdminMode') === 'true') {
            injectAdminUI();
            setupAdminEventListeners();
        }

        // Always try to load custom slides on boot to override HTML if exists
        applyStoredSlides();
    }

    // --- Data Management ---
    function getSlides() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_SLIDES;
    }

    function saveSlides(slides) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
        applyStoredSlides(); // Re-render
    }

    // --- Rendering ---
    function applyStoredSlides() {
        const slides = getSlides();
        const sliderContainer = document.querySelector(SLIDER_SELECTOR);
        const indicatorsContainer = document.querySelector('.hero-indicators');

        if (!sliderContainer || !indicatorsContainer) return;

        // Rebuild Slides
        sliderContainer.innerHTML = '';
        indicatorsContainer.innerHTML = '';

        slides.forEach((slide, index) => {
            // Create Slide Div
            const slideDiv = document.createElement('div');
            slideDiv.className = `hero-slide ${index === 0 ? 'active' : ''}`;
            slideDiv.dataset.id = slide.id;

            // Background Layer
            const bgDiv = document.createElement('div');
            bgDiv.className = 'hero-slide-bg';
            bgDiv.style.backgroundImage = `url('${slide.image}')`;

            // Add Link Behavior if link exists
            if (slide.link && slide.link !== '#') {
                bgDiv.style.cursor = 'pointer';
                bgDiv.onclick = (e) => {
                    // Prevent navigation if clicking admin controls
                    if (e.target.closest('.admin-edit-btn')) return;
                    window.location.href = slide.link;
                };
            }

            slideDiv.appendChild(bgDiv);
            sliderContainer.appendChild(slideDiv);

            // Create Indicator
            const indicator = document.createElement('span');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.slide = index;
            indicatorsContainer.appendChild(indicator);
        });

        // Re-inject Admin UI if needed because we wiped the DOM
        if (localStorage.getItem('isAdminMode') === 'true') {
            injectAdminUI();
        }

        // We need to re-initialize the main slider logic because DOM changed
        // Use a custom event to tell hero-slider.js to re-bind
        window.dispatchEvent(new CustomEvent('heroSlidesUpdated'));
    }

    // --- Admin UI ---
    function injectAdminUI() {
        // 1. Add Edit Buttons to each slide
        const slides = document.querySelectorAll('.hero-slide');
        slides.forEach((slide, index) => {
            if (slide.querySelector('.admin-edit-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'admin-edit-btn';
            btn.innerHTML = '✏️ Editar Slide';
            btn.onclick = (e) => {
                e.stopPropagation();
                openEditModal(index);
            };

            // Style locally for now, can move to CSS
            Object.assign(btn.style, {
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: '100',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                border: '1px solid white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
            });

            slide.appendChild(btn);
        });

        // 2. Inject Modal if not exists
        if (!document.getElementById('heroAdminModal')) {
            const modalHTML = `
                <div id="heroAdminModal" class="admin-modal">
                    <div class="admin-modal-content" style="background:white; padding:30px; border-radius:8px; width:90%; max-width:500px; position:relative;">
                        <button onclick="document.getElementById('heroAdminModal').classList.remove('active')" class="admin-close">&times;</button>
                        <h2>Editar Slide</h2>
                        
                        <div class="form-group" style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-weight:bold;">Imagem do Slide</label>
                            
                            <input type="file" id="heroSlideUpload" accept="image/*" style="margin-bottom:10px;">
                            <p style="font-size:12px; color:#666;">Ou use URL externa:</p>
                            <input type="text" id="heroSlideImage" placeholder="https://..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                        </div>

                        <div class="form-group" style="margin-bottom:20px;">
                            <label style="display:block; margin-bottom:5px; font-weight:bold;">Link de Redirecionamento</label>
                            <input type="text" id="heroSlideLink" placeholder="https://..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                            <p style="font-size:12px; color:#666;">Deixe como # para sem link.</p>
                        </div>

                        <div style="display:flex; justify-content:end; gap:10px;">
                            <button id="heroSaveBtn" style="background:black; color:white; border:none; padding:10px 20px; border-radius:4px; cursor:pointer;">Salvar Alterações</button>
                        </div>

                        <div id="uploadStatus" style="margin-top:10px; font-size:12px; color:blue; display:none;">Fazendo upload...</div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    // --- Modal Logic ---
    let currentEditIndex = -1;

    function openEditModal(index) {
        currentEditIndex = index;
        const slides = getSlides();
        const slide = slides[index];

        document.getElementById('heroSlideImage').value = slide.image;
        document.getElementById('heroSlideLink').value = slide.link;
        document.getElementById('heroAdminModal').classList.add('active');
        document.getElementById('uploadStatus').style.display = 'none';

        // Set up Save Button
        document.getElementById('heroSaveBtn').onclick = handleSave;

        // Set up File Upload
        document.getElementById('heroSlideUpload').onchange = handleFileUpload;
    }

    async function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const status = document.getElementById('uploadStatus');
        status.style.display = 'block';
        status.innerText = 'Enviando imagem para Cloudinary...';

        try {
            // Use existing Cloudinary Service
            if (window.CloudinaryService) {
                // Generate a unique ID for the slide image
                const fabricId = `hero-slide-${Date.now()}`;
                const result = await window.CloudinaryService.uploadImage(file, fabricId);

                document.getElementById('heroSlideImage').value = result.url;
                status.innerText = '✅ Upload concluído!';
                status.style.color = 'green';
            } else {
                status.innerText = '❌ Erro: Serviço de Upload não encontrado.';
                status.style.color = 'red';
            }
        } catch (error) {
            console.error(error);
            status.innerText = '❌ Falha no upload.';
            status.style.color = 'red';
        }
    }

    function handleSave() {
        const slides = getSlides();

        slides[currentEditIndex] = {
            ...slides[currentEditIndex],
            image: document.getElementById('heroSlideImage').value,
            link: document.getElementById('heroSlideLink').value
        };

        saveSlides(slides);
        document.getElementById('heroAdminModal').classList.remove('active');
        alert('Slide atualizado com sucesso!');
    }

    function setupAdminEventListeners() {
        // Listen for admin mode toggles
        const observer = new MutationObserver(() => {
            if (document.body.classList.contains('edit-mode-active')) {
                injectAdminUI();
            }
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
