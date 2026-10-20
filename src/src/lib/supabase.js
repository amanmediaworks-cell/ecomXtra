import { createClient } from '@supabase/supabase-js';

function readPublicEnvValue(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  const quote = trimmed[0];
  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

const supabaseUrl = readPublicEnvValue(import.meta.env.VITE_SUPABASE_URL);
const supabaseKey = readPublicEnvValue(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const missingVariables = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseKey && 'VITE_SUPABASE_PUBLISHABLE_KEY',
].filter(Boolean);

if (missingVariables.length > 0) {
  throw new Error(`Missing ${missingVariables.join(' and ')}. Add the value(s) to .env.local.`);
}

try {
  const parsedUrl = new URL(supabaseUrl);
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error();
  }
} catch {
  throw new Error('VITE_SUPABASE_URL must be a valid HTTP or HTTPS URL. Check for extra quotes or whitespace.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);