import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "light": "#EDE3E4",
        "dark": "#231F20",
        "primary": "#39A0ED",
        "secondary": "#357266",
        "danger": "#EF626C"
      },
    },
  },
  plugins: [],
} satisfies Config;
