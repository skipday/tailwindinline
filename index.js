import { CLASSES_IN_TAG, MATCH_TAG, TAG_NAME, DEFAULTS_PER_TAG } from './CONSTANTS.js'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

String.prototype.insert = function (index, string) {
    const ind = index < 0 ? this.length + index : index;
    return this.substring(0, ind) + string + this.substring(ind);
};

export default class TailwindToInline {
    defaultClasses = new Map()
    tailwindConfig = null
    configPromise = null
    customCSS = null

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

        await this.configPromise; // Wait for config to be loaded
        const css = await this.generateCss(html)
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

    generateCss = async (html) => {
        // Process with PostCSS and Tailwind
        const result = await postcss([
            tailwindcss({
                ...this.tailwindConfig,
                content: [{ raw: html, extension: 'html' }]
            })
        ]).process(`
            @tailwind base;
            @tailwind components;
            @tailwind utilities;
            ${this.customCSS || ''}
        `, {
            from: undefined
        });
        
        return result.css;
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
        this.tailwindConfig = {
            content: ["**/*.html"]
        };

        if (options?.config) {
            this.configPromise = import(path.resolve(process.cwd(), options.config))
                .then(userConfig => {
                    if (!userConfig?.default || typeof userConfig.default !== 'object') {
                        throw new Error('Invalid Tailwind config format');
                    }
                    this.tailwindConfig = userConfig.default;
                    if (!this.tailwindConfig.content) {
                        this.tailwindConfig.content = ["**/*.html"];
                    } else if (!this.tailwindConfig.content.some(pattern => pattern.includes("*.html"))) {
                        this.tailwindConfig.content.push("**/*.html");
                    }
                })
                .catch(err => {
                    const error = new Error(`Failed to load Tailwind config: ${err.message}`);
                    error.originalError = err;
                    throw error;
                });
        } else {
            this.configPromise = Promise.resolve();
        }

        if (options?.custom) {
            try {
                // Validate CSS syntax
                postcss.parse(options.custom);
                this.customCSS = options.custom;
            } catch (error) {
                throw new Error(`Invalid custom CSS: ${error.message}`);
            }
        }
    }

    async convert(html) {
        if (typeof html !== 'string') {
            throw new Error('HTML input must be a string');
        }
        if (html.trim().length === 0) {
            throw new Error('HTML input cannot be empty');
        }
        try {
            return await this.main(html);
        } catch (error) {
            throw new Error(`Failed to convert HTML: ${error.message}`);
        }
    }
}