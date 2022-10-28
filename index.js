import twClasses from './classList.json' //assert {type: 'json' }
//key = key from tailwind object. str = each string from class=""
const objToCssString = (key, str) => {
    if(typeof str !== 'string') { //{ [ gap: 1rem, row-gap: 1rem ] } => gap: 1rem; row-gap: 1rem;
        str[0] = str[0].insert(0, '.')
        let tempObj = twClasses[str[0]]
        Object.keys(tempObj).forEach(key => tempObj[key] = tempObj[key] = str[1].replace(/(\[|\])/g, ''))
        return JSON.stringify(twClasses[key]).replace(/(,|})/g, ';').replace(/("|{)/g, '')
    }
    //more than one key. TODO: I think this will break with multiple keys & values with , in them. Like multiple box shadow properties? ignored for now.
    else if (Object.keys(twClasses[key]).length >= 2) {return JSON.stringify(twClasses[key]).replace(/(,|})/g, ';').replace(/("|{)/g, '')}
    else  return JSON.stringify(twClasses[key]).replace(/(})/g, ';').replace(/("|{)/g, '')
}

const convertCss = (classArr) => {
    classArr = classArr.replace(/\w[a-zA-Z0-9-]+(?<VALUE>\[.+?\])/g, (match, value) => Array.from([match.replace(value, '4'), value])).split(' ')
    .map(e => (e.match(/,/g)) ? e.split(',') : e)
    let result = []
    Object.keys(twClasses).forEach(key => {
        classArr.forEach(str => {
            if(key !== '.' + str && key !== '.' + str[0]) return
            result.push(objToCssString(key, str))
        })
    })
    return result.join(' ')
}

String.prototype.insert = function (index, string) {
    var ind = index < 0 ? this.length + index  :  index;
    return  this.substring(0, ind) + string + this.substr(ind);
};

const main = (html) => {
    if(!html) return
    var regex = new RegExp(String.raw`<(?!\/).+?>`, 'g')
    html = html.replace(regex, (match,tag,tagMatch) => {
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
    return html
}

export default main