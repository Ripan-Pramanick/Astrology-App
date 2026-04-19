// server/utils/supabase.js
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Check if Supabase configuration exists
if (!config.supabase?.url || !config.supabase?.anonKey) {
    console.error('❌ Supabase configuration missing!');
    console.error('Please check your SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
    throw new Error('Supabase configuration is required');
}

export const supabase = createClient(
    config.supabase.url, 
    config.supabase.anonKey
);

console.log('✅ Supabase client initialized');