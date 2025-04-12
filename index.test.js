import TailwindToInline from './index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('TailwindToInline', () => {
    let twi;

    beforeEach(() => {
        twi = new TailwindToInline();
    });

    test('converts basic Tailwind classes to inline styles', async () => {
        const html = '<div class="pt-2 pb-4">Test</div>';
        const result = await twi.convert(html);
        expect(result).toMatch("<div class=\"pt-2 pb-4\" style=\"padding-top: 0.5rem;padding-bottom: 1rem;\">Test</div>");
    });

    test('handles arbitrary values correctly', async () => {
        const html = '<div class="pt-[20px] text-[#ff0000] w-[50%]">Test</div>';
        const result = await twi.convert(html);
        expect(result).toMatch(/style=".*padding-top: 20px.*--tw-text-opacity: 1.*color: rgb\(255 0 0 \/ var\(--tw-text-opacity.*\).*"/);
    });

    test('preserves existing inline styles', async () => {
        const html = '<div class="pt-2" style="color: red;">Test</div>';
        const result = await twi.convert(html);
        expect(result).toMatch(/style=".*padding-top: 0\.5rem.*color: red.*"/);
    });

    test('handles multiple classes and complex values', async () => {
        const html = '<div class="bg-blue-500 text-white p-4 rounded-lg">Test</div>';
        const result = await twi.convert(html);
        expect(result).toMatch(/style=".*background-color:.*rgb\(59 130 246.*color:.*rgb\(255 255 255.*padding: 1rem.*border-radius: 0\.5rem.*"/);
    });

    describe('with custom Tailwind config', () => {
        test('applies custom theme extensions', async () => {
            const configPath = path.join(__dirname, 'test.config.js');
            const twiWithConfig = new TailwindToInline({ config: configPath });
            
            const html = '<div class="bg-custom-blue text-custom-red p-custom">Test</div>';
            const result = await twiWithConfig.convert(html);
            
            expect(result).toMatch(/style=".*background-color: rgb\(18 52 255.*color: rgb\(255 18 52.*padding: 3rem.*"/);
        });
    });

    describe('with custom CSS', () => {
        test('applies custom CSS styles', async () => {
            const customCSS = `
                .custom-button {
                    background-color: purple;
                    border-radius: 9999px;
                }
            `;
            const twiWithCustom = new TailwindToInline({ custom: customCSS });
            
            const html = '<button class="custom-button p-4">Test</button>';
            const result = await twiWithCustom.convert(html);
            
            expect(result).toMatch(/style=".*background-color: purple.*border-radius: 9999px.*padding: 1rem.*"/);
        });
    });

    describe('with both config and custom CSS', () => {
        test('applies both custom theme and custom CSS', async () => {
            const configPath = path.join(__dirname, 'test.config.js');
            const customCSS = `
                .custom-button {
                    background-color: purple;
                    border-radius: 9999px;
                }
            `;
            const twiWithBoth = new TailwindToInline({ 
                config: configPath,
                custom: customCSS 
            });
            
            const html = '<button class="custom-button bg-custom-blue p-custom">Test</button>';
            const result = await twiWithBoth.convert(html);
            
            expect(result).toMatch(/style=".*background-color: purple.*border-radius: 9999px.*padding: 3rem.*"/);
        });
    });
});