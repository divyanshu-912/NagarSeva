// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vjafdjwpasqicymarzky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWZkandwYXNxaWN5bWFyemt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDgyNTksImV4cCI6MjA3NDgyNDI1OX0.bUWYe7UdJSCWMG9s88433ABSP3NZvokNBtcl0Kz_NdE';

export const supabase = createClient(supabaseUrl, supabaseKey);