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
  const BUILDINGS = ['Building 4', 'Building 6'];

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const saturday = new Date(today);
    saturday.setDate(saturday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = saturday.toISOString().split('T')[0];
    
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');
    
    const url = `https://api.planningcenteronline.com/calendar/v2/events?organization_id=${ORG_ID}&filter=after:${startDate},before:${endDate}&per_page=100&include=event_times,locations`;
    
    const response = await fetch(url, {
      headers: {
        'Authoriza
