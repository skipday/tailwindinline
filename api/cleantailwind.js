import { Console } from 'console';
import fs from 'fs'
import cssObj from './alltailwind.js'

//removes preceeding -
let mt
Object.keys(cssObj).forEach(key => (key === 'mt_2') ? mt = key :  '')
console.log(mt)

fs.writeFileSync('./allTailwindClasses.json', JSON.stringify(cssObj, null, 2) , 'utf-8');