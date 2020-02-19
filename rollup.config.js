import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint';


export default {
  input: 'src/masonry.ts',
  output: [
    {
      file: 'lib/masonry.js',
      format: 'cjs'
    },
    {
      file: 'lib/masonry.browser.js',
      format: 'iife',
      name: 'FristysMasonry'
    }
  ],
  plugins: [eslint(), typescript(), uglify()]
};