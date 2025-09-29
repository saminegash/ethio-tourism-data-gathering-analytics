/** @type {import('next').NextConfig} */
const nextConfig = {
  // For demo purposes, ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build for demo
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Environment variables for demo
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key',
  },
};

module.exports = nextConfig;
