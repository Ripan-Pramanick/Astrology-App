// server/utils/supabase.js
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Check if Supabase configuration exists
if (!config.supabase?.url || !config.supabase?.anonKey) {
    console.error('❌ Supabase configuration missing!');
    console.error('Please check your SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
    // Don't throw error, just warn and continue with mock client
    console.warn('⚠️ Running without Supabase - some features will be limited');
}

export const supabase = createClient(
    config.supabase?.url || 'https://placeholder.supabase.co',
    config.supabase?.anonKey || 'placeholder-key',
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);

console.log('✅ Supabase client initialized');