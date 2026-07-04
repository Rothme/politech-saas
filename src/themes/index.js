// Theme registry — each candidate references a themeId, and the renderer
// applies these tokens as CSS variables at runtime. Adding a new theme never
// requires touching the renderer itself, only adding an entry here.

export const THEMES = {
  'tinubu-classic': {
    name: 'Tinubu Classic',
    colors: {
      primary: '#008751',
      dark: '#0a1a0a',
      gold: '#c8a84b',
      light: '#f3f6f0',
      accent: '#005c38',
      white: '#ffffff',
      text: '#1a2e1a',
      muted: '#5a6e5a',
      border: '#dde8dd',
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'DM Sans', sans-serif",
    },
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap',
    heroStyle: 'image-overlay-curve',
    shareEnabled: true,
  },
};

export function getTheme(themeId) {
  return THEMES[themeId] || THEMES['tinubu-classic'];
}

// Applies a theme's tokens as CSS custom properties on the document root.
// Called once when a candidate page mounts.
export function applyTheme(themeId) {
  const theme = getTheme(themeId);
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--pt-${key}`, value);
  });
  root.style.setProperty('--pt-font-heading', theme.fonts.heading);
  root.style.setProperty('--pt-font-body', theme.fonts.body);

  if (theme.googleFontsUrl && !document.getElementById('pt-theme-font')) {
    const link = document.createElement('link');
    link.id = 'pt-theme-font';
    link.rel = 'stylesheet';
    link.href = theme.googleFontsUrl;
    document.head.appendChild(link);
  }

  return theme;
}

