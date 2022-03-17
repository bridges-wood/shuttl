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
    domains: ['history.nasa.gov'],
  },
}

module.exports = withPlaiceholder(nextConfig)
