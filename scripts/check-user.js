
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'seba@stallioni.com';

    const { data, error } = await supabase
        .from('User')
        .select('id, email')
        .eq('email', email);

    if (error) {
        console.error('Error selecting user:', error);
    } else {
        console.log('User check result:', data);
    }
}

main();
