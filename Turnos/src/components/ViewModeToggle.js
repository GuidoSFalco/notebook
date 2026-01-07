import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LayoutList, Calendar } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function ViewModeToggle({ mode, onChange }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, mode === 'agenda' && styles.activeButton]} 
        onPress={() => onChange('agenda')}
        activeOpacity={0.7}
      >
        <Calendar size={20} color={mode === 'agenda' ? COLORS.primary : COLORS.light.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, mode === 'list' && styles.activeButton]} 
        onPress={() => onChange('list')}
        activeOpacity={0.7}
      >
        <LayoutList size={20} color={mode === 'list' ? COLORS.primary : COLORS.light.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.m,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  button: {
    padding: SPACING.s,
    borderRadius: RADIUS.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: COLORS.light.background,
    ...SHADOWS.light,
  },
});
