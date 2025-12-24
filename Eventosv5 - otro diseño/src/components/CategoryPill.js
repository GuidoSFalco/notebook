
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';

const CategoryPill = ({ name, icon: Icon, isSelected, onPress }) => {
  if (isSelected) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={COLORS.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerSelected}
        >
          {Icon && <Icon size={20} color={COLORS.surface} style={styles.icon} />}
          <Text style={styles.textSelected}>{name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.6}>
      {Icon && <Icon size={20} color={COLORS.textSecondary} style={styles.icon} />}
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    backgroundColor: COLORS.surface,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.s,
  },
  containerSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s + 1, // Compensate for border
    borderRadius: 30,
    marginRight: SIZES.s,
  },
  text: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  textSelected: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontWeight: '700',
  },
  icon: {
    marginRight: SIZES.xs,
  },
});

export default CategoryPill;
