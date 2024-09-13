/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      md2:"800px",
      md3:'900px',
      lg: '976px',
      lg2:"1200px",
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], 
      },
      animation:{
        "loop-scroll":"loop-scroll 50s linear infinite"
      },
      keyframes:{
        "loop-scroll":{
          from :{transform:"translateX(0)"},
          to:{transform:"translateX(-100%)"},
        },
      },
    },
  },
  plugins: [
  ],
  
}


