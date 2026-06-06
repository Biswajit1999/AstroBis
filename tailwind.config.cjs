/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        space: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3d5',
          400: '#82a5ce',
          500: '#5e72e4',
          600: '#5a67d8',
          700: '#434190',
          800: '#2d3748',
          900: '#1a202c',
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
        'nebula': 'radial-gradient(circle at 30% 50%, rgba(138, 43, 226, 0.3) 0%, rgba(75, 0, 130, 0.2) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
