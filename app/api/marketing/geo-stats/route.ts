import { NextResponse } from 'next/server';
import getClientPromise from '@/lib/mongodb';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  // Skip MongoDB connection during build time
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.NEXT_PHASE === 'phase-production-compile';
  
  if (isBuildTime) {
    return NextResponse.json({ error: "Service unavailable during build" }, { status: 503 });
  }

  try {
    const client = await getClientPromise();
    const db = client.db();
    const collection = db.collection('pageviews');


    const geoStats = await collection.aggregate([
      {
        $match: { 'geo.country': { $ne: 'Unknown' } }
      },
      {
        $group: {
          _id: { country: '$geo.country', region: '$geo.region' },
          visitors: { $addToSet: '$visitorId' },
        },
      },
      {
        $project: {
          country: '$_id.country',
          region: '$_id.region',
          uniqueVisitors: { $size: '$visitors' },
          _id: 0,
        },
      },
      { $sort: { uniqueVisitors: -1 } },
    ]).toArray();

    return NextResponse.json(geoStats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch geo stats' }, { status: 500 });
  }
}
