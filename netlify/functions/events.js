exports.handler = async (event, context) => {
  const ORG_ID = '27556';
  const CLIENT_ID = 'c6f39c847cb6a59acd1d39d520a7fadacca2bb9c021c0fa3d95fd16413873ab2';
  const SECRET = 'pco_pat_16691dc60a79a67e2d45a81f935127a6877225950f1edf28be4b8289f9e41b946ebdec3f';
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
