import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, borderRadius, spacing } from '../theme/colors';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', // primary, secondary, outline
  size = 'large', // medium, large
  loading = false,
  disabled = false,
  style
}) => {
  
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    if (variant === 'primary') return colors.primary;
    if (variant === 'secondary') return colors.secondary;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    if (variant === 'outline') return colors.primary;
    return colors.white;
  };

  const getBorder = () => {
    if (variant === 'outline') return { borderWidth: 1, borderColor: colors.primary };
    return {};
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: getBackgroundColor() },
        getBorder(),
        size === 'medium' ? styles.medium : styles.large,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  }
});
