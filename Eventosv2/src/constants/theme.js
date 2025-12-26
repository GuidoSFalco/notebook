export const COLORS = {
  primary: '#FF4757', // Coral Red (Airbnb/Eventbrite vibe)
  secondary: '#2ED573', // Success Green
  warning: '#FFA502',
  danger: '#FF4757',
  
  // Light Theme
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA', // Slightly gray for cards
    card: '#FFFFFF',
    text: '#2F3542',
    textSecondary: '#747D8C',
    border: '#F1F2F6',
    inputBg: '#F1F2F6',
  },
  
  // Dark Theme
  dark: {
    background: '#000000',
    surface: '#1C1C1E', // Apple dark gray
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#A4B0BE',
    border: '#2C2C2E',
    inputBg: '#2C2C2E',
  }
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  huge: 32,
  
  radius: 12,
  padding: 24,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.light.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.light.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
