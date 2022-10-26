import CheatSheet from './cheatsheet.js'
import { arbitrarySupportedClasses } from './cheatsheet.js';
import juice from 'juice';
import twClasses from './allTailwindClasses.json' assert {type: 'json'}

const convertCss = (classArr) => {
    //for each key in twclasses, see if it matches the current string. If it does, replace the string with the value of the key
    classArr = classArr.split(' ')
    let result = []
    Object.keys(twClasses).forEach(key => {
        //TODO: with an input mb-[24px], look for the first mb, get the key value pair and replace the value with the content inside []
        classArr.forEach(str => {
            if(key !== str) return
            let tempres = JSON.stringify(twClasses[key]).replace(/"/g, '').replace('{', '').replace('}', ';')
            result.push(tempres)
        })
    })
    return result.join(' ')
}

const main = (html) => {
    //given an input html string, match tag for tag with class="" and replace the tag with convertCss + juice result
    var regex = new RegExp('\<(?<TAG>[a-z]{1,15}) (?:(?:class|className)="(?<CLASS>.+?)")?', 'g')
    html = html.replace(regex, (match,tag,tagMatch) => {
        //extract and convert classnames
        let tempCss = convertCss(tagMatch)
        const toJuice = `${tag} { ${tempCss} }`
        
        let testStr = '<div></div>'
        console.log(juice.inlineContent(testStr, toJuice))
    })
    // console.log(html)
    /*
    let css = html.match(/class="(.*)"/g).join().replace('class="', '').replace('"', '')
    var tempreg = /\<(?<TAG>[a-z]{1,15}) (?:(?:class|className)=(?<CLASS>(?:'.+?')|".+?"))?/g
    var regex = new RegExp('\<(?<TAG>[a-z]{1,15}) (?:(?:class|className)="(?<CLASS>.+?)")?', 'g')
    let match = Array.from(html.matchAll(regex), (m) => [m.groups.TAG, m.groups.CLASS])
    match.forEach(arr => {
        convertCss(match[0][1])
    })
    */
    //spit out the 

    /*
    css = `${match[0]} { ${match[1]} }`
    console.log(css)*/
    /*
    css = convertToCSS(css)
    css = css.split(' ')
    css = ['{', ...css, '}']
    html = html.replace(/ class="(.*)"/g, '')
    //css to inline styling
    console.log(css)
    //append the html tag to the start with brackets
    let test2 = 'p { color: green }'
    let test = juice.inlineContent(html, test2)
    console.log(test)*/
}

export default main