export const COLORS = {
  primary: '#007AFF', // Apple Blue
  secondary: '#5856D6', // Apple Indigo
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // Light Mode
  light: {
    background: '#F2F2F7', // System Grouped Background
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    tint: '#007AFF',
  },
  
  // Dark Mode (future proofing)
  dark: {
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    tint: '#0A84FF',
  }
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  }
};
