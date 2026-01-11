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
let isAdminMode = sessionStorage.getItem('isAdminMode') === 'true';
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

// Admin Credentials (Simulated)
const ADMIN_EMAIL = 'oseiasboni@gmail.com';
const ADMIN_PASS = 'nivanilda';

// Helper: Get fabric image URL
function getFabricImageUrl(fabricId) {
    return fabricImages[fabricId]?.url || null;
}
window.getFabricImageUrl = getFabricImageUrl;

// ==========================================
// Admin Authentication
// ==========================================
function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('active');
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('active');
}

function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPassword').value;

    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        sessionStorage.setItem('isAdminMode', 'true');
        isAdminMode = true;
        enableEditMode();
        closeAdminLogin();
        showNotification('Login realizado com sucesso! Modo de edição ativo.', 'success');
    } else {
        showNotification('Credenciais inválidas.', 'error');
    }
}

function resetAdminPassword() {
    const email = document.getElementById('adminEmail').value;
    if (email === ADMIN_EMAIL) {
        showNotification(`Link de redefinição enviado para ${email}`, 'success');
    } else {
        showNotification('Digite o e-mail de administrador para redefinir.', 'info');
    }
}

function enableEditMode() {
    document.body.classList.add('edit-mode-active');
    // Create backup for discard functionality
    fabricImagesBackup = JSON.parse(JSON.stringify(fabricImages));
    fabricVideosBackup = JSON.parse(JSON.stringify(fabricVideos));
    createAdminToolbar();
    updateAdminUI();
}

function updateAdminUI() {
    // Add visual cues for editable elements if in admin mode
    if (isAdminMode) {
        document.body.classList.add('edit-mode-active');
    }
}

// ==========================================
// Admin Toolbar
// ==========================================
function createAdminToolbar() {
    if (document.getElementById('adminToolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'adminToolbar';
    toolbar.className = 'admin-toolbar';
    toolbar.innerHTML = `
        <div class="admin-toolbar-content">
            <span class="admin-toolbar-label">🔐 Modo Admin</span>
            <div class="admin-toolbar-buttons">
                <button class="admin-toolbar-btn save" onclick="saveAdminChanges()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Salvar
                </button>
                <button class="admin-toolbar-btn discard" onclick="discardAdminChanges()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Descartar
                </button>
                <button class="admin-toolbar-btn exit" onclick="exitAdminMode()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sair
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

function exitAdminMode() {
    // Sair diretamente do modo admin
    sessionStorage.removeItem('isAdminMode');
    isAdminMode = false;
    document.body.classList.remove('edit-mode-active');
    removeAdminToolbar();
    // Reload to refresh UI without admin mode
    location.reload();
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
        initCropper(e.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
}

function initCropper(imageSrc) {
    const image = document.getElementById('cropImageTarget');
    image.src = imageSrc;
    image.style.display = 'block';

    // Hide video section during crop
    document.getElementById('editVideoSection').style.display = 'none';
    document.getElementById('cropSection').style.display = 'block';

    if (cropper) cropper.destroy();

    cropper = new Cropper(image, {
        aspectRatio: 1,
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

    const canvas = cropper.getCroppedCanvas({
        width: 800,
        height: 800,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    });

    try {
        showNotification('Enviando imagem para a nuvem...', 'info');

        // Convert canvas to blob for upload
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));

        // Upload to Cloudinary
        const cloudinaryResult = await CloudinaryService.uploadImage(blob, 'gracexpress-fabrics');

        // Save Cloudinary URL to memory and IndexedDB
        const imageData = {
            url: cloudinaryResult.url,
            publicId: cloudinaryResult.publicId,
            uploadedAt: new Date().toISOString()
        };
        fabricImages[currentEditFabricId] = imageData;
        await saveImageToDB(currentEditFabricId, imageData);

        // Convert to visual update
        updateFabricMedia(currentEditFabricId);
        showNotification('Imagem enviada para a nuvem com sucesso!', 'success');
        closeEditModal();
    } catch (e) {
        console.error(e);
        showNotification('Erro ao enviar imagem. Verifique sua conexão.', 'error');
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

    const modal = document.createElement('div');
    modal.id = 'mediaEditModal';
    modal.className = 'crop-modal'; // Re-use styling
    modal.innerHTML = `
    <div class="crop-modal-content">
      <div class="crop-header">
        <h3>Gerenciar Mídia</h3>
        <button class="crop-close-btn" onclick="closeEditModal()">×</button>
      </div>
      
      <div class="crop-body" style="background: var(--color-bg); display: block; overflow-y: auto; padding: 20px;">
        
        <!-- Crop Section (Initially Hidden) -->
        <div id="cropSection" style="display:none; text-align: center;">
            <div style="max-height: 400px; overflow: hidden; margin-bottom: 20px;">
                <img id="cropImageTarget" style="max-width: 100%;">
            </div>
            <button class="btn-confirm" onclick="confirmCrop()" style="width: 100%; justify-content: center;">
                Confirmar Recorte (1:1)
            </button>
            <button class="btn-cancel" onclick="cancelCrop()" style="width: 100%; margin-top: 10px;">Cancelar Recorte</button>
        </div>

        <!-- Main Edit Interface -->
        <div id="editVideoSection">
            <h4 style="margin-bottom: 10px;">Imagem</h4>
             <div class="image-upload-wrapper" style="margin-bottom: 20px;">
                <input type="file" id="adminImageInput" accept="image/*" onchange="onFabricImageSelect(event)" style="display: none;">
                <button class="admin-btn" onclick="document.getElementById('adminImageInput').click()">
                    Carregar Nova Imagem
                </button>
            </div>

            <h4 style="margin-bottom: 10px;">Vídeo (YouTube/Vimeo)</h4>
            <div class="form-group">
                <input type="text" id="videoUrlInput" placeholder="Cole o link do vídeo aqui...">
            </div>
            
             <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="btn-confirm" onclick="saveVideoLink()" style="flex: 1; justify-content: center;">Salvar Alterações</button>
                <button class="btn-cancel" onclick="deleteMedia()" style="color: #ef4444; border-color: #ef4444;">Excluir Mídia</button>
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
    Object.keys(fabricImages).forEach(id => updateFabricMedia(id));

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

// Init
document.addEventListener('DOMContentLoaded', async () => {
    await initDB();
    await loadAllMedia();
    if (isAdminMode) {
        createAdminToolbar();
    }
});
