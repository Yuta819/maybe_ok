import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -20px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
