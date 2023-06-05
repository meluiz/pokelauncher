/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        red: {
          1: '#5F0726',
          2: '#75082E',
          3: '#8D0E2F',
          4: '#AF1631',
          5: '#D12030',
          6: '#F42D2D',
          7: '#F86D60',
          8: '#FB9580',
          9: '#FDC0AB',
          10: '#FEE3D4'
        },
        orange: {
          1: '#610509',
          2: '#7A060B',
          3: '#930E0A',
          4: '#B72111',
          5: '#DB3918',
          6: '#FF5722',
          7: '#FF8C59',
          8: '#FFAD7A',
          9: '#FFCEA6',
          10: '#FFEAD2'
        },
        raspberry: {
          1: '#5F0743',
          2: '#770955',
          3: '#900F5C',
          4: '#B31865',
          5: '#D6236A',
          6: '#F9316D',
          7: '#FB6382',
          8: '#FD838F',
          9: '#FEACAD',
          10: '#FED9D5'
        },
        accents: {
          1: '#050505',
          2: '#0A0A0B',
          3: '#0F0F10',
          4: '#141415',
          5: '#18181A',
          6: '#45454A',
          7: '#71717A',
          8: '#A0A0A7',
          9: '#CFCFD3',
          10: '#E7E7E9'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('windy-radix-palette'),
    require('./lib/tailwindcss/plugins/alignment')
  ]
}
