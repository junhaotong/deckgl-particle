import {defineConfig} from 'vite'
import {resolve} from 'path'
import dts from 'vite-plugin-dts'
import {visualizer} from 'rollup-plugin-visualizer';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'DeckglParticle',
            // the proper extensions will be added
            fileName: 'deckgl-particle',
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            plugins: [visualizer()],
            // https://rollupjs.org/guide/en/#big-list-of-options
            external: ['@deck.gl/core', '@deck.gl/layers', '@luma.gl/core', '@luma.gl/engine', '@luma.gl/shadertools'],
            output: {
                globals: {
                    '@deck.gl/core': 'deck',
                    '@deck.gl/layers': 'deck',
                    '@luma.gl/core': 'luma',
                    '@luma.gl/engine': 'luma',
                    '@luma.gl/shadertools': 'luma'
                }
            }
        },
    },
    plugins: [dts({
        staticImport: true,
        outputDir:  resolve(__dirname, 'temp'),
    })],
})
