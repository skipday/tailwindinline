```javascript
npm install tailwindinline

import convert from 'tailwindinline'
const htmlWithInlineStyles = convert('<div class="pt-2 pb-[40px] border-2 border-[#0f0]"></div>')
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
- [ ] import and use a custom tailwindconfig
- [ ] implement more consistent regex file
