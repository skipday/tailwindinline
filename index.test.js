const { default: convert } = require('./index.js')

test('works with various plain tailwind classes', () => {
    const tailwindClassesToTest = 'bg-center bg-gray-500 border-blue-500 border-4 hidden flex-1 justify-items-auto h-56 w-2 mb-10 text-blue-300';
    expect(convert(`<div class="${tailwindClassesToTest}">Dont change this</div>`)).toMatch('<div class="bg-center bg-gray-500 border-blue-500 border-4 hidden flex-1 justify-items-auto h-56 w-2 mb-10 text-blue-300" style="background-position: center; background-color: #a0aec0; border-color: #4299e1; border-width: 4px; display: none; flex: 1  1  0%;  height: 14rem; width: 0.5rem; margin-bottom: 2.5rem; color: #90cdf4; box-sizing: border-box;">Dont change this</div>')
});

test('works with custom colors and sizes', () => {
    const tailwindClassesToTest = 'bg-[#ff00ee] text-[2px] mb-[400px]';
    expect(convert(`<div class="${tailwindClassesToTest}">Dont change this</div>`)).toMatch('<div class="bg-[#ff00ee] text-[2px] mb-[400px]" style="background-color: #ff00ee;  margin-bottom: 400px; box-sizing: border-box;">Dont change this</div>')
})