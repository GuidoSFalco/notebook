import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { BlurView } from 'expo-blur';

const EventCard = ({ event, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.priceTag}>
          <BlurView intensity={80} tint="dark" style={styles.priceBlur}>
            <Text style={styles.priceText}>{event.price}</Text>
          </BlurView>
        </View>
        <TouchableOpacity style={styles.favoriteBtn}>
          <Ionicons name="heart-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.date}>{event.date.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color={COLORS.light.textSecondary} />
          <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.light.card,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
    marginHorizontal: SIZES.padding,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.light.border,
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
    top: 15,
    left: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  priceBlur: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priceText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: SIZES.font,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  date: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: COLORS.light.textSecondary,
    fontSize: 14,
    marginLeft: 4,
  },
});

export default EventCard;
