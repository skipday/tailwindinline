export const TAILWIND_DEFAULTS = 
'box-sizing: border-box;' +
'border-width: 0; border-style: solid;'

export const CLASSES_IN_TAG = /(?:(?:class|className)=(?<CLASS>(?:".+?"))).*?/g;
export const MATCH_TAG = new RegExp(String.raw`<(?!\/).+?>`, 'g');
export const CLASS_ATTRIBUTE = /\w[a-zA-Z0-9-]+(?<VALUE>\[.+?\])/g;
export const CUSTOM_VALUE = /\[.+?\]/g;