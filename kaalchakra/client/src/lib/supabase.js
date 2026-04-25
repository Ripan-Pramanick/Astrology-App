// // client/src/lib/supabase.js
// import { createClient } from '@supabase/supabase-js';

// // Your Supabase credentials from .env
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// console.log('Supabase URL:', supabaseUrl);
// console.log('Supabase Key exists:', !!supabaseAnonKey);

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error('Supabase credentials missing!');
//   throw new Error('Supabase credentials are required');
// }

// // Create and export the supabase client
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// console.log('✅ Supabase client initialized successfully');

// client/src/lib/supabase.js (টেস্টিং এর জন্য - পরে রিমুভ করবেন)
import { createClient } from '@supabase/supabase-js';

// Hardcoded for testing (DELETE AFTER FIXING)
const supabaseUrl = 'https://zpmmxdacdmszkpgmnmts.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbW14ZGFjZG1zemtwZ21ubXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTM0MzEsImV4cCI6MjA5MDI4OTQzMX0.W_yjOdDhyVhqBf6LDxwJ6J8rXusNgBJd0so7jCkKbyE';

console.log('Using Supabase URL:', supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('✅ Supabase client initialized (hardcoded)');