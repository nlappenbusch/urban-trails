import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // APP-LOOK: ink = Flächen (weiss/grau), cream = Text (zink)
        ink: {
          950: "#fafaf9",
          900: "#ffffff",
          800: "#f4f4f5",
          700: "#e4e4e7",
        },
        cream: {
          DEFAULT: "#18181b",
          dim: "#3f3f46",
          faint: "#71717a",
        },
        signal: {
          400: "#ff7a3d",
          500: "#ff4d00",
          600: "#d63f00",
        },
        acid: {
          400: "#e4ff5e",
          500: "#d8ff3e",
        },
        glacier: {
          50: "#fff7ed",
          100: "#ffedd5",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        sunset: {
          400: "#ff7a3d",
          500: "#ff4d00",
          600: "#d63f00",
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "'Inter'", "sans-serif"],
        sans: ["'Inter'", "-apple-system", "Segoe UI", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        "fade-in": "fadeIn 1s ease-out both",
        "ticker": "ticker 28s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
