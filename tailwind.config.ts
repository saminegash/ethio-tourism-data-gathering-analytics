import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base theme colors using CSS variables
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Ethiopian-inspired color palette
        ethiopia: {
          // Green from the flag
          green: {
            50: "#f0f9f3",
            100: "#dcf2e0",
            200: "#bce5c7",
            300: "#8fd3a0",
            400: "#5cb871",
            500: "#3a9d4f", // Main Ethiopian green
            600: "#2d7f3f",
            700: "#266635",
            800: "#22522d",
            900: "#1e4426",
          },
          // Yellow from the flag
          yellow: {
            50: "#fefcf0",
            100: "#fef7d3",
            200: "#fdeaa7",
            300: "#fbd970",
            400: "#f8c237",
            500: "#f2a814", // Main Ethiopian yellow
            600: "#d7850a",
            700: "#b3630c",
            800: "#914e11",
            900: "#784113",
          },
          // Red from the flag
          red: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444", // Main Ethiopian red
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
          },
        },

        // Enhanced semantic colors
        primary: {
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },

        secondary: {
          50: "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
        },

        accent: {
          50: "var(--color-accent-50)",
          100: "var(--color-accent-100)",
          200: "var(--color-accent-200)",
          300: "var(--color-accent-300)",
          400: "var(--color-accent-400)",
          500: "var(--color-accent-500)",
          600: "var(--color-accent-600)",
          700: "var(--color-accent-700)",
          800: "var(--color-accent-800)",
          900: "var(--color-accent-900)",
        },

        // Enhanced surfaces
        surface: {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
        },

        // Borders
        border: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
        },
      },

      // Enhanced box shadows
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "soft-dark":
          "0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)",
        glow: "0 0 20px rgba(58, 157, 79, 0.15)",
        "glow-dark": "0 0 20px rgba(58, 157, 79, 0.3)",
      },

      // Custom gradients
      backgroundImage: {
        "ethiopia-gradient":
          "linear-gradient(135deg, #3a9d4f 0%, #f2a814 50%, #ef4444 100%)",
        "ethiopia-subtle":
          "linear-gradient(135deg, #f0f9f3 0%, #fefcf0 50%, #fef2f2 100%)",
        "ethiopia-dark":
          "linear-gradient(135deg, #1e4426 0%, #784113 50%, #7f1d1d 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
