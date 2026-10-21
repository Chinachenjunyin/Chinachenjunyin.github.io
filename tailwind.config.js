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
        background: "#EEF0FA",
        surface: "#FFFFFF",
        "surface-light": "#E8EAF6",
        primary: "#6366F1",
        "primary-glow": "rgba(99, 102, 241, 0.35)",
        secondary: "#F472B6",
        "secondary-glow": "rgba(244, 114, 182, 0.3)",
        text: "#1E293B",
        "text-muted": "#64748B",
        border: "#E2E8F0",
      },
      fontFamily: {
        display: ['"Noto Serif SC"', '"Noto Sans SC"', 'serif'],
        body: ['"Noto Serif SC"', '"Noto Sans SC"', 'sans-serif'],
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.25)" },
          "50%": { boxShadow: "0 0 40px rgba(99, 102, 241, 0.45)" },
        },
      },
    },
  },
  plugins: [],
};
