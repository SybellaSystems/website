/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sybellasystems.co.rw', // ✅ your live domain
  generateRobotsTxt: true, // ✅ also creates robots.txt
  sitemapSize: 7000,
  changefreq: 'weekly', // how often your pages are updated
  priority: 0.7, // default priority for all pages
  exclude: ['/admin/*'], // paths you don’t want indexed
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://sybellasystems.co.rw/sitemap.xml',
    ],
  },
}
