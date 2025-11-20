/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  i18n: {
    locales: ['en','fr','sw','rw'],
    defaultLocale: 'en'
  }
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'github.com',
      'lh3.googleusercontent.com',
      'cdn.discordapp.com',
      'pbs.twimg.com',
      'media.licdn.com',
      'www.linkedin.com',
      "www.google.com",
      'ik.imagekit.io'
      
    ],
  },
};

module.exports = nextConfig;
