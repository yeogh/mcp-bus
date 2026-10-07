/**
 * /api/health.js
 * Health check endpoint to monitor API availability and LTA AccountKey configuration status.
 */

export default function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      message: 'Method Not Allowed',
    });
  }

  const hasLtaKey = Boolean(
    process.env.LTA_ACCOUNT_KEY &&
      process.env.LTA_ACCOUNT_KEY.trim() !== '' &&
      process.env.LTA_ACCOUNT_KEY !== 'YOUR_LTA_ACCOUNT_KEY'
  );

  return res.status(200).json({
    status: 'ok',
    service: 'Transit Pulse Singapore API',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    ltaDataMall: {
      endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      accountKeyConfigured: hasLtaKey,
      refreshIntervalSeconds: 20,
    },
  });
}
