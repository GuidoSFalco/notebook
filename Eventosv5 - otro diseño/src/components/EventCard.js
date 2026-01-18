
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { MapPin, Calendar, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const EventCard = ({ event, onPress, layout = 'vertical', style }) => {
  if (layout === 'horizontal') {
    return (
      <TouchableOpacity 
        style={[styles.cardHorizontal, style]} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: event.image }} style={styles.imageHorizontal} />
        <View style={styles.contentHorizontal}>
          <Text style={styles.date}>{event.date}</Text>
          <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={COLORS.textSecondary} />
            <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Vertical Large Card (Featured)
  return (
    <TouchableOpacity 
      style={[styles.cardVertical, style]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.image }} style={styles.imageVertical} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{event.price}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart size={20} color={COLORS.surface} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentVertical}>
        <Text style={styles.date}>{event.date}</Text>
        <Text style={styles.titleVertical}>{event.title}</Text>
        <View style={styles.row}>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={COLORS.textSecondary} />
            <Text
              style={styles.location}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {event.location}
            </Text>
          </View>
          {/* <View style={styles.attendeesContainer}>
            <View style={styles.avatarStack}>
               {[1,2,3].map((_, i) => (
                 <View key={i} style={[styles.miniAvatar, { left: i * -10, zIndex: 3-i }]} />
               ))}
            </View>
            <Text style={styles.attendeesText}>+{event.attendees}</Text>
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Vertical
  cardVertical: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.cardRadius,
    marginBottom: SIZES.l,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    width: '100%',
  },
  imageVertical: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  priceTag: {
    position: 'absolute',
    top: SIZES.m,
    left: SIZES.m,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius,
  },
  priceText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: SIZES.m,
    right: SIZES.m,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentVertical: {
    padding: SIZES.m,
  },
  titleVertical: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.s,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
    flexShrink: 0,
  },
  avatarStack: {
    flexDirection: 'row',
    width: 40,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  attendeesText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: -10,
    zIndex: 1000
  },

  // Horizontal (Small)
  cardHorizontal: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.m,
    padding: SIZES.s,
    ...SHADOWS.small,
  },
  imageHorizontal: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
  },
  contentHorizontal: {
    flex: 1,
    marginLeft: SIZES.m,
    justifyContent: 'center',
  },
  date: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    ...FONTS.body,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  locationContainer: {
    // backgroundColor: 'rgba(0,0,0,0.05)',
    // paddingHorizontal: 8,
    // paddingVertical: 4,
    // borderRadius: SIZES.radius,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    ...FONTS.caption,
    marginLeft: 4,
    flex: 1,
  },
});

export default EventCard;
