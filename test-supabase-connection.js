import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('🔄 Testing Supabase connection...');

    try {
        // Test basic connection
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .limit(1);

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('⚠️  Categories table does not exist yet - this is expected before running the schema');
                console.log('✅ Supabase connection is working');
                console.log('📋 Next steps:');
                console.log('   1. Go to your Supabase project: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0]);
                console.log('   2. Navigate to SQL Editor');
                console.log('   3. Run the schema file: supabase-schema.sql');
                console.log('   4. Run the RLS policies: supabase-rls-policies.sql');
                console.log('   5. Optionally run sample data: supabase-sample-data.sql');
                return;
            }
            throw error;
        }

        console.log('✅ Supabase connection successful!');
        console.log('📊 Categories table found with', data.length, 'records');

        // Test a simple insert/delete to verify RLS is working
        const testCategory = {
            name: 'TEST_CATEGORY_' + Date.now(),
            description: 'Test category for connection verification'
        };

        const { data: insertData, error: insertError } = await supabase
            .from('categories')
            .insert(testCategory)
            .select();

        if (insertError) {
            console.log('⚠️  Could not insert test data - check RLS policies');
            console.log('   Error:', insertError.message);
        } else {
            console.log('✅ Test insert successful');

            // Clean up test data
            const { error: deleteError } = await supabase
                .from('categories')
                .delete()
                .eq('id', insertData[0].id);

            if (!deleteError) {
                console.log('✅ Test cleanup successful');
            }
        }

        console.log('🎉 Database is ready for the application!');

    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        console.log('🔍 Check:');
        console.log('   - Supabase URL is correct');
        console.log('   - Anonymous key is correct');
        console.log('   - Database schema has been created');
        console.log('   - RLS policies are set up correctly');
        process.exit(1);
    }
}

testConnection();