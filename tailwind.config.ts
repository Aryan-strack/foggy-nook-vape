import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        black: {
          DEFAULT: "#0B0B0B",
          soft: "#111111",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F5D76E",
        },
        gray: {
          muted: "#9E9E9E",
        },
        border: "rgba(212, 175, 55, 0.15)",
        background: "#0B0B0B",
        foreground: "#FFFFFF",
        card: "#111111",
        input: "rgba(255,255,255,0.05)",
        ring: "#D4AF37",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        gold: "0 0 30px rgba(212, 175, 55, 0.25)",
        soft: "0 10px 40px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #D4AF37 100%)",
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
      },
      keyframes: {
        smoke: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.4" },
          "50%": { opacity: "0.15" },
          "100%": { transform: "translateY(-120px) scale(1.8)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        smoke: "smoke 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
