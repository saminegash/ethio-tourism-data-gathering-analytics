export default () => ({
  port: Number.parseInt(process.env.PORT ?? '3003', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  search: {
    provider: process.env.SEARCH_PROVIDER ?? 'postgres',
    apiKey: process.env.SEARCH_API_KEY ?? ''
  }
});
