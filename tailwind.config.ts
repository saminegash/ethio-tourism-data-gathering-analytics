import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Color palette extracted from dashboard designs
      colors: {
        // Primary brand colors (emerald/green theme)
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981", // Main primary
          600: "#059669", // Darker primary
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Secondary colors (dark slate/teal for sidebar)
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569", // Sidebar background
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Accent colors
        accent: {
          teal: {
            400: "#2dd4bf",
            500: "#14b8a6",
            600: "#0d9488",
          },
          orange: {
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
          },
        },
        // Neutral grays
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        // Status colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },

      // Typography scale
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
        // Dashboard specific sizes
        "dashboard-title": [
          "2rem",
          { lineHeight: "2.25rem", fontWeight: "700" },
        ],
        "card-title": ["1.25rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        "stat-number": ["2.5rem", { lineHeight: "1", fontWeight: "700" }],
      },

      // Spacing scale for layouts
      spacing: {
        // Layout specific
        sidebar: "280px",
        header: "80px",
        "card-padding": "24px",
        // Grid and gaps
        "grid-gap": "24px",
        "grid-gap-sm": "16px",
        // Custom spacing
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
      },

      // Border radius
      borderRadius: {
        card: "12px",
        button: "8px",
        input: "6px",
        avatar: "50%",
        "stat-card": "16px",
      },

      // Box shadows
      boxShadow: {
        // Card shadows
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        // Dashboard specific
        sidebar: "4px 0 6px -1px rgba(0, 0, 0, 0.1)",
        "stat-card": "0 2px 8px rgba(0, 0, 0, 0.08)",
        floating:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },

      // Grid templates for dashboard layouts
      gridTemplateColumns: {
        dashboard: "280px 1fr",
        stats: "repeat(auto-fit, minmax(250px, 1fr))",
        cards: "repeat(auto-fill, minmax(300px, 1fr))",
      },

      // Animation and transitions
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 0.6s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },

      // Background patterns for dashboard
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #475569 0%, #334155 100%)",
        "gradient-accent": "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
