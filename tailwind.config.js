/** @type {import('tailwindcss').Config} */
import fs from 'fs'
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

let outerExtend = {}
if(fs.existsSync(`${appDir}/tailwind.config.js`)) {
  const outerConfig = require(`${appDir}/tailwind.config.js`)
  outerExtend = outerConfig?.theme?.extend
}


export default {
  content: ["**/*.html"],
  theme: {
    extend: {
      ...outerExtend
    },
  },
  plugins: [],
}