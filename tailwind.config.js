/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include paths to all your component files
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  // Disable any classes that might conflict with Native Base
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}