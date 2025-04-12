# TailwindInline

A utility that converts HTML with Tailwind CSS classes into HTML with inline styles. Perfect for scenarios where you need to convert Tailwind-styled HTML into a format that works with PDF generation services or email clients that don't support external stylesheets.

## Why?

I use this library to build a document that looks like the PDF I'd like with Tailwind, use the frontend framework I'm using at the moment to insert data and/or graphs (that render to SVG, I recommend Apache ECharts for this rendering functionality) and then output pure HTML from whatever format the framework uses (in React this is accomplished with `ReactDOMServer.renderToString(component)`), convert it to inline styled HTML with this package, and then send the pure HTML file to an HTML-to-PDF API like api2pdf (which while unaffiliated seems relatively cheap).

It enables you to at runtime convert from an HTML string with Tailwind classes to an HTML string with inline styles. I find this easier than supplying the PDF API with two files since I haven't found the most reliable PDF generation APIs.

## Features

- Converts Tailwind CSS classes to inline styles
- Supports custom Tailwind configurations
- Allows adding custom CSS that gets processed alongside Tailwind
- Pure in-memory processing with no file system operations
- Preserves existing inline styles
- Handles arbitrary values and complex class combinations
- Fully asynchronous and efficient

## Installation

```bash
npm install tailwindinline
```

## Usage

```javascript
import TailwindToInline from 'tailwindinline'

// Basic usage
const twi = new TailwindToInline()
const htmlWithInlineStyles = await twi.convert('<div class="pt-2 pb-[40px] border-2 border-[#0f0]"></div>')
/*
<div 
  class="pt-2 pb-[40px] border-2 border-[#0f0]" 
  style="padding-top: 0.5rem; padding-bottom: 40px; border-width: 2px; border-color: #0f0; box-sizing: border-box;"
></div>
*/

// With custom Tailwind config
const twiWithConfig = new TailwindToInline({ 
  config: './path/to/tailwind.config.js'
})

// With custom CSS
const twiWithCustom = new TailwindToInline({ 
  custom: `
    .custom-button { 
      background-color: purple;
      border-radius: 9999px;
    }
  `
})

// With both custom config and CSS
const twiWithBoth = new TailwindToInline({ 
  config: './path/to/tailwind.config.js',
  custom: `
    .custom-button { 
      background-color: purple;
      border-radius: 9999px;
    }
  `
})

// All methods return promises
const result = await twiWithBoth.convert('<button class="custom-button p-4">Click me</button>')
```

## Parameters

- `config`: Optional path to your tailwind.config.js file (relative path). Use this if you have custom theme extensions like colors, spacing, or other Tailwind customizations.
- `custom`: Optional CSS string that gets processed alongside Tailwind. Perfect for adding custom styles that aren't part of your Tailwind config.

## How It Works

1. Takes your HTML with Tailwind classes and processes it in memory
2. Applies your custom Tailwind config (if provided) to handle any theme extensions
3. Merges in your custom CSS (if provided) with the Tailwind styles
4. Uses PostCSS and the Tailwind CSS API to generate the final styles
5. Converts all applicable classes to inline styles while preserving any existing inline styles
6. Returns the processed HTML with all styles inlined

The library now processes everything in memory without creating temporary files or running CLI commands, making it faster and more reliable. It properly handles async operations and ensures all styles (Tailwind, custom theme extensions, and custom CSS) are correctly merged and applied.

## Contributing

Questions/comments/improvements/suggestions? Contributions welcome.

## License

MIT
