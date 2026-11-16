import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Freundliche App: ink = Flächen (Sandgrund, weisse Karten), cream = Text (warmes Dunkelbraun)
        ink: {
          950: "#f6efe6",
          900: "#ffffff",
          800: "#efe6da",
          700: "#e2d4c3",
        },
        cream: {
          DEFAULT: "#2b241f",
          dim: "#5c4f46",
          faint: "#73645a",
        },
        // Aktion: nur auf Antippbarem. 500 = Fläche (weisse Schrift ≥ 4.5:1), 600 = Linktext
        signal: {
          400: "#ff7a3d",
          500: "#d63f00",
          600: "#b33500",
          700: "#962c00",
        },
        brand: "#ff4d00",
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
          500: "#d63f00",
          600: "#b33500",
        },
      },
      fontFamily: {
        display: ["var(--font-figtree)", "system-ui", "sans-serif"],
        sans: ["var(--font-figtree)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(43,36,31,0.05), 0 10px 28px -14px rgba(43,36,31,0.22)",
        lift: "0 2px 4px rgba(43,36,31,0.06), 0 18px 40px -16px rgba(43,36,31,0.28)",
        bar: "0 -1px 0 rgba(43,36,31,0.06), 0 -8px 24px -12px rgba(43,36,31,0.18)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        "fade-in": "fadeIn 1s ease-out both",
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
      },
    },
  },
  plugins: [],
};

export default config;
