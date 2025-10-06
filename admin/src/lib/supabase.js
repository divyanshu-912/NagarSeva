// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vxarvnwblnczrdokwyom.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4YXJ2bndibG5jenJkb2t3eW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5NjQsImV4cCI6MjA3NDk5MDk2NH0.cEV8beEpEFXKs7tU4T6nucQK8cmeRKHXUG1u6XGg7pA"

export const supabase = createClient(supabaseUrl, supabaseKey)