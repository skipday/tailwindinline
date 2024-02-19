import fs from 'fs'
import { exec } from 'child_process'
import { CLASSES_IN_TAG, MATCH_TAG, TAG_NAME, DEFAULTS_PER_TAG } from './CONSTANTS.js'
import postcss from 'postcss'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
import path from 'path'

String.prototype.insert = function (index, string) {
    const ind = index < 0 ? this.length + index : index;
    return this.substring(0, ind) + string + this.substring(ind);
 };

export default class TailwindToInline {
    defaultClasses = []

    convertToString = (gottenClass, customvalue) => gottenClass ? Object.entries(gottenClass).map(([key, val]) => customvalue ? `${key}: ${customvalue};` : `${key}: ${val};`).join('') : '';

    cssClassStringFromArray = ([head, ...tail]) => {
        let customValue;
        if(tail.length < 1) return this.convertToString(this.defaultClasses.get(`.${head}`), customValue ? customValue.replace(/\[|\]/g, '') : null)
        return this.convertToString(this.defaultClasses.get(`.${head}`), customValue ? customValue.replace(/\[|\]/g, '') : null) + this.cssClassStringFromArray(tail)
    }

    escapeAll = (str) => {
        return str.replace(/\./g, '\\.') 
        .replace(/\[/g, '\\[') 
        .replace(/\]/g, '\\]') 
        .replace(/\//g, '\\/')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\#/g, '\\#')
    }
    
    convertCss = (classArr) => {
        classArr = this.escapeAll(classArr).split(' ').map(e => e.match(/,/g) ? e.split(',') : e);
        return this.convertToString(this.defaultClasses.get('*,:after,:before')) + this.cssClassStringFromArray(classArr)
    }
    
    main = async (html) => {
        if(!html) return

        const css = await this.cssFromHtml(html)
        this.defaultClasses = this.mapFromCss(css)
        return html.replace(MATCH_TAG, (match) => {
            let styles = ''
            match = match.replace(CLASSES_IN_TAG, (innerClassMatch, innerClasses) => {
                innerClasses = innerClasses.replace(/"|'/g, '')
                styles = this.convertCss(innerClasses)
                return innerClassMatch
            })
            TAG_NAME.lastIndex = 0
            const res = TAG_NAME.exec(match)
            if(DEFAULTS_PER_TAG.has(res?.[1])) styles = DEFAULTS_PER_TAG.get(res?.[1]) + styles || ''
            if(!styles) return match
            const styleTag = ` style="${styles}"`
            if(match.match(/(?:style=".+?")/g)) return match.replace(/(?:style=".+?")/g, (e,m,x) => {
                const existing = e.match(/(?:style="(.+?)")/)[1]
                return `style="${styles} ${existing}"`
            })
            else return match.insert(-1, styleTag )
        })
    }

    clearOutputFolder = () => {
        fs.readdir(`${__dirname}/convert`, (err, files) => {
            if (err) throw err
            for (const file of files) {
                fs.unlink(`${__dirname}/convert/${file}`, err => {
                    if (err) throw err
                })
            }
        })
    }

    cssFromHtml = async (html) => {
        if(!fs.existsSync(`${__dirname}/convert`)) fs.mkdirSync(`${__dirname}/convert`)
        fs.writeFileSync(`${__dirname}/convert/index.html`, html)

        const css =  await new Promise((res, rej) => exec(`npx tailwindcss -c ${__dirname}/tailwind.config.js -i ${__dirname}/input.css -o ${__dirname}/convert/output.css --minify`, (err, stdout, stderr) => {
            if (err) {
                console.error(err)
                rej(err)
                return
            }
            const output = fs.readFileSync(`${__dirname}/convert/output.css`, 'utf8')
            res(output)
        }))
        // this.clearOutputFolder()
        return css
    }

    mapFromCss = (css) => {
        const root = postcss.parse(css)
        const result = []
        root.walkRules(rule => {
            const propObject = {}
            rule.nodes.forEach(node => { 
                propObject[node.prop] = node.value
            })
            result.push([`${rule.selector}`, propObject])
        })
        return new Map(result)
    }

    constructor(options) {
        if(options?.config && fs.existsSync(path.resolve(process.cwd(), options?.config))) {
            import(path.resolve(process.cwd(), options.config)).then(userConfig => {
                const config = userConfig.default
                config.content = ["**/*.html"]
                fs.writeFileSync(`${__dirname}/tailwind.config.js`, `/** @type {import('tailwindcss').Config} */ \n export default ${JSON.stringify(config)}`, 'utf8')
                if(!options?.custom) return
                else if(typeof options.custom !== 'string') throw new Error('Custom must be a string of css')
                else this.defaultClasses = this.mapFromCss(options.custom)
            }).catch(err => {
                throw new Error('Error importing tailwind config. Please make sure the path is correct and the file is in es6 module format', err)
            });
        } else {
            if(!options?.custom) return
            else if(typeof options.custom !== 'string') throw new Error('Custom must be a string of css')
            else this.defaultClasses = this.mapFromCss(options.custom)
        }
    }

    convert(html) {
        return this.main(html)
    }
}