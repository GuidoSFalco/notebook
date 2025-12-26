import React from 'react';
import { StyleSheet, Image, ScrollView, Platform, View } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Text, useThemeColor } from '@/components/Themed';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const event = MOCK_EVENTS.find(e => e.id === id);
  
  const tintColor = useThemeColor({}, 'tint');
  const subtextColor = useThemeColor({}, 'subtext');
  const bgColor = useThemeColor({}, 'background');

  if (!event) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Event not found!</Text>
      </View>
    );
  }

  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Stack.Screen options={{ 
        headerTitle: '',
        headerTransparent: true,
        headerTintColor: '#fff',
      }} />
      
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            <View style={styles.headerButtons}>
              <Ionicons 
                name="chevron-back" 
                size={28} 
                color="white" 
                onPress={() => router.back()} 
                style={styles.backIcon} // Just in case default header is hidden/custom
              />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={[styles.category, { color: tintColor }]}>{event.category.toUpperCase()}</Text>
            <Text style={styles.title}>{event.title}</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="calendar" size={20} color={subtextColor} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>{dateStr}</Text>
                  <Text style={styles.infoSub}>{timeStr}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location" size={20} color={subtextColor} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>{event.location}</Text>
                  <Text style={styles.infoSub}>{event.organizer}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{event.description}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Organizer</Text>
            <View style={styles.organizerRow}>
              <View style={styles.organizerAvatar}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
                  {event.organizer.charAt(0)}
                </Text>
              </View>
              <Text style={styles.organizerName}>{event.organizer}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: bgColor, borderTopColor: '#eee', borderTopWidth: 1 }]}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={[styles.priceValue, { color: tintColor }]}>
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </Text>
          </View>
          <Button 
            title="Get Tickets" 
            onPress={() => {}} 
            style={{ paddingHorizontal: 40 }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    opacity: 0, // Hiding manual back button since Stack.Screen handles it, but kept structure if needed
  },
  content: {
    padding: 24,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'white', // Should use themed background in real app if dark mode details support needed, but hardcoded for now to match Airbnb style sheet transition
  },
  category: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    lineHeight: 34,
    color: '#1A1A1A',
  },
  infoRow: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  infoSub: {
    fontSize: 14,
    color: '#717171',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: '#484848',
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF385C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  priceLabel: {
    fontSize: 12,
    color: '#717171',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
