import withPWA from 'next-pwa';

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})({
  reactStrictMode: true,
  experimental: {
    turbo: {
      resolveAlias: {
        '@offline': './src/offline',
        '@storage': './src/storage'
      }
    }
  }
});
