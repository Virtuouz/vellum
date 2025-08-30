/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ["./src/**/*.{html,js,md}", "./_component-library/**/*.liquid"],
  theme: {
    extend: {
      colors: {
        body: 'var(--background-body)',
        surface: 'var(--background-surface)',
        'interactive-hover': 'var(--background-interactive-hover)',
        
        // Defines `text-primary` and `text-muted`
        textColor: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },

        // Defines `border-primary`
        borderColor: {
          primary: 'var(--border-primary)',
        },

        // Defines `bg-accent`, `text-accent`, `border-accent`, and `hover:text-accent-hover`
        accent: {
          DEFAULT: 'var(--accent-primary)',
          hover: 'var(--accent-hover)',
          secondary: 'var(--accent-secondary)',
          'secondary-hover': 'var(--accent-secondary-hover)',
        },

        // Defines classes for code blocks
        code: {
          'inline-bg': 'var(--code-inline-background)',
          'inline-text': 'var(--code-inline-text)',
          'block-bg': 'var(--code-block-background)',
        }
      }
    },
  },
  // safelist: [
  //       {
  //         pattern: /.+/,
  //       },
  //     ],
  plugins: ["prettier-plugin-tailwindcss"],
};
