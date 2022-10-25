import CheatSheet from './cheatsheet.js'
import { arbitrarySupportedClasses } from './cheatsheet.js';
import juice from 'juice';

const convertToCSS = (classNames) => {
    //tailwind to css
    classNames = classNames.split(/\s+/).map((i) => '.' + i.trim());
    let cssCode = ``;
    CheatSheet.forEach((element) => {
        element.content.forEach((content) => {
            content.table.forEach((list) => {
                // console.log(list)
                if (classNames.includes(list[0])) {
                    const semicolon = list[1][list[1].length - 1] !== ';' ? ';' : '';
                    if (list.length === 3) cssCode += `${list[1]}${semicolon} `;
                    else cssCode += `${list[2]}${semicolon} \n`;
                }

                if (classNames.includes(list[1])) {
                    const semicolon = list[2][list[2].length - 1] !== ';' ? ';' : '';
                    cssCode += `${list[2]}${semicolon} `;
                }
            });
        });
    });

    // Check for arbitrary values
    const arbitraryClasses = classNames.filter((className) => className.includes('['));
    arbitraryClasses.forEach((className) => {
        const property = className.split('-[')[0].replace('.', '');
        const properyValue = className.match(/(?<=\[)[^\][]*(?=])/g)[0];
        if (arbitrarySupportedClasses[property]) {
            cssCode += `${arbitrarySupportedClasses[property]}: ${properyValue};`;
        }
    });

    return cssCode;
};

const main = (html) => {
    let css = html.match(/class="(.*)"/g).join().replace('class="', '').replace('"', '')
    var regex = new RegExp('\<(?<TAG>[a-z]{1,15}) (?:(?:class|className)="(?<CLASS>.+?)")?', 'g')
    let match = Array.from(html.matchAll(regex), (m) => [m.groups.TAG, m.groups.CLASS])
    console.log(match)
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