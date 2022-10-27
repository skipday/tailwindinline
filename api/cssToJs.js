import { convert } from '@americanexpress/css-to-js';
import fs from 'fs';

const tw = fs.readFileSync('./purgedTw.css').toString()
convert(tw, { outputType: 'file', outputPath: 'example.js' });