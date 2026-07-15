/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#13131F",
        "surface-light": "#1E1E2E",
        primary: "#FF6B35",
        "primary-glow": "rgba(255, 107, 53, 0.4)",
        secondary: "#00D9FF",
        "secondary-glow": "rgba(0, 217, 255, 0.3)",
        text: "#FAFAFA",
        "text-muted": "#8A8A9A",
        border: "#2A2A3A",
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Space Grotesk"', '"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        "gradient-shift": "gradientShift 20s ease infinite",
        "bounce-slow": "bounceSlow 2s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 107, 53, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 107, 53, 0.5)" },
        },
      },
    },
  },
  plugins: [],
};
