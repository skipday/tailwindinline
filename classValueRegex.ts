const classDeclarationPattern = "class(?:Name)?="
const classValuePattern = "(?<CLASS_VALUE>.+?)"
const quoteCharPattern = `(?<QUOTE_CHAR>'|")`
const classQuoteCharExpression = new RegExp(`${classDeclarationPattern}${quoteCharPattern}`)
const tagExpression: RegExp = /<(?!\/).+?>/g


function getClassPattern(input: string) {
    const quoteChar = classQuoteCharExpression.exec(input)?.groups?.QUOTE_CHAR
    return quoteChar !== undefined ? `${classDeclarationPattern}${quoteChar}${classValuePattern}${quoteChar}` : ""
}

function extractGroups(input: string) {
    return input.match(new RegExp(getClassPattern(input)))?.groups
}

function extractTags(input: string) {
    console.log(`\ninput = ${input}`)
    var tagContentMatch
    while ((tagContentMatch = tagExpression.exec(input)) !== null) {
        const groups = extractGroups(tagContentMatch[0]) || {}
        Object.entries(groups).forEach(([groupName, value], index) => console.log(`\t${index}: ${groupName}=${value}`))
    }
}

extractTags(`<div class="shadow text-blue-500 mb-2" data="ad" anotherattr="sm-vl"><span className='bg-green-200'>hello there</span></div><div data='asd'>asd</div>`)
extractTags(`<div class="sha'text'-2"><span className='bg-"green"-200'>`)