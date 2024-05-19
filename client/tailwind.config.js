/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#F0EFF4',
          secondary: '#1E2329',

          // primary: '#000000',
          // secondary: '#FFFFFF',

          hover: '#313338',
          // ... other light mode colors
        },
        dark: {
          primary: '#000300',
          secondary: '#DBDDE2',
          // backgroundColor: '#313338',
          hover: '#313338',
          // ... other dark mode colors
        },
      },
    },
  },
  plugins: [],
  rules: {
    "no-unused-vars": "off"
  }
})