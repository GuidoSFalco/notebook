import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import * as LucideIcons from 'lucide-react-native';

export default function CategoryChip({ category, isSelected, onPress }) {
  const Icon = LucideIcons[category.icon] || LucideIcons.Activity; // Fallback icon

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isSelected && styles.selectedContainer
      ]} 
      onPress={onPress}
    >
      {/* <Icon size={16} color={isSelected ? '#FFF' : COLORS.primary} /> */}
      <Text style={[styles.text, isSelected && styles.selectedText]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.l,
    marginRight: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  selectedContainer: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.light.text,
    marginLeft: 4,
  },
  selectedText: {
    color: '#FFFFFF',
  },
});
