const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'placeholder_key';

if (!process.env.SUPABASE_URL) {
  console.warn('⚠️ Warning: SUPABASE_URL is not set in .env. Using placeholder for local startup.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;