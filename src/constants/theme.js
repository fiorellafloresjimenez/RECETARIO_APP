export const COLORS = {
  primary: '#2C3E50',    // Deep Blue/Grey - Professional & Trustworthy
  secondary: '#E67E22',  // Muted Orange - Warmth/Action
  accent: '#3498DB',     // Bright Blue - Highlights
  success: '#27AE60',    // Green - Success
  danger: '#C0392B',     // Red - Errors/Delete
  warning: '#F39C12',    // Orange - Warnings
  
  // Neutrals
  bg: '#F5F7FA',         // Very Light Grey/Blue - Clean Background
  paper: '#FFFFFF',      // White - Cards/Surfaces
  text: '#2C3E50',       // Dark Grey - Primary Text
  textLight: '#7F8C8D',  // Medium Grey - Secondary Text
  border: '#BDC3C7',     // Light Grey - Borders
  
  // Aliases for backward compatibility (mapping to new palette)
  get lemonade() { return this.warning; },
  get seaBlue() { return this.primary; },
  get matcha() { return this.success; },
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
