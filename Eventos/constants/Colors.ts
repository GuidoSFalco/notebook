/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/) uses Tailwind CSS.
 */

const tintColorLight = '#FF385C';
const tintColorDark = '#FF385C';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: '#E5E5E5',
    subtext: '#717171',
    surface: '#F7F7F7',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1E1E1E',
    border: '#2C2C2C',
    subtext: '#A1A1A1',
    surface: '#1E1E1E',
  },
};
