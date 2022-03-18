const { withPlaiceholder } = require('@plaiceholder/next')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  images: {
    domains: ['history.nasa.gov', 'shuttl-images.s3.eu-west-2.amazonaws.com'],
  },
}

module.exports = withPlaiceholder(nextConfig)
