import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wdwcyupjkkduvaqleqhk.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkd2N5dXBqa2tkdXZhcWxlcWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTIyNDcsImV4cCI6MjA2MzM4ODI0N30.80Hi9woVrtevp-thbc-T5tUk1R_SE3kbblSgnz723Cw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);