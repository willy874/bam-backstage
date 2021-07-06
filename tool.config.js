// const path = require('path')
// const { FileName } = require('bam-utility-plugins')

require('bam-auto-tool')({
  index: {
    input: [{
        path: 'src/models/data',
        suffix: 'Model',
      },
      {
        path: 'src/models/schema',
        type: 'cjs',
      },
      // {
      //   path: 'utility',
      //   fileNameHandler: (f) => {
      //     return new FileName(f).ConverLittleHump()
      //   },
      // },
    ],
    output: {
      type: 'esm',
    },
  },
  svg: {
    input: {
      path: 'src/components/icon/assets',
    },
    output: {
      path: 'src/components/icon/pattern',
    },
  },
  model: {
    input: {
      path: 'src/models/schema',
    },
    output: {
      path: 'src/models/data',
      overwrite: {
        exclude: /\\(article)\./,
        // allow: /\\image\./
      },
    },
    // overwrite: true,
  },
  ckeditor: {
    input: 'src/plugins/ckeditor/editor-create.js',
    output: 'src/plugins/ckeditor/build',
    filename: 'ckeditor.js',
  },
})