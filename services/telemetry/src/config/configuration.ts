export default () => ({
  port: Number.parseInt(process.env.PORT ?? '3004', 10),
  kafkaBrokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  clickhouse: {
    url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER ?? 'default',
    password: process.env.CLICKHOUSE_PASSWORD ?? ''
  },
  postgres: {
    url: process.env.DATABASE_URL ?? ''
  }
});
