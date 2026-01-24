
// Supabase Configuration
// Using the provided credentials

const SUPABASE_URL = 'https://qwijkdjwyawoohmhgcxd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bo8rqsiT-s4i5ccVnHKK5Q_KjUpHZsM';

// Check if Supabase client is available
if (typeof supabase === 'undefined') {
    console.error('Supabase SDK not loaded! Make sure to include the CDN link in index.html');
}

// Initialize Supabase client
const _supabaseResponse = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Export locally if needed, but usually we attach to window for simple vanilla JS apps
window.supabaseClient = _supabaseResponse;
