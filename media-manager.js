// ==========================================
// MEDIA MANAGER & ADMIN SYSTEM
// Handles Image Crop (1:1), Video Links, and Admin Authentication
// Uses IndexedDB for limitless image storage
// ==========================================

// Global State
let fabricImages = {};
let fabricVideos = JSON.parse(localStorage.getItem('fabricVideos') || '{}');
let cropper = null;
let currentEditFabricId = null;
let isAdminMode = false;
let db = null;

// Backup for discard functionality
let fabricImagesBackup = {};
let fabricVideosBackup = JSON.parse(localStorage.getItem('fabricVideos') || '{}');

// ==========================================
// IndexedDB Setup - Limitless Storage
// ==========================================
const DB_NAME = 'GraceXpressMedia';
const DB_VERSION = 1;
const STORE_NAME = 'fabricImages';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

async function loadImagesFromDB() {
    if (!db) await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const images = request.result;
            images.forEach(img => {
                fabricImages[img.id] = { url: img.url, uploadedAt: img.uploadedAt };
            });
            fabricImagesBackup = JSON.parse(JSON.stringify(fabricImages));
            resolve(fabricImages);
        };
        request.onerror = () => reject(request.error);
    });
}

async function saveImageToDB(fabricId, imageData) {
    if (!db) await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({
            id: fabricId,
            url: imageData.url,
            uploadedAt: imageData.uploadedAt
        });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function deleteImageFromDB(fabricId) {
    if (!db) await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(fabricId);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function clearAllImagesFromDB() {
    if (!db) await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Auth handled by js/auth-service.js

// Helper: Get fabric image URL (checks local cache first, then Cloudinary)
function getFabricImageUrl(fabricId) {
    // First check local cache
    if (fabricImages[fabricId]?.url) {
        return fabricImages[fabricId].url;
    }
    // Fallback: use Cloudinary direct URL (tries current site's folder first)
    if (typeof CloudinaryService !== 'undefined') {
        return CloudinaryService.getImageUrl(fabricId);
    }
    return null;
}
window.getFabricImageUrl = getFabricImageUrl;

// Helper: Get alternative image URL (tries the other folder if first one fails)
function getFabricImageUrlAlt(fabricId) {
    if (typeof CloudinaryService === 'undefined') return null;

    const currentFolder = CloudinaryService.getCurrentFolder();
    const otherFolder = currentFolder === CloudinaryService.folders.com
        ? CloudinaryService.folders.comBr
        : CloudinaryService.folders.com;

    return CloudinaryService.getImageUrlFromFolder(fabricId, otherFolder);
}
window.getFabricImageUrlAlt = getFabricImageUrlAlt;

// ==========================================
// Admin Authentication
// ==========================================
function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('active');
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('active');
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPassword').value;

    try {
        const user = await AuthService.login(email, pass);
        if (user) {
            isAdminMode = true;
            enableEditMode();
            closeAdminLogin();
            showNotification('Login realizado com sucesso! Modo de edição ativo.', 'success');
        }
    } catch (error) {
        showNotification('Erro ao fazer login: ' + error.message, 'error');
    }
}

function resetAdminPassword() {
    const email = document.getElementById('adminEmail').value;
    if (email) {
        showNotification('Para redefinir sua senha, solicite através do painel do Supabase.', 'info');
    } else {
        showNotification('Digite seu e-mail para instruções.', 'info');
    }
}

function enableEditMode() {
    document.body.classList.add('edit-mode-active');
    // Create backup for discard functionality
    fabricImagesBackup = JSON.parse(JSON.stringify(fabricImages));
    fabricVideosBackup = JSON.parse(JSON.stringify(fabricVideos));
    createAdminToolbar();
    updateAdminUI();

    // Trigger portfolio re-render if we are on that page to show edit badges
    if (typeof renderPortfolio === 'function') {
        renderPortfolio();
    }
}

function updateAdminUI() {
    // Add visual cues for editable elements if in admin mode
    if (isAdminMode) {
        document.body.classList.add('edit-mode-active');
        injectHeroEditButtons(); // Ensure hero buttons are present
    }
}

// ==========================================
// Admin Toolbar
// ==========================================
function createAdminToolbar() {
    if (document.getElementById('adminToolbar')) return;

    // Get translations
    const t = typeof getCurrentTranslations === 'function' ? getCurrentTranslations() : (window.translations?.pt || {});

    const toolbar = document.createElement('div');
    toolbar.id = 'adminToolbar';
    toolbar.className = 'admin-toolbar';
    toolbar.innerHTML = `
        <div class="admin-toolbar-content">
            <span class="admin-toolbar-label" data-i18n="adminMode">🔐 ${t.adminMode || 'Modo Admin'}</span>
            <div class="admin-toolbar-buttons">
                <button class="admin-toolbar-btn save" onclick="saveAdminChanges()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    <span data-i18n="save">${t.save || 'Salvar'}</span>
                </button>
                <button class="admin-toolbar-btn discard" onclick="discardAdminChanges()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    <span data-i18n="discard">${t.discard || 'Descartar'}</span>
                </button>
                <button class="admin-toolbar-btn exit" onclick="exitAdminMode()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span data-i18n="exit">${t.exit || 'Sair'}</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(toolbar);
}

function removeAdminToolbar() {
    const toolbar = document.getElementById('adminToolbar');
    if (toolbar) toolbar.remove();
}

function saveAdminChanges() {
    // Changes are already saved to localStorage on each upload
    // Update backup to current state
    fabricImagesBackup = JSON.parse(JSON.stringify(fabricImages));
    fabricVideosBackup = JSON.parse(JSON.stringify(fabricVideos));
    showNotification('Alterações salvas com sucesso!', 'success');
}

async function discardAdminChanges() {
    if (confirm('Descartar todas as alterações feitas nesta sessão?')) {
        // Clear all from IndexedDB and restore backup
        await clearAllImagesFromDB();

        // Restore from backup
        Object.keys(fabricImages).forEach(key => delete fabricImages[key]);
        for (const key of Object.keys(fabricImagesBackup)) {
            fabricImages[key] = fabricImagesBackup[key];
            await saveImageToDB(key, fabricImagesBackup[key]);
        }

        Object.keys(fabricVideos).forEach(key => delete fabricVideos[key]);
        Object.keys(fabricVideosBackup).forEach(key => {
            fabricVideos[key] = fabricVideosBackup[key];
        });
        localStorage.setItem('fabricVideos', JSON.stringify(fabricVideos));

        // Reload to refresh all views
        location.reload();
    }
}

async function exitAdminMode() {
    await AuthService.logout();
    isAdminMode = false;
    document.body.classList.remove('edit-mode-active');
    removeAdminToolbar();
}

// ==========================================
// Edit Trigger (Click Handler)
// ==========================================
function handleMediaEditClick(fabricId) {
    if (!isAdminMode) return; // Only allow edit if admin

    currentEditFabricId = fabricId;
    ensureEditModalExists();

    // Reset modal state
    const modal = document.getElementById('mediaEditModal');
    modal.classList.add('active');

    // Load existing data
    const currentVideo = fabricVideos[fabricId] || '';
    document.getElementById('videoUrlInput').value = currentVideo;
}

// ==========================================
// Crop System (Image)
// ==========================================
function onFabricImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showNotification('Formato inválido. Use JPG, PNG ou WebP.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        // Check if Hero
        let aspectRatio = 1; // Default square for fabrics
        if (currentEditFabricId && currentEditFabricId.startsWith('hero_')) {
            aspectRatio = NaN; // Free crop for Hero
        }
        initCropper(e.target.result, aspectRatio);
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
}

function initCropper(imageSrc, aspectRatio = 1) {
    const image = document.getElementById('cropImageTarget');
    image.src = imageSrc;
    image.style.display = 'block';

    // Hide video section during crop
    document.getElementById('editVideoSection').style.display = 'none';
    document.getElementById('cropSection').style.display = 'block';

    if (cropper) cropper.destroy();

    cropper = new Cropper(image, {
        aspectRatio: aspectRatio,
        viewMode: 1,
        autoCropArea: 0.9,
        dragMode: 'move',
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
    });
}

async function confirmCrop() {
    if (!cropper || !currentEditFabricId) return;

    // Determine Output Size
    let outputOptions = {
        width: 800,
        height: 800,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    };

    if (currentEditFabricId.startsWith('hero_')) {
        outputOptions = {
            width: 1920, // Full HD width
            // height auto based on crop
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        };
    }

    const canvas = cropper.getCroppedCanvas(outputOptions);

    let finalUrl = null;
    let finalPublicId = null;

    try {
        // Attempt Cloudinary Upload
        const cloudinaryResult = await CloudinaryService.uploadImage(blob, currentEditFabricId);
        finalUrl = cloudinaryResult.url;
        finalPublicId = cloudinaryResult.publicId;
        showNotification('Imagem enviada para a nuvem com sucesso!', 'success');
    } catch (uploadError) {
        console.warn('Cloudinary upload failed, falling back to local storage:', uploadError);
        showNotification('Conexão falhou. Salvando localmente...', 'warning');

        // Fallback: Convert Blob to Data URI
        finalUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
        finalPublicId = `local_${Date.now()}`;
    }

    // Save URL (Cloudinary or Local) to memory and IndexedDB
    const imageData = {
        url: finalUrl,
        publicId: finalPublicId,
        uploadedAt: new Date().toISOString()
    };
    fabricImages[currentEditFabricId] = imageData;
    await saveImageToDB(currentEditFabricId, imageData);

    // Convert to visual update
    if (currentEditFabricId.startsWith('hero_')) {
        updateHeroMedia(currentEditFabricId);
    } else {
        updateFabricMedia(currentEditFabricId);
    }

    closeEditModal();
    if (finalPublicId.startsWith('local_')) {
        showNotification('Imagem salva apenas neste dispositivo!', 'warning');
    }

} catch (e) {
    console.error(e);
    showNotification('Erro crítico ao salvar imagem: ' + e.message, 'error');
}
}

// ==========================================
// Video Handling
// ==========================================
function saveVideoLink() {
    if (!currentEditFabricId) return;

    const videoUrl = document.getElementById('videoUrlInput').value.trim();

    if (videoUrl) {
        fabricVideos[currentEditFabricId] = videoUrl;
        localStorage.setItem('fabricVideos', JSON.stringify(fabricVideos));
        showNotification('Link de vídeo salvo!', 'success');
    } else {
        // If empty, remove video
        delete fabricVideos[currentEditFabricId];
        localStorage.setItem('fabricVideos', JSON.stringify(fabricVideos));
        showNotification('Vídeo removido.', 'info');
    }

    updateFabricMedia(currentEditFabricId);
    closeEditModal();
}

async function deleteMedia() {
    if (!currentEditFabricId) return;

    if (confirm('Tem certeza que deseja excluir a imagem e o vídeo deste item?')) {
        delete fabricImages[currentEditFabricId];
        delete fabricVideos[currentEditFabricId];
        await deleteImageFromDB(currentEditFabricId);
        localStorage.setItem('fabricVideos', JSON.stringify(fabricVideos));

        updateFabricMedia(currentEditFabricId);
        showNotification('Mídia excluída.', 'success');
        closeEditModal();
    }
}

// ==========================================
// UI Updates (Mirroring)
// ==========================================
function updateFabricMedia(fabricId) {
    const imageUrl = fabricImages[fabricId]?.url;
    const videoUrl = fabricVideos[fabricId];

    // 1. Update Grid Card
    const gridCard = document.querySelector(`.fabric-card[data-fabric-id="${fabricId}"]`);
    if (gridCard) {
        const imgContainer = gridCard.querySelector('.fabric-card-image');
        if (imgContainer) {
            if (imageUrl) {
                imgContainer.innerHTML = `<img src="${imageUrl}" class="fabric-image-1x1">`;
            } else {
                imgContainer.innerHTML = `<span class="fabric-card-placeholder">🧵</span>`;
            }

            // Add edit badge if admin
            if (isAdminMode && !gridCard.querySelector('.admin-edit-badge')) {
                const badge = document.createElement('div');
                badge.className = 'admin-edit-badge';
                badge.innerHTML = 'EDIT';
                gridCard.appendChild(badge);
            }
        }
    }

    // 2. Update Slider Slide
    const slide = document.querySelector(`.slide[data-fabric-id="${fabricId}"]`);
    if (slide) {
        const imgContainer = slide.querySelector('.slide-image-container');

        // Image handling
        let img = slide.querySelector('.slide-fabric-image');
        let placeholder = slide.querySelector('.slide-image-placeholder');

        if (imageUrl) {
            if (!img) {
                img = document.createElement('img');
                img.className = 'slide-fabric-image';
                imgContainer.insertBefore(img, imgContainer.firstChild);
            }
            img.src = imageUrl;
            if (placeholder) placeholder.style.display = 'none';
        } else {
            if (img) img.remove();
            if (placeholder) placeholder.style.display = 'block';
        }

        // Remove old upload zone if present (replaced by modal trigger)
        const oldZone = slide.querySelector('.image-upload-zone');
        if (oldZone) oldZone.remove();

        // Add edit click handler to image area
        const touchArea = slide.querySelector('.slide-image-section');
        if (touchArea) {
            touchArea.onclick = (e) => {
                if (isAdminMode) {
                    e.stopPropagation();
                    handleMediaEditClick(fabricId);
                } else {
                    if (window.toggleImageZoom) window.toggleImageZoom(touchArea);
                }
            };
        }
    }
}

// ==========================================
// Modal Infrastructure
// ==========================================
function ensureEditModalExists() {
    if (document.getElementById('mediaEditModal')) return;

    // Get current translations or fallback to PT
    const t = typeof getCurrentTranslations === 'function' ? getCurrentTranslations() : (window.translations?.pt || {});

    const modal = document.createElement('div');
    modal.id = 'mediaEditModal';
    modal.className = 'crop-modal'; // Re-use styling
    modal.innerHTML = `
    <div class="crop-modal-content">
      <div class="crop-header">
        <h3 data-i18n="manageMedia">${t.manageMedia || 'Gerenciar Mídia'}</h3>
        <button class="crop-close-btn" onclick="closeEditModal()">×</button>
      </div>
      
      <div class="crop-body" style="background: var(--color-bg); display: block; overflow-y: auto; padding: 20px;">
        
        <!-- Crop Section (Initially Hidden) -->
        <div id="cropSection" style="display:none; text-align: center;">
            <div style="max-height: 400px; overflow: hidden; margin-bottom: 20px;">
                <img id="cropImageTarget" style="max-width: 100%;">
            </div>
            <button class="btn-confirm" onclick="confirmCrop()" style="width: 100%; justify-content: center;" data-i18n="confirmCrop">
                ${t.confirmCrop || 'Confirmar Recorte (1:1)'}
            </button>
            <button class="btn-cancel" onclick="cancelCrop()" style="width: 100%; margin-top: 10px;" data-i18n="cancelCrop">${t.cancelCrop || 'Cancelar Recorte'}</button>
        </div>

        <!-- Main Edit Interface -->
        <div id="editVideoSection">
            <h4 style="margin-bottom: 10px;" data-i18n="imageLabel">${t.imageLabel || 'Imagem'}</h4>
             <div class="image-upload-wrapper" style="margin-bottom: 20px;">
                <input type="file" id="adminImageInput" accept="image/*" onchange="onFabricImageSelect(event)" style="display: none;">
                <button class="admin-btn" onclick="document.getElementById('adminImageInput').click()" data-i18n="uploadNewImage">
                    ${t.uploadNewImage || 'Carregar Nova Imagem'}
                </button>
            </div>

            <h4 style="margin-bottom: 10px;" data-i18n="videoLabel">${t.videoLabel || 'Vídeo (YouTube/Vimeo)'}</h4>
            <div class="form-group">
                <input type="text" id="videoUrlInput" placeholder="${t.videoPlaceholder || 'Cole o link do vídeo aqui...'}" data-i18n-placeholder="videoPlaceholder">
            </div>
            
             <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn-confirm" onclick="saveVideoLink()" style="flex: 1; justify-content: center;" data-i18n="saveChanges">${t.saveChanges || 'Salvar Alterações'}</button>
                <button class="btn-cancel" onclick="deleteMedia()" style="color: #ef4444; border-color: #ef4444;" data-i18n="deleteMedia">${t.deleteMedia || 'Excluir Mídia'}</button>
            </div>
        </div>

      </div>
    </div>
  `;
    document.body.appendChild(modal);
}

function closeEditModal() {
    const modal = document.getElementById('mediaEditModal');
    modal.classList.remove('active');
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    // Reset visibility
    const cropSection = document.getElementById('cropSection');
    const editSection = document.getElementById('editVideoSection');
    if (cropSection) cropSection.style.display = 'none';
    if (editSection) editSection.style.display = 'block';
}

function cancelCrop() {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    document.getElementById('cropSection').style.display = 'none';
    document.getElementById('editVideoSection').style.display = 'block';
}

// ==========================================
// Initialization
// ==========================================
async function loadAllMedia() {
    // Load images from IndexedDB
    await loadImagesFromDB();

    // Update all fabric cards with loaded images
    Object.keys(fabricImages).forEach(id => {
        if (id.startsWith('hero_')) return;
        updateFabricMedia(id);
    });

    // Initialize Hero
    initHeroSystem();

    if (isAdminMode) {
        updateAdminUI();
    }
}

// Notification Helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `upload-notification ${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

// Exports
window.openAdminLogin = openAdminLogin;
window.closeAdminLogin = closeAdminLogin;
window.handleAdminLogin = handleAdminLogin;
window.resetAdminPassword = resetAdminPassword;
window.onFabricImageSelect = onFabricImageSelect;
window.saveAdminChanges = saveAdminChanges;
window.discardAdminChanges = discardAdminChanges;
window.exitAdminMode = exitAdminMode;

// ==========================================
// Hero Frame Customizer
// ==========================================
let heroFrameConfig = {
    index: { color: 'white', intensity: 0 },
    portfolio: { color: 'white', intensity: 0 }
};

function initHeroSystem() {
    // 1. Load saved hero images & configs
    ['index', 'portfolio'].forEach(page => {
        const heroId = `hero_${page}`;

        // Load Image
        if (fabricImages[heroId]) {
            updateHeroMedia(heroId);
        }

        // Load Frame Config
        const savedConfig = localStorage.getItem(`heroFrame_${page}`);
        if (savedConfig) {
            heroFrameConfig[page] = JSON.parse(savedConfig);
        }
        applyHeroFrame(page);
    });

    // 2. If admin, inject buttons
    if (isAdminMode) injectHeroEditButtons();
}

function applyHeroFrame(page) {
    const config = heroFrameConfig[page];
    const heroSection = document.querySelector(`[data-hero-page="${page}"]`)?.parentElement;
    if (!heroSection) return;

    // Apply Color (via background of parent usually, or we might need a border frame)
    // Actually, distinct black vs white frame usually implies the background BEHIND the curve.
    // Since .hero has overflow hidden and margin-top, the 'frame' is effectively the page background getting revealed or a border.
    // But the user asked for Black and White frame.
    // Implementation: Set a box-shadow or border color?
    // Let's assume 'Frame Color' means the color masking the corners.
    // If we use border-radius, the 'corners' are transparent, showing the body background.
    // To make them "black or white", we might need a pseudo-element or just ensure body background matches?
    // User request: "create your own frame and chonse your color black and white".
    // I will simulate this by changing the page background color locally or adding a thick border?
    // Let's try adding a thick bottom border that is curved?
    // Actually, standard approach: The 'Curve' cuts out the image. The color 'seen' is the section below.
    // If the user wants a visible *Frame*, maybe they mean a border around the image?
    // "moudura" = Frame.
    // I'll add a border to the clipped area.

    // Intensity = Border Radius Y value
    const radiusY = config.intensity * 2.5; // Map 0-100 to 0-250px
    const radiusX = 50; // Keep horizontal symmetric at 50%

    heroSection.style.borderRadius = `0 0 ${radiusX}% ${radiusX}% / 0 0 ${radiusY}px ${radiusY}px`;

    // Color: Add a border bottom?
    // heroSection.style.borderBottom = `20px solid ${config.color}`; 
    // Wait, simple curvature is cleaner.
    // Let's stick to the curve adjustment for now as "Modify". 
    // For color: Maybe they mean the shadow color? Or a border?
    // Let's try a border.
    heroSection.style.borderBottom = `5px solid ${config.color}`;
    heroSection.style.borderColor = config.color;
}

function openHeroEditModal(heroId) {
    currentEditFabricId = heroId;
    ensureEditModalExists();
    const page = heroId.replace('hero_', '');
    const config = heroFrameConfig[page];

    const modal = document.getElementById('mediaEditModal');
    modal.classList.add('active');

    // Hide Video, Show Frame Editor
    const vidInput = document.getElementById('videoUrlInput').parentElement;
    if (vidInput) vidInput.style.display = 'none';

    // Inject Custom Frame UI
    const frameUI = document.createElement('div');
    frameUI.id = 'heroFrameEditor';
    frameUI.innerHTML = `
        <h4 style="margin: 20px 0 10px;">🎨 Personalizar Moldura (Frame)</h4>
        
        <div style="margin-bottom: 15px;">
            <label style="display:block; margin-bottom:5px; font-size:12px;">Cor da Borda:</label>
            <div style="display: flex; gap: 10px;">
                <button onclick="updateFrameColor('${page}', 'white')" class="frame-color-btn ${config.color === 'white' ? 'active' : ''}" style="background:white; border:1px solid #ccc; width:40px; height:40px; border-radius:50%; box-shadow: 0 2px 5px rgba(0,0,0,0.1); cursor:pointer; position:relative;">
                    ${config.color === 'white' ? '✓' : ''}
                </button>
                <button onclick="updateFrameColor('${page}', 'black')" class="frame-color-btn ${config.color === 'black' ? 'active' : ''}" style="background:black; border:1px solid #ccc; width:40px; height:40px; border-radius:50%; color:white; cursor:pointer; position:relative;">
                    ${config.color === 'black' ? '✓' : ''}
                </button>
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <label style="display:block; margin-bottom:5px; font-size:12px;">Curvatura (Intensidade):</label>
            <input type="range" min="0" max="100" value="${config.intensity}" 
                oninput="updateFrameIntensity('${page}', this.value)" 
                style="width: 100%; cursor: pointer;">
        </div>
    `;

    // Clean up previous injection if any
    const oldUI = document.getElementById('heroFrameEditor');
    if (oldUI) oldUI.remove();

    const editSection = document.getElementById('editVideoSection');
    editSection.insertBefore(frameUI, editSection.firstChild);
}

// Global handlers for the injected HTML
window.updateFrameColor = (page, color) => {
    heroFrameConfig[page].color = color;
    localStorage.setItem(`heroFrame_${page}`, JSON.stringify(heroFrameConfig[page]));

    // Update active checkmark UI
    document.querySelectorAll('.frame-color-btn').forEach(btn => {
        btn.innerText = '';
        btn.classList.remove('active');
        if (btn.style.background === color || (color === 'white' && btn.style.background.includes('white'))) {
            btn.innerText = '✓';
            btn.classList.add('active');
        }
    });

    applyHeroFrame(page);
};

window.updateFrameIntensity = (page, value) => {
    heroFrameConfig[page].intensity = value;
    localStorage.setItem(`heroFrame_${page}`, JSON.stringify(heroFrameConfig[page]));
    applyHeroFrame(page);
};

function injectHeroEditButtons() {
    document.querySelectorAll('[data-hero-page]').forEach(heroBg => {
        const container = heroBg.parentElement; // .hero section
        // prevent duplicate
        if (container.querySelector('.admin-hero-edit-btn')) return;

        const page = heroBg.getAttribute('data-hero-page');
        const btn = document.createElement('button');
        btn.className = 'admin-hero-edit-btn';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            EDITAR HERO
        `;
        btn.onclick = (e) => {
            e.stopPropagation();
            openHeroEditModal(`hero_${page}`);
        };

        // Style the button
        Object.assign(btn.style, {
            position: 'absolute',
            top: '50%', // Center vertically relative to hero or specific offset
            left: '50%',
            transform: 'translate(-50%, -50%)', // Center it
            zIndex: '9999', // Maximum visibility
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid var(--color-accent)',
            padding: '12px 24px',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(5px)'
        });

        container.style.position = 'relative';
        container.appendChild(btn);
    });
}

function openHeroEditModal(heroId) {
    currentEditFabricId = heroId;
    ensureEditModalExists();

    // Customize modal for Image Only
    const modal = document.getElementById('mediaEditModal');
    modal.classList.add('active');

    // Clear video input just in case
    document.getElementById('videoUrlInput').value = '';

    // Clean up Frame Editor if we are opening a normal fabric (safety check) but here we know it is hero
    // Logic handled in openHeroEditModal specific injection
}

function updateHeroMedia(heroId) {
    const data = fabricImages[heroId];
    if (!data || !data.url) return;

    const page = heroId.replace('hero_', '');
    const heroBg = document.querySelector(`[data-hero-page="${page}"]`);

    if (heroBg) {
        heroBg.style.backgroundImage = `url('${data.url}')`;
        // Ensure cover size
        heroBg.style.backgroundSize = 'cover';
        heroBg.style.backgroundPosition = 'center';
    }
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
    await initDB();
    await loadAllMedia();

    // Check Supabase Auth Status
    const isAuth = await AuthService.isAuthenticated();
    if (isAuth) {
        isAdminMode = true;
        enableEditMode();
    }
});
