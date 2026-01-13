/** @type {import('next').NextConfig} */

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
<<<<<<< HEAD
      "www.google.com"
=======
      "www.google.com",
      'ik.imagekit.io'
      
>>>>>>> 2ecb9ed6259c9168cfb7b26393cc64d6738416bb
    ],
  },
  i18n: {
    locales: ['en','fr','sw','rw'],
    defaultLocale: 'en'
  }
};

module.exports = nextConfig;
