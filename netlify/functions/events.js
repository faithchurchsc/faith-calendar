exports.handler = async (event, context) => {
  const ORG_ID = '27556';
  const CLIENT_ID = '76c6b4fdda251516fd0a10e172e7fb82f4885dea99e1fab20b0b7d0c1f98d11a';
  const SECRET = 'pco_pat_1722531d614e88b2be0c745b6d23833ba2d3ff5e051f1f2779a34766f34c8cbe785ef2d5';
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
    
    const events = (data.data || []).map(event => ({
      id: event.id,
      name: event.attributes?.name || 'Event',
      eventTimes: event.relationships?.event_times?.data || [],
      locations: event.relationships?.locations?.data || []
    }));
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        events: events
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
