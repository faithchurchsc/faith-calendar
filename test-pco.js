const ORG_ID = '27556';
const CLIENT_ID = 'taylor@faithishere.org';
const SECRET = 'aca7acdf7dad03d9842321e97ed9bf25782399696375444173c5564e8c65fd0a';

async function testPCO() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const saturday = new Date(today);
    saturday.setDate(saturday.getDate() + 6);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = saturday.toISOString().split('T')[0];
    
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');
    
    const url = `https://api.planningcenteronline.com/calendar/v2/events?organization_id=${ORG_ID}&filter=after:${startDate},before:${endDate}&per_page=100&include=event_times,locations`;
    
    console.log('Testing PCO API...');
    console.log('URL:', url);
    console.log('Auth header set:', auth.substring(0, 10) + '...');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    
    console.log('Total events returned:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\nFirst 3 events:');
      data.data.slice(0, 3).forEach((event, idx) => {
        console.log(`${idx + 1}. ${event.attributes?.name}`);
      });
    }
    
    // Show events with Building 4 or Building 6
    const filtered = data.data?.filter(e => 
      e.attributes?.name?.includes('Building 4') || 
      e.attributes?.name?.includes('Building 6')
    ) || [];
    
    console.log('\nEvents matching "Building 4" or "Building 6":', filtered.length);
    if (filtered.length > 0) {
      filtered.slice(0, 3).forEach((event, idx) => {
        console.log(`${idx + 1}. ${event.attributes?.name}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPCO();
