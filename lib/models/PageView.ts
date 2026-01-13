import getClientPromise from "../mongodb";

export class PageView {
 static async record(ip: string, userAgent: string, pageUrl: string, visitorId?: string, geo?: { country?: string, region?: string, city?: string }) {
  const client = await getClientPromise();
  const db = client.db();
  const collection = db.collection("pageviews");

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const query: any = { pageUrl };
  if (visitorId) query.visitorId = visitorId;
  else query.ipAddress = ip;

  const existing = await collection.findOne({ ...query, viewedAt: { $gte: oneHourAgo } });
  if (existing) return { recorded: false, message: "Duplicate ignored" };

  await collection.insertOne({
    pageUrl,
    ipAddress: ip,
    userAgent,
    visitorId,
    geo: geo || { country: "Unknown", region: "Unknown", city: "Unknown" },
    viewedAt: new Date(),
  });

  return { recorded: true, message: "New view recorded" };
}


  static async getStats() {
    const client = await getClientPromise();
    const db = client.db();
    const collection = db.collection("pageviews");

    const stats = await collection
      .aggregate([
        { $group: { _id: "$pageUrl", totalViews: { $sum: 1 } } },
        { $sort: { totalViews: -1 } },
      ])
      .toArray();

    return stats;
  }
}
