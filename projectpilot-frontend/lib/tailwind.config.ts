import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1F3864",
          "navy-light": "#2F5496",
        },
        accent: {
          indigo: "#4F46E5",
          "indigo-hover": "#4338CA",
        },
        risk: {
          high: "#DC2626",
          medium: "#D97706",
          low: "#16A34A",
        },
        sensitive: {
          burnout: "#A21CAF",
        },
        info: "#0284C7",
        background: "#F8FAFC",
        border: "#E2E8F0",
        textPrimary: "#0F172A",
        textSecondary: "#64748B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
}
export default config