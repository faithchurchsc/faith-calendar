export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const ORG_ID = '27556';
  const CLIENT_ID = 'taylor@faithishere.org';
  const SECRET = 'aca7acdf7dad03d9842321e97ed9bf25782399696375444173c5564e8c65fd0a';
  const ROOM_FOLDER_IDS = ['62071', '62089']; // Building 6, Building 4

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const saturday = new Date(today);
    saturday.setDate(saturday.getDate() + 6);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = saturday.toISOString().split('T')[0];
    
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');
    
    // Query by room folder IDs
    const roomFolderFilter = ROOM_FOLDER_IDS.map(id => `room_folder_id:${id}`).join(',');
    const url = `https://api.planningcenteronline.com/calendar/v2/events?organization_id=${ORG_ID}&filter=after:${startDate},before:${endDate},${roomFolderFilter}&per_page=100&include=event_times,locations`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `PCO API Error: ${response.status}`
      });
    }
    
    const data = await response.json();
    const events = data.data || [];
    
    return res.status(200).json({
      success: true,
      events: events.map(event => ({
        id: event.id,
        name: event.attributes?.name || 'Event',
        eventTimes: event.relationships?.event_times?.data || [],
        locations: event.relationships?.locations?.data || []
      })),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
