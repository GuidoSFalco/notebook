import React from 'react';
import { StyleSheet, Pressable, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Text, useThemeColor } from './Themed';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false,
  style,
  textStyle,
  disabled = false
}: ButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  
  let bg = tintColor;
  let text = '#FFFFFF';
  let border = 'transparent';
  let borderWidth = 0;

  if (variant === 'secondary') {
    bg = '#F0F0F0'; // Should use theme
    text = '#000';
  } else if (variant === 'outline') {
    bg = 'transparent';
    text = tintColor;
    border = tintColor;
    borderWidth = 1;
  } else if (variant === 'ghost') {
    bg = 'transparent';
    text = tintColor;
  }

  // Override for disabled
  if (disabled) {
    bg = '#E0E0E0';
    text = '#A0A0A0';
    border = 'transparent';
  }

  return (
    <Pressable 
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor: bg, 
          borderColor: border, 
          borderWidth: borderWidth,
          opacity: pressed && !disabled ? 0.8 : 1 
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={text} />
      ) : (
        <Text style={[styles.text, { color: text }, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
