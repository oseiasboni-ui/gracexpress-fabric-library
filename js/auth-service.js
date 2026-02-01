
// Authentication Service using Supabase

const AuthService = {
    // Check if user is logged in
    async isAuthenticated() {
        if (!window.supabaseClient) return false;

        const { data: { session } } = await window.supabaseClient.auth.getSession();
        return !!session;
    },

    // Get current user
    async getCurrentUser() {
        if (!window.supabaseClient) return null;

        const { data: { user } } = await window.supabaseClient.auth.getUser();
        return user;
    },

    // Login function
    async login(email, password) {
        // Fallback Credentials for development/rescue
        const RESCUE_EMAIL = 'admin@gracexpress.com';
        const RESCUE_PASS = 'admin';

        try {
            if (!window.supabaseClient) throw new Error('Supabase unavailable');

            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            return data.user;
        } catch (err) {
            console.warn('Supabase login failed, checking rescue credentials:', err.message);

            // Rescue Login check
            if (email === RESCUE_EMAIL && password === RESCUE_PASS) {
                console.log('Using RESCUE LOGIN');
                return {
                    id: 'rescue_admin',
                    email: RESCUE_EMAIL,
                    role: 'authenticated'
                };
            }

            throw err; // Re-throw if not rescue
        }
    },

    // Logout function
    async logout() {
        if (!window.supabaseClient) return;

        const { error } = await window.supabaseClient.auth.signOut();
        if (error) {
            console.error('Logout error:', error.message);
            throw error;
        }

        // Reload to clear any local state in the app
        window.location.reload();
    },

    // Listen for auth state changes
    onAuthStateChange(callback) {
        if (!window.supabaseClient) return;

        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
};

// Make available globally
window.AuthService = AuthService;
