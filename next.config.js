const { withFaust, getWpHostname } = require('@faustwp/core');

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['node_modules'],
  },
  images: {
    domains: [
      getWpHostname(),
      'realestate.calpolypartners.org',
    ],
  }, 
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/available-homes/:slug*',
        destination: '/bella-montana-home/:slug*',
      },
    ];
  },
});
