import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const classes = require('./classes.json')
import { TAILWIND_DEFAULTS, CLASSES_IN_TAG, CLASS_ATTRIBUTE, CUSTOM_VALUE, MATCH_TAG, TAG_NAME, DEFAULTS_PER_TAG } from './CONSTANTS.js'
const defaultClasses = new Map(classes)

const convertToString = (gottenClass, customvalue) => gottenClass ? Object.entries(gottenClass).map(([key, val]) => customvalue ? `${key}: ${customvalue};` : `${key}: ${val};`) : '';

function cssClassStringFromArray([head, ...tail]) {
    let classStr, customValue;
    if(typeof head !== 'string') [classStr, customValue] = head;
    else classStr = head;
    if(tail.length < 1) return convertToString(defaultClasses.get(`.${classStr}`), customValue ? customValue.replace(/\[|\]/g, '') : null)
    return convertToString(defaultClasses.get(`.${classStr}`), customValue ? customValue.replace(/\[|\]/g, '') : null) + cssClassStringFromArray(tail)
}

const convertCss = (classArr) => {
    classArr = classArr.replace(CLASS_ATTRIBUTE, (match, value) => {
        let defaultValue = !value.includes('#') ? '4' : 'white';
        return Array.from([match.replace(CUSTOM_VALUE, defaultValue), value])
    }).split(' ').map(e => e.match(/,/g) ? e.split(',') : e);
    return TAILWIND_DEFAULTS + cssClassStringFromArray(classArr)
}

String.prototype.insert = function (index, string) {
    const ind = index < 0 ? this.length + index : index;
    return this.substring(0, ind) + string + this.substring(ind);
 };

const main = (html) => {
    if(!html) return
    return html.replace(MATCH_TAG, (match) => {
        let styles = ''
        match = match.replace(CLASSES_IN_TAG, (innerClassMatch, innerClasses) => {
            innerClasses = innerClasses.replace(/"|'/g, '')
            styles = convertCss(innerClasses)
            return innerClassMatch
        })
        const res = TAG_NAME.exec(match)
        if(DEFAULTS_PER_TAG.has(res?.[1])) styles = DEFAULTS_PER_TAG.get(res?.[1]) + styles || ''
        if(!styles) return match
        const styleTag = ` style="${styles}"`
        if(match.match(/(?:style=".+?")/g)) return match.replace(/(?:style=".+?")/g, (e,m,x) => e.insert(-1, '; ' + styles))
        else return match.insert(-1, styleTag )
    })
}

export default main