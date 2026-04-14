import { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sybellasystems.co.rw";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/ogera`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/technology`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/impact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
