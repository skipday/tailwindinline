/** @type {import('tailwindcss').Config} */
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const outerConfig = require(`${appDir}/tailwind.config.js`)
const outerExtend = outerConfig?.theme?.extend || {}

export default {
  content: ["**/*.html"],
  theme: {
    extend: {
      ...outerExtend
    },
  },
  plugins: [],
}