export default () => ({
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  services: {
    auth: process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001',
    wallet: process.env.WALLET_SERVICE_URL ?? 'http://localhost:3002',
    catalog: process.env.CATALOG_SERVICE_URL ?? 'http://localhost:3003',
    telemetry: process.env.TELEMETRY_SERVICE_URL ?? 'http://localhost:3004'
  }
});
