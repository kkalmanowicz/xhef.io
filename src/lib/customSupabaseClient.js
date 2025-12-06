import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djoehtkvmbvvkwueygfp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqb2VodGt2bWJ2dmt3dWV5Z2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjEwNzQsImV4cCI6MjA2MDIzNzA3NH0.hy2uOVwFVuBi2_cCBP6lKwLBaNswyJ120edgjMYO870';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
