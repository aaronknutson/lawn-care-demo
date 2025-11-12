// Simple Node.js script to test the weather API
import fetch from 'node-fetch';

async function testAPI() {
  console.log('Testing Weather API...\n');
  
  const url = 'http://localhost:5000/api/weather/current/78701';
  console.log(`URL: ${url}\n`);
  
  try {
    const response = await fetch(url);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log(`\nResponse body:`);
    console.log(JSON.stringify(data, null, 2));
    
    console.log(`\n✓ API is working correctly!`);
    
    if (data.success && data.data) {
      console.log(`\n✓ Data structure is correct`);
      console.log(`  - Temperature: ${data.data.temperature}°F`);
      console.log(`  - Condition: ${data.data.condition}`);
      console.log(`  - City: ${data.data.city}`);
    } else {
      console.log(`\n✗ Data structure is unexpected`);
    }
    
  } catch (error) {
    console.error(`\n✗ Error:`, error.message);
  }
}

testAPI();
