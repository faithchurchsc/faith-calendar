exports.handler = async (event, context) => {
  const ORG_ID = '27556';
  const CLIENT_ID = 'taylor@faithishere.org';
  const SECRET = 'aca7acdf7dad03d9842321e97ed9bf25782399696375444173c5564e8c65fd0a';
  const ROOM_FOLDER_IDS = ['62071', '62089'];

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const saturday = new Date(today);
    saturday.setDate(saturday.getDate() + 6);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = saturday.toISOString().split('T')[0];
    
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');
    const roomFilter = ROOM_FOLDER_IDS.map(id => `room_folder_id:${id}`).join(',');
    const url = `https://api.planningcenteronline.com/calendar/v2/events?organization_id=${ORG_ID}&filter=after:${startDate},before:${endDate},${roomFilter}&per_page=100&include=event_times,locations`;
    
    const response = await fetch(url, {
      headers: { 
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true, events: data.data || [] })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
