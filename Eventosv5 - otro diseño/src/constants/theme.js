
export const COLORS = {
  primary: '#6C63FF', // Electric Blue/Purple
  secondary: '#FF6584', // Vibrant Pink
  tertiary: '#43D9AD', // Mint Green
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#757575',
  border: '#E0E0E0',
  success: '#38C172',
  error: '#E3342F',
  gradientPrimary: ['#6C63FF', '#4834D4'],
  gradientSecondary: ['#FF6584', '#FF8E53'],
};

export const SIZES = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  width: '100%',
  radius: 16,
  cardRadius: 20,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.46,
    elevation: 5,
  },
  large: {
    shadowColor: "#6C63FF",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
};

export const FONTS = {
  h1: { fontFamily: 'Poppins_800ExtraBold', fontSize: 32, letterSpacing: -1 },
  h2: { fontFamily: 'Poppins_700Bold', fontSize: 24, letterSpacing: -0.5 },
  h3: { fontFamily: 'Poppins_700Bold', fontSize: 20 },
  body: { fontFamily: 'Poppins_400Regular', fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: COLORS.textSecondary },
};
