import classes from './classes.json' assert {type: 'json' }
const defaultClasses = new Map(classes)

const convertToString = (gottenClass, customvalue) => gottenClass ? Object.entries(gottenClass).map(([key, val]) => customvalue ? `${key}: ${customvalue};` : `${key}: ${val};`) : '';

const convertCss = (classArr) => {
    classArr = classArr.replace(/\w[a-zA-Z0-9-]+(?<VALUE>\[.+?\])/g, (match, value) => Array.from([match.replace(/\[.+?\]/g, !value.includes('#') ? '4' : 'white'), value])).split(' ').map(e => (e.match(/,/g)) ? e.split(',') : e)
    if(!classArr.includes('box-content') && !classArr.includes('box-border')) classArr.push('box-border')
    return classArr.map((value) => {
        let classstr, customvalue;
        if(typeof value !== 'string') [classstr, customvalue] = value
        else classstr = value
        return convertToString(defaultClasses.get(`.${classstr}`), customvalue ? customvalue.replace(/\[|\]/g, '') : null)
    }).flat().join(' ')
}

String.prototype.insert = function (index, string) {
    var ind = index < 0 ? this.length + index  :  index;
    return this.substring(0, ind) + string + this.substr(ind);
};

const main = (html) => {
    if(!html) return
    var regex = new RegExp(String.raw`<(?!\/).+?>`, 'g')
    return html.replace(regex, (match) => {
        let styles = ''
        match = match.replace(/(?:(?:class|className)=(?<CLASS>(?:".+?"))).*?/g, (innerClassMatch,innerClasses) => {
            innerClasses = innerClasses.replace(/"|'/g, '')
            styles = convertCss(innerClasses)
            return innerClassMatch
        })
        if(!styles) return match
        const styleTag = ` style="${styles}"`
        if(match.match(/(?:style=".+?")/g)) return match.replace(/(?:style=".+?")/g, (e,m,x) => e.insert(-1, '; ' + styles))
        else return match.insert(-1, styleTag )
    })
}

export default main