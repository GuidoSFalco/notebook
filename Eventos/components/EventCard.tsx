import React from 'react';
import { StyleSheet, Image, Pressable, Platform, Dimensions } from 'react-native';
import { Text, View, useThemeColor } from './Themed';
import { Event } from '@/constants/types';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const cardBg = useThemeColor({}, 'card');
  const subtextColor = useThemeColor({}, 'subtext');
  
  // Format date
  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <Link href={`/details/${event.id}`} asChild>
      <Pressable style={({ pressed }) => [
        styles.container, 
        { backgroundColor: cardBg, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}>
        <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
        
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.category}>{event.category.toUpperCase()}</Text>
            <Text style={[styles.price, { color: tintColor }]}>
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </Text>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={subtextColor} style={styles.icon} />
            <Text style={styles.infoText}>{dateStr}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={subtextColor} style={styles.icon} />
            <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
