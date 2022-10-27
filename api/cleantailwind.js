import { Console } from 'console';
import fs from 'fs'
import cssObj from './alltailwind.js'

//removes preceeding -
let result = {}
Object.keys(cssObj).
  filter((key) => !['hover', 'focus', '@media', 'placeholder', 'transition', 'animation', 'delay'].some(el => key.includes(el))).
  reduce((cur, key) => { return Object.assign(cur, { [key.replace(/_/g, '-')]: (cssObj[key]).map(val => val.replace( /([A-Z])/g, "-$1").toLowerCase()) })}, result);

fs.writeFileSync('./allTailwindClasses.json', JSON.stringify(result, null, 2) , 'utf-8');