

const tintColorLight = '#FF5A5F'; // Airbnb-like Red
const tintColorDark = '#FF5A5F';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F9FAFB', // Slightly off-white for modern feel
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#E5E7EB',
    placeholder: '#9CA3AF',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    card: '#1E1E1E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#2C2C2C',
    placeholder: '#6B7280',
  },
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const BorderRadius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
};
