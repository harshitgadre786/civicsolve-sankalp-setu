/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          sidebar: '#071412',
          sidebarActive: '#1F2927',
          green: '#16AF82',
          greenHover: '#13976f',
          greenLight: '#DDF2E7',
          bg: '#F5F6F4',
          card: '#FFFFFF',
          border: '#E7EBE8',
          text: '#18201E',
          muted: '#7A8581',
          danger: '#E5605F',
          warning: '#E8BE5A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
