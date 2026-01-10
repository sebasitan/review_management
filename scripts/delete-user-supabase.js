
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Note: Anon key might not be enough for deletion if RLS is on, 
// but often in these setups the service_role key is needed.
// However, I will try with what's available.

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'seba@stallioni.com';
    console.log(`Attempting to delete user ${email} via Supabase HTTP...`);

    const { data, error } = await supabase
        .from('User')
        .delete()
        .eq('email', email);

    if (error) {
        console.error('Error deleting user:', error);
    } else {
        console.log('Successfully deleted user (or user not found).', data);
    }
}

main();
