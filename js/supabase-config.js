
// Supabase Configuration
// Using the provided credentials

const SUPABASE_URL = 'https://dsdmvzksybjpwvhxjaiu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZG12emtzeWJqcHd2aHhqYWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTc1MDQsImV4cCI6MjA4NTQ5MzUwNH0.ZhOe9ZOLmp9OApNk-TkCKKRPr09umVI8duDiocarQvw';

// Check if Supabase client is available
if (typeof supabase === 'undefined') {
    console.error('Supabase SDK not loaded! Make sure to include the CDN link in index.html');
}

// Initialize Supabase client
const _supabaseResponse = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Export locally if needed, but usually we attach to window for simple vanilla JS apps
window.supabaseClient = _supabaseResponse;
