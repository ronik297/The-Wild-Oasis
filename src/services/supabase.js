import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://nqcurzqtgfbzobwhlqyv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xY3VyenF0Z2Ziem9id2hscXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NjU4MjMsImV4cCI6MjA1NjA0MTgyM30.GL_5RI_0eoQbqa-Z0k9zBA6o17AeFVqQLeXc_3dUFPE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
