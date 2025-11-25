// src/constants/theme.js

export const COLORS = {
  // Azul oscuro de fondo
  primary: '#123D5C',

  // Beige madera (barra superior, tarjetas, bottom bar)
  secondary: '#E4C9A2',

  // Verde de botones
  accent: '#8BA75A',

  success: '#27AE60',
  danger: '#C0392B',
  warning: '#F39C12',

  // Neutros
  bg: '#F5F7FA',
  paper: '#F3E1C4',
  text: '#2C190A',
  textLight: '#7A6957',
  border: '#D2BFA5',

  // Aliases (para no romper nada que ya use estos nombres)
  get lemonade() { return this.warning; },
  get seaBlue() { return this.primary; },
  get matcha() { return this.accent; },
  get honey() { return this.secondary; },
  get coffee() { return this.text; },
  get ink() { return this.text; },
  get muted() { return this.textLight; },
  get cream() { return this.paper; },
  get ok() { return this.success; },
};

export const SIZES = {
  radius: 14,
  radiusLg: 22,
  radiusXl: 32,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 40,
    elevation: 6,
  },
};
