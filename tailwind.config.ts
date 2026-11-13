import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        paper: "#FAF9F7",
        line: "#E8E5DF",
        accent: {
          DEFAULT: "#0E5A57",
          soft: "#E6F0EF",
          deep: "#093F3D",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,10,11,0.04), 0 12px 32px -8px rgba(10,10,11,0.10)",
        float: "0 24px 60px -12px rgba(9,63,61,0.28)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.94) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        dot: {
          "0%, 80%, 100%": { opacity: "0.25", transform: "translateY(0)" },
          "40%": { opacity: "1", transform: "translateY(-3px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        ping2: {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
        pop: "pop 0.35s cubic-bezier(0.22,1,0.36,1) both",
        dot: "dot 1.2s infinite ease-in-out",
        float: "float 7s infinite ease-in-out",
        ping2: "ping2 2.4s infinite cubic-bezier(0,0,0.2,1)",
      },
    },
  },
  plugins: [],
};

export default config;
