/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Dynamic classes constructed in code (e.g., text-green-600)
    { pattern: /(bg|text|border|shadow)-(green|red|yellow|purple|blue|orange|slate)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /from-(green|red|yellow|purple|blue|orange|slate)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /to-(green|red|yellow|purple|blue|orange|slate)-(50|100|200|300|400|500|600|700|800|900)/ }
  ]
};
