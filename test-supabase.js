const { createClient } = require('@supabase/supabase-js');

// Using the credentials provided
const url = 'https://ogotkcvpemhhiaweqwfq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nb3RrY3ZwZW1oaGlhd2Vxd2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgxNTgsImV4cCI6MjA4OTA3NDE1OH0.iPUfNE2NXfGgHI7h_OuresnEOT67D3JiTt-BTElQ-fE';

console.log('Testing Supabase connection with provided credentials...');
console.log('URL:', url);
console.log('Key:', key);

const supabase = createClient(url, key);

async function testConnection() {
  try {
    // Try to select from the 'competitions' table which should be public
    const { data, error } = await supabase
      .from('competitions')
      .select('id, title')
      .limit(1);

    if (error) {
      console.error('❌ Supabase Error:', error.message);
      if (error.code) console.error('Error Code:', error.code);
      console.log('Suggestion: The key might be invalid for the JS client.');
    } else {
      console.log('✅ Success! Connected and fetched data:', data);
    }
  } catch (err) {
    console.error('❌ Network/Client Error:', err.message);
  }
}

testConnection();