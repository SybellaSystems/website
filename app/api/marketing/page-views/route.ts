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


    const stats = await collection.aggregate([
      {
        $group: {
          _id: '$pageUrl',
          totalViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' },
        },
      },
      {
        $project: {
          pageUrl: '$_id',
          totalViews: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          _id: 0,
        },
      },
      { $sort: { totalViews: -1 } },
    ]).toArray();

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch page view stats' }, { status: 500 });
  }
}
