import twClasses from './regexedclasses.json' assert {type: 'json'}

//key = key from tailwind object. str = each string from class=""
const objToCssString = (key, str) => {
    str = str.insert(0, '.')
    //custom value ex. max-w-[400px]
    if(typeof str !== 'string') {
        let tempObj = twClasses[str[0]]
        Object.keys(tempObj).forEach(key => tempObj[key] = tempObj[key] = str[1].replace(/(\[|\])/g, ''))
        return JSON.stringify(twClasses[key]).replace(/(,|})/g, ';').replace(/("|{)/g, '')
    }
    //more than one key. TODO: I think this will break with multiple keys & values with , in them. Like multiple box shadow properties? ignored for now.
    else if (Object.keys(twClasses[key]).length >= 2) return JSON.stringify(twClasses[key]).replace(/(,|})/g, ';').replace(/("|{)/g, '')
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
    var regex = new RegExp(String.raw`<(?<TAG>.+?) (?:(?:class|className)=(?<CLASS>(?:".+?"))).*?>`, 'g')
    html = html.replace(regex, (match,tag,tagMatch) => {
        tagMatch = tagMatch.replace(/"/g, '')
        let tempCss = convertCss(tagMatch)
        const styleTag = ` style="${tempCss}"`
        return match.insert(-1, styleTag)
    })
    return html
}

export default main