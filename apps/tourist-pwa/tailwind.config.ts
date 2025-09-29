import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7ff',
          500: '#1d4ed8',
          600: '#1e40af'
        }
      }
    }
  },
  plugins: []
};

export default config;
