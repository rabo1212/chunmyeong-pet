import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pet: {
          dark: "#1a1520",
          deep: "#2a2230",
          cream: "#f5e6d3",
          apricot: "#e8a87c",
          light: "#f0e6d8",
          red: "#d4483b",
          blue: "#7cb3e8",
          lavender: "#c89be8",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-kr)", "sans-serif"],
        serif: ["serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-apricot": "pulseApricot 2s ease-in-out infinite",
        "paw-bounce": "pawBounce 1.5s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseApricot: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(232, 168, 124, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(232, 168, 124, 0.5)" },
        },
        pawBounce: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-6px) rotate(-5deg)" },
          "75%": { transform: "translateY(-3px) rotate(5deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
