import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import MkCert from 'vite-plugin-mkcert';
import eslintPlugin from 'vite-plugin-eslint';
import { resolve } from 'path';

const optimizeDeps = {
  exclude: [],
  include: []
};

const plugins = [
  vue(),
  MkCert(),
  eslintPlugin({
    include: [
      'src/**/*.js',
      'src/**/*.jsx',
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.vue',
      'example/**/*.js',
      'example/**/*.jsx',
      'example/**/*.ts',
      'example/**/*.tsx',
      'example/**/*.vue'
    ]
  })
];

const server = {
  port: 8080,
  https: true
};

export default defineConfig(({ command, mode }) => {
  console.log('command - ', command);
  console.log('mode - ', mode);
  if (command === 'serve' || (command === 'build' && mode === 'development')) {
    return {
      root: './example',
      optimizeDeps,
      plugins,
      build: {
        minify: false,
        // lib: {
        //   entry: resolve('./src/vuedraggable.js'),
        //   name: 'vuedraggable',
        //   formats: ['es', 'umd', 'cjs']
        // },
        outDir: '../docs',
        rollupOptions: {
          // // make sure to externalize deps that shouldn't be bundled
          // // into your library
          external: ['vue', 'sortablejs'],
          output: {
            inlineDynamicImports: false,
            // Provide global variables to use in the UMD build
            // for externalized deps
            globals: {
              vue: 'Vue',
              sortablejs: 'Sortable'
            }
          }
        }
      },
      server,
      resolve: {
        alias: [
          {
            find: '@',
            replacement: resolve(__dirname, 'src')
          },
          {
            find: '~',
            replacement: resolve(__dirname, 'src')
          }
        ]
      }
    };
  } else {
    // command === 'build'
    return {
      root: './src',
      optimizeDeps,
      plugins,
      build: {
        minify: true,
        lib: {
          entry: resolve('./src/vuedraggable.js'),
          name: 'vuedraggable',
          formats: ['es', 'umd', 'cjs']
        },
        outDir: '../dist',
        rollupOptions: {
          // // make sure to externalize deps that shouldn't be bundled
          // // into your library
          external: ['vue', 'sortablejs'],
          output: {
            inlineDynamicImports: true,
            // Provide global variables to use in the UMD build
            // for externalized deps
            globals: {
              vue: 'Vue',
              sortablejs: 'Sortable'
            }
          }
        }
      },
      server,
      resolve: {
        alias: [
          {
            find: '@',
            replacement: resolve(__dirname, 'src')
          },
          {
            find: '~',
            replacement: resolve(__dirname, 'src')
          }
        ]
      }
    };
  }
});

// export default defineConfig({
//   root: './example',
//   optimizeDeps,
//   plugins,
//   build: {
//     minify: true,
//     lib: {
//       entry: resolve('./src/vuedraggable.js'),
//       name: 'vuedraggable',
//       formats: ['es', 'umd', 'cjs']
//     },
//     outDir: '../dist',
//     rollupOptions: {
//       // // make sure to externalize deps that shouldn't be bundled
//       // // into your library
//       external: ['vue', 'sortablejs'],
//       output: {
//         inlineDynamicImports: true,
//         // Provide global variables to use in the UMD build
//         // for externalized deps
//         globals: {
//           vue: 'Vue',
//           sortablejs: 'Sortable'
//         }
//       }
//     }
//   },
//   server,
//   resolve: {
//     alias: [
//       {
//         find: '@',
//         replacement: resolve(__dirname, 'src')
//       },
//       {
//         find: '~',
//         replacement: resolve(__dirname, 'src')
//       }
//     ]
//   }
// });
