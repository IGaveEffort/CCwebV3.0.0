import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#eaebff",
        ink: "#12283f",
        accent: "#a79dfd",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(18,40,63,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      }
    },
  },
  plugins: [],
} satisfies Config;
