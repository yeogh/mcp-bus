/**
 * /api/bus-arrival.js
 * Server-side proxy for Singapore LTA DataMall v3 BusArrival API:
 * GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
 * Optional query param: &ServiceNo=7
 * Header: AccountKey: process.env.LTA_ACCOUNT_KEY
 */

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed',
    });
  }

  const busStopCode =
    req.query?.BusStopCode || req.query?.busStopCode || '';
  const serviceNo = req.query?.ServiceNo || req.query?.serviceNo || '';

  if (!busStopCode || !/^\d{5}$/.test(String(busStopCode).trim())) {
    return res.status(400).json({
      error: 'Missing or invalid required parameter: BusStopCode (must be a 5-digit LTA bus stop code, e.g. 04121).',
    });
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY;
  if (!accountKey || accountKey.trim() === '' || accountKey === 'YOUR_LTA_ACCOUNT_KEY') {
    return res.status(503).json({
      error: 'LTA_ACCOUNT_KEY is not configured in environment variables yet.',
      configured: false,
      busStopCode: String(busStopCode).trim(),
    });
  }

  try {
    const url = new URL(
      'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival'
    );
    url.searchParams.set('BusStopCode', String(busStopCode).trim());

    if (serviceNo && String(serviceNo).trim() !== '') {
      url.searchParams.set('ServiceNo', String(serviceNo).trim());
    }

    const ltaResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        AccountKey: accountKey.trim(),
        Accept: 'application/json',
      },
    });

    if (!ltaResponse.ok) {
      const errorText = await ltaResponse.text();
      return res.status(ltaResponse.status).json({
        error: `LTA DataMall returned HTTP ${ltaResponse.status}`,
        details: errorText.slice(0, 300),
        configured: true,
      });
    }

    const data = await ltaResponse.json();

    // Cache-Control aligned with LTA 20-second refresh cycle
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=5');

    return res.status(200).json({
      ...data,
      _meta: {
        source: 'LTA DataMall v3 BusArrival',
        fetchedAt: new Date().toISOString(),
        refreshIntervalSeconds: 20,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to reach LTA DataMall BusArrival endpoint.',
      message: err instanceof Error ? err.message : String(err),
      configured: true,
    });
  }
}
