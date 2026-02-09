(function () {
    // Admin Mode Check - Only activate if authenticated via Supabase

    // Wait for Supabase to be available
    function checkSupabaseAuth() {
        // If Supabase client is not available yet, wait
        if (typeof window.supabaseClient === 'undefined' || window.supabaseClient === null) {
            // Retry after scripts load
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(checkSupabaseAuth, 500);
            });
            return;
        }

        // Check Supabase session
        window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session && session.user) {
                // User is authenticated - activate admin mode
                activateAdminMode();
                console.log('✅ Admin Mode activated - User authenticated:', session.user.email);
            } else {
                // Not authenticated - remove admin mode
                deactivateAdminMode();
                console.log('🔒 Admin Mode not active - User not authenticated');
            }
        }).catch(err => {
            console.warn('Supabase auth check failed:', err);
            deactivateAdminMode();
        });

        // Listen for auth state changes
        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                activateAdminMode();
                console.log('✅ User signed in:', session.user.email);
            } else if (event === 'SIGNED_OUT') {
                deactivateAdminMode();
                console.log('🔒 User signed out');
                location.reload();
            }
        });
    }

    function activateAdminMode() {
        document.documentElement.classList.add('edit-mode-active');
        document.body.classList.add('edit-mode-active');
        localStorage.setItem('isAdminMode', 'true');
        injectAdminToolbar();
    }

    function deactivateAdminMode() {
        document.documentElement.classList.remove('edit-mode-active');
        document.body.classList.remove('edit-mode-active');
        localStorage.removeItem('isAdminMode');
        removeAdminToolbar();
    }

    function removeAdminToolbar() {
        const toolbar = document.getElementById('adminToolbar');
        if (toolbar) toolbar.remove();
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
                    <button class="admin-toolbar-btn exit" onclick="window.logoutAdmin()">
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

    // Global logout function
    window.logoutAdmin = async function () {
        if (window.supabaseClient) {
            await window.supabaseClient.auth.signOut();
        }
        localStorage.removeItem('isAdminMode');
        deactivateAdminMode();
        location.reload();
    };

    // Global login function (for use in login forms)
    window.loginAdmin = async function (email, password) {
        if (!window.supabaseClient) {
            alert('Sistema de autenticação não disponível');
            return false;
        }

        try {
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Login error:', error.message);
                alert('Erro de login: ' + error.message);
                return false;
            }

            if (data.session) {
                activateAdminMode();
                return true;
            }
        } catch (err) {
            console.error('Login failed:', err);
            alert('Falha no login');
            return false;
        }
        return false;
    };

    // Start checking after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(checkSupabaseAuth, 100);
        });
    } else {
        setTimeout(checkSupabaseAuth, 100);
    }
})();
