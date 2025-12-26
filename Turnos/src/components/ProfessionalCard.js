import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, MapPin } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function ProfessionalCard({ professional, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: professional.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{professional.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
            <Text style={styles.rating}>{professional.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.specialty}>{professional.specialty}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={COLORS.light.textSecondary} />
          <Text style={styles.location} numberOfLines={1}>{professional.location}</Text>
        </View>

        <View style={styles.footer}>
            <Text style={styles.price}>${professional.price}</Text>
            <Text style={styles.availability}>Disp: {professional.availability[0]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.light,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.m,
    marginRight: SPACING.m,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.light.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.light.text,
  },
  specialty: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.s,
  },
  location: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
    flex: 1,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
  },
  price: {
      fontSize: 14,
      fontWeight: '700',
      color: COLORS.light.text,
  },
  availability: {
      fontSize: 12,
      color: COLORS.success,
      fontWeight: '600',
  }
});
