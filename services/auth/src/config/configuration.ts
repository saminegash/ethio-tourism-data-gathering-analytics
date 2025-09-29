export default () => ({
  port: Number.parseInt(process.env.PORT ?? '3001', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    anonKey: process.env.SUPABASE_ANON_KEY ?? ''
  },
  immigrationApi: {
    baseUrl: process.env.IMMIGRATION_API_URL ?? '',
    apiKey: process.env.IMMIGRATION_API_KEY ?? ''
  },
  fayda: {
    baseUrl: process.env.FAYDA_API_URL ?? '',
    apiKey: process.env.FAYDA_API_KEY ?? ''
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'set-a-secure-secret',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ?? 'set-a-secure-refresh-secret'
  }
});
