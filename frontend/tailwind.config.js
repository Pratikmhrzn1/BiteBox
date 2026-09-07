/** @type {import('tailwindcss').Config} */

/*
 * BiteBox design tokens.
 *
 * Every value here is a decision, not a default. Two rules govern additions:
 *   1. If a value appears in more than one component, it belongs in this file.
 *   2. Any colour pair that carries text must clear WCAG AA (4.5:1). The
 *      contrast notes below are measured, not estimated.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* --- Brand -------------------------------------------------- */
        cream: '#FAD388',
        amber: '#FFC93C',
        brown: '#7D4A37',
        'burnt-orange': '#D25F26',

        /* Darkened from #E8452C. The old red failed AA both as a price
         * colour on cream (3.69:1) and under white button labels (3.95:1).
         * This value clears both: 4.54:1 on card-bg, 4.86:1 under white. */
        'accent-red': '#CE3D27',
        'accent-red-hover': '#A93120',

        /* Darkened from #8C9A09 so white "Veg" badge text reaches 4.53:1. */
        olive: '#717D07',
        /* For dark surfaces that carry cream text (opening-hours cards):
         * cream reaches 4.51:1 here, against 2.19:1 on the old olive. */
        'olive-deep': '#5B6406',

        /* --- Surfaces ----------------------------------------------- */
        /* Desaturated from the old #F2A94E orange. The saturated ground
         * competed with amber, red and olive at the same intensity, so
         * nothing receded. This sand lets the ink borders carry structure.
         * ink-dark reads 10.44:1 on it; card-bg separates by 1.53:1. */
        canvas: '#DCC8A6',
        'canvas-deep': '#D2BB94',
        'card-bg': '#FFF6E9',
        /* Navbar/menubar surface. Replaces bg-cream, on which the red
         * active link measured 3.41:1; here it reaches 4.54:1. */
        'nav-bg': '#FFF6E9',
        'espresso-dark': '#303411',
        'header-brown': '#4A2A18',

        /* --- Ink ---------------------------------------------------- */
        'ink-dark': '#241A12',
        'ink-muted': '#7A6A5C',

        /* --- Admin (dark theme, same token discipline) --------------- */
        'admin-bg': '#1F100A',
        'admin-surface': '#3D1F0E',
        'admin-field': '#2A150A',
        'admin-ink': '#C9A583',
        /* Replaces #8a6a4f (3.04:1) and #a07c5c (3.95:1). Reads 4.95:1. */
        'admin-muted': '#B08E6B',
      },

      /* Four tiers, one rule: chip < control < card < panel. Nesting uses
       * the .radius-inner-* helpers in index.css so inner radii stay
       * concentric with the 2px ink border. */
      borderRadius: {
        chip: '0.5rem',
        control: '0.75rem',
        card: '1rem',
        panel: '1.5rem',
      },

      /* The comic offset shadow, as a scale rather than 39 inline hex
       * literals. Depth reads through offset distance only. */
      boxShadow: {
        'comic-xs': '2px 2px 0 var(--shadow-ink)',
        'comic-sm': '3px 3px 0 var(--shadow-ink)',
        comic: '4px 4px 0 var(--shadow-ink)',
        'comic-md': '6px 6px 0 var(--shadow-ink)',
        'comic-lg': '8px 8px 0 var(--shadow-ink)',
        'comic-drawer': '-6px 0 0 var(--shadow-ink)',
        /* Depth under images, per the outline rule: pure black at low
         * opacity, never a tinted neutral. */
        image: '0 0 0 1px rgb(0 0 0 / 0.10)',
      },

      /* Consumed as top-header / h-header / scroll-mt-header so the sticky
       * navbar and the sticky menu filter bar can never drift apart. */
      spacing: {
        header: 'var(--header-h)',
        'header-gap': 'calc(var(--header-h) + 1rem)',
      },

      /* Two faces, with distinct jobs. Titan One was removed: it set only
       * the hero H1 while Luckiest Guy set all 41 other headings, so the
       * identity split at the single most important moment on the site.
       * Both are heavy novelty display faces, so carrying both bought
       * nothing but a second font request.
       *
       * Luckiest Guy and Caveat are the only faces allowed to be large.
       * Note that Luckiest Guy ships a single weight - never pair it with
       * font-bold, which synthesises a smeared faux bold. Caveat is loaded
       * at 600/700, so a weight on it is real. */
      fontFamily: {
        display: ['"Luckiest Guy"', 'Impact', 'Haettenschweiler', 'sans-serif'],
        script: ['Caveat', '"Segoe Script"', 'cursive'],
        sans: ['Fredoka', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },

      /* The display steps are fluid, so headings stop jumping between
       * breakpoints. body-* fills the gap the audit found between text-sm
       * and text-4xl, where almost nothing lived. */
      fontSize: {
        'display-2xl': ['clamp(3.5rem, 11vw, 6rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2.75rem, 8vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 5.5vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.375rem, 2.5vw, 1.75rem)', { lineHeight: '1.1' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.6' }],
        body: ['0.9375rem', { lineHeight: '1.6' }],
      },

      /* Motion scale. Micro-feedback stays at or under 150ms; component
       * transitions sit at 200-300ms; only the drawer earns 'slower'. */
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '450ms',
      },
      transitionTimingFunction: {
        ui: 'cubic-bezier(0.2, 0, 0, 1)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
  },
  plugins: [],
}
