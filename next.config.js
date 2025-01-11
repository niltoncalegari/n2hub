/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'battlebit.wiki.gg',
      'img.icons8.com'
    ],
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'seu-app.herokuapp.com',
          },
        ],
        destination: 'https://www.seudominio.com/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 