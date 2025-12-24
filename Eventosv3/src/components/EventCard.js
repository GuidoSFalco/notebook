import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../constants/colors';
import { spacing, typography, shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const EventCard = ({ event, onPress }) => {
  const { colors: themeColors, dark } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor: themeColors.card, borderColor: themeColors.border },
        !dark && shadows.light // Only apply shadow in light mode usually, or subtle in dark
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{event.price}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.date, { color: themeColors.primary }]}>{event.date}</Text>
        <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={2}>{event.title}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={themeColors.textSecondary || '#717171'} />
          <Text style={[styles.location, { color: themeColors.textSecondary || '#717171' }]}>{event.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: spacing.l,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'ios' ? 0 : 1, // Subtle border for android if shadow fails
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    top: spacing.m,
    left: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: spacing.m,
  },
  date: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.s,
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default EventCard;
