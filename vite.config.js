import {defineConfig} from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'DeckglParticle',
            // the proper extensions will be added
            fileName: 'deckgl-particle',
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            // https://rollupjs.org/guide/en/#big-list-of-options
            external: ['@deck.gl/core', '@deck.gl/layers', '@luma.gl/core'],
            output: {
                globals: {
                    '@deck.gl/core': 'deck',
                    '@deck.gl/layers': 'deck',
                    '@luma.gl/core': 'luma',
                }
            }
        },
        minify: 'terser',
    },
    plugins: [dts({
        staticImport: true,
        outputDir:  path.resolve(__dirname, 'temp'),
    })],
})
