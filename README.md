# Why?
I use this library to build a document that looks like the PDF I'd like with tailwind, use the frontend framework I'm using at the moment to insert data and/or graphs (that render to svg, I recommend apache echarts for this rendering functionality) and then output pure HTML from whatever format the framework uses (in  react this is accomplished with ReactDOMServer.renderToString(component)), convert it to inline styled html with this package, and then send the pure html file to a html-to-pdf api like api2pdf (which while unaffiliated seems relatively cheap).

It enables you to at runtime convert from a html string with tailwind classes to a html string inline styled. I find this easier than supplying the PDF API with two files since I haven't found the most reliable pdf generation APIs.

Questions/comments/improvements/suggestions? Contributions welcome.

## Params
* config: Optional path to your tailwind.config.js that you'd like to use with this library. Useful if you have custom theme extensions, like colors or fonts. (relative path)
* custom: Custom css (string)

```npm install tailwindinline```

```javascript
import TailwindToInline from 'tailwindinline'
const twi = new TailwindInline({ config: './path/to/tailwind.config', custom: ".button: { background-color: 'red' }" })

const htmlWithInlineStyles = twi.convert('<div class="pt-2 pb-[40px] border-2 border-[#0f0]"></div>')
/*
<div 
	class="pt-2 pb-[40px] border-2 border-[#0f0]" 
	style="padding-top: 0.5rem; padding-bottom: 40px; border-width: 2px; border-color: #0f0; box-sizing: border-box;"
></div>
```

# Tailwindinline
(Tries to) append a style attribute with computed tailwind classes to the end of each html tag that contained them.

### Planned additions
- [x] remove unneeded styles from classList.json (hover, focus)
- [x] fix syntax of some classnames in classList.json (ex: placeholder:moz-[...])
- [x] custom tailwind classes
- [x] add all tailwind auto-added classes (those that makes sense for this usage)
- [x] import and use a custom tailwindconfig
- [x] implement more consistent regex file
- [ ] rewrite this readme.md
