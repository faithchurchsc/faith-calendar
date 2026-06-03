<!DOCTYPE html>
<html>
<head>
  <title>PCO Connection Test</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #f0f0f0; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; }
    .success { color: green; }
    .error { color: red; }
    button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="container">
    <h1>PCO API Connection Test</h1>
    <button onclick="testConnection()">Test PCO Connection</button>
    <div id="result"></div>
  </div>

  <script>
    async function testConnection() {
      const result = document.getElementById('result');
      result.innerHTML = '<p>Testing...</p>';
      
      try {
        const ORG_ID = '27556';
        const CLIENT_ID = 'taylor@faithishere.org';
        const SECRET = 'aca7acdf7dad03d9842321e97ed9bf25782399696375444173c5564e8c65fd0a';
        const ROOM_FOLDER_IDS = ['62071', '62089'];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const saturday = new Date(today);
        saturday.setDate(saturday.getDate() + 6);
        
        const startDate = today.toISOString().split('T')[0];
        const endDate = saturday.toISOString().split('T')[0];
        
        const auth = btoa(`${CLIENT_ID}:${SECRET}`);
        const roomFilter = ROOM_FOLDER_IDS.map(id => `room_folder_id:${id}`).join(',');
        const url = `https://api.planningcenteronline.com/calendar/v2/events?organization_id=${ORG_ID}&filter=after:${startDate},before:${endDate},${roomFilter}&per_page=100&include=event_times,locations`;
        
        result.innerHTML += `<p>URL: <code>${url}</code></p>`;
        
        const response = await fetch(url, {
          headers: { 
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        });
        
        result.innerHTML += `<p>Response Status: <span class="${response.ok ? 'success' : 'error'}">${response.status}</span></p>`;
        
        const data = await response.json();
        
        if (data.data) {
          result.innerHTML += `<p class="success"><strong>✓ Success!</strong> Found ${data.data.length} events</p>`;
          result.innerHTML += '<p><strong>Events:</strong></p><pre>' + JSON.stringify(data.data.slice(0, 3), null, 2) + '</pre>';
        } else {
          result.innerHTML += `<p class="error">No events returned. Response:</p><pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
        
      } catch (error) {
        result.innerHTML += `<p class="error"><strong>Error:</strong> ${error.message}</p>`;
      }
    }
  </script>
</body>
</html>
