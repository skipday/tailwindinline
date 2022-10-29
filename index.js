import twClasses from './classList.json' assert {type: 'json' }
const classList = new Map(Object.entries(twClasses));
//key = key from tailwind object. str = each string from class=""
const objToCssString = (key, customValue = false, tag) => {
    if(customValue) Object.entries(key)[0][1] = customValue
    return Object.entries(key)[0].join(': ')
}

const convertCss = (classArr) => {
    classArr = classArr.replace(/\w[a-zA-Z0-9-]+(?<VALUE>\[(.+?)\])/g, (match, value) => Array.from([match.replace(value, '4'), value])).split(' ')
    .map(e => (e.match(/,/g)) ? e.split(',') : e)
    if(!classArr.includes('box-content') && !classArr.includes('box-border')) classArr.push('box-border')
    let result = []
    classArr.forEach(classN => {
        if(typeof classN !== 'string') {
            classN[1] = classN[1].replace(/\[|\]/g, '')
            classList.has(`.${classN[0]}`) ? result.push(objToCssString(classList.get(`.${classN[0]}`),classN[1])) : ''
        } else classList.has(`.${classN}`) ? result.push(objToCssString(classList.get(`.${classN}`))) : ''
    })
    return result.join('; ')
}

String.prototype.insert = function (index, string) {
    var ind = index < 0 ? this.length + index  :  index;
    return  this.substring(0, ind) + string + this.substr(ind);
};

const main = (html) => {
    if(!html) return
    var regex = new RegExp(String.raw`<(?!\/).+?>`, 'g')
    return html.replace(regex, (match) => {
        let styles = ''
        match = match.replace(/(?:(?:class|className)=(?<CLASS>(?:".+?"))).*?/g, (m,innerClasses) => {
            innerClasses = innerClasses.replace(/"|'/g, '')
            styles = convertCss(innerClasses)
            return m
        })
        if(!styles) return match
        const styleTag = ` style="${styles}"`
        //maybe if ; at end of style tag dont add it? does two fuck it up? Probably.
        if(match.match(/(?:style=".+?")/g)) return match.replace(/(?:style=".+?")/g, (e,m,x) => e.insert(-1, '; ' + styles))
        else return match.insert(-1, styleTag )
    })
}

export default main