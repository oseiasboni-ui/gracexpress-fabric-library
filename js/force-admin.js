(function () {
    // Immediate Admin Mode Check
    try {
        const savedMode = localStorage.getItem('isAdminMode');
        if (savedMode === 'true') {
            document.documentElement.classList.add('edit-mode-active');

            const activateBody = () => {
                if (document.body) {
                    document.body.classList.add('edit-mode-active');
                    injectAdminToolbar();
                } else {
                    setTimeout(activateBody, 10);
                }
            };
            activateBody();

            // Fallback for DOMContentLoaded
            document.addEventListener('DOMContentLoaded', activateBody);

            console.log('Admin Mode Forcibly Activated from Storage');
        }
    } catch (e) {
        console.error('Admin Check Failed', e);
    }

    function injectAdminToolbar() {
        if (document.getElementById('adminToolbar')) return;

        const toolbar = document.createElement('div');
        toolbar.id = 'adminToolbar';
        toolbar.className = 'admin-toolbar';
        toolbar.innerHTML = `
            <div class="admin-toolbar-content">
                <span class="admin-toolbar-label">🔐 Modo Admin</span>
                <div class="admin-toolbar-buttons">
                    <button class="admin-toolbar-btn save" onclick="if(window.saveAdminChanges) window.saveAdminChanges(); else alert('Aguarde o carregamento do sistema...')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        <span>Salvar</span>
                    </button>
                    <button class="admin-toolbar-btn discard" onclick="if(window.discardAdminChanges) window.discardAdminChanges(); else alert('Aguarde o carregamento do sistema...')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        <span>Descartar</span>
                    </button>
                    <button class="admin-toolbar-btn exit" onclick="if(window.exitAdminMode) window.exitAdminMode(); else alert('Aguarde o carregamento do sistema...')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(toolbar);
    }
})();
