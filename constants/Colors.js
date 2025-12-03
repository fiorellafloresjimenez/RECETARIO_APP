const tintColorLight = '#123D5C'; // Sea Blue
const tintColorDark = '#E4C9A2'; // Honey

export default {
  light: {
    text: '#2C190A', // Coffee
    textLight: '#7A6957',
    background: '#F5F7FA', // Light BG
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    cardBackground: '#F3E1C4', // Paper
    borderColor: '#D2BFA5',
    headerBackground: '#E4C9A2', // Honey
    headerText: '#2C190A',
    sectionTitle: '#123D5C',
    inputBackground: '#F3E1C4', // Same as card/paper
    placeholderText: '#7A6957',
    buttonPrimary: '#8BA75A', // Accent
    buttonText: '#FFFFFF',
    danger: '#C0392B',
  },
  dark: {
    text: '#E0E0E0', // Off-white
    textLight: '#A0A0A0',
    background: '#121212', // Softer Black
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    cardBackground: '#1E1E1E', // Dark Card
    borderColor: '#333333',
    headerBackground: '#1E1E1E', // Match card/surface
    headerText: '#E4C9A2', // Honey
    sectionTitle: '#E4C9A2', // Honey
    inputBackground: '#2C2C2C',
    placeholderText: '#666666',
    buttonPrimary: '#8BA75A', // Keep accent
    buttonText: '#FFFFFF',
    danger: '#CF6679', // Softer red for dark mode
  },
};
