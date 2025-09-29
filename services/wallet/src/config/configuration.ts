export default () => ({
  port: Number.parseInt(process.env.PORT ?? '3002', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  kafkaBrokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  telebirr: {
    apiKey: process.env.TELEBIRR_API_KEY ?? '',
    apiUrl: process.env.TELEBIRR_API_URL ?? ''
  },
  coopay: {
    apiKey: process.env.COOPAY_API_KEY ?? '',
    apiUrl: process.env.COOPAY_API_URL ?? ''
  }
});
