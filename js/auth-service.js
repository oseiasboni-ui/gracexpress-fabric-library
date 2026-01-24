
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
        if (!window.supabaseClient) {
            throw new Error('Supabase not initialized');
        }

        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Login error:', error.message);
            throw error;
        }

        return data.user;
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
