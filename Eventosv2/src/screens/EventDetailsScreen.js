import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function EventDetailsScreen({ route, navigation }) {
  const { event } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <BlurView intensity={50} tint="dark" style={styles.blurBtn}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </BlurView>
            </TouchableOpacity>

            <View style={styles.rightButtons}>
              <TouchableOpacity style={[styles.backButton, { marginRight: 10 }]}>
                <BlurView intensity={50} tint="dark" style={styles.blurBtn}>
                  <Ionicons name="share-outline" size={24} color="#FFF" />
                </BlurView>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton}>
                <BlurView intensity={50} tint="dark" style={styles.blurBtn}>
                  <Ionicons name="heart-outline" size={24} color="#FFF" />
                </BlurView>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{event.date}</Text>
                <Text style={styles.infoSubLabel}>Add to calendar</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{event.location}</Text>
                <Text style={styles.infoSubLabel}>View on map</Text>
              </View>
            </View>
          </View>

          {/* Organizer */}
          <View style={styles.organizerContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }} 
              style={styles.organizerImage} 
            />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerName}>{event.organizer}</Text>
              <Text style={styles.organizerLabel}>Organizer</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.description}>{event.description}</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>

          {/* Location Map Placeholder */}
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapPlaceholder}>
             <Image 
               source={{ uri: 'https://miro.medium.com/v2/resize:fit:1200/1*qYUvh-EtES8dtgKiZWiLSQ.png' }} 
               style={{ width: '100%', height: '100%', opacity: 0.8 }}
             />
             <View style={styles.mapOverlay}>
               <Text style={styles.mapText}>Map View</Text>
             </View>
          </View>

          <View style={{ height: 100 }} /> 
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>{event.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Buy Ticket</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  imageContainer: {
    height: 350,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.light.background,
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: SIZES.padding,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.light.text,
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 25,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: COLORS.light.surface, // or a light tint of primary
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  infoSubLabel: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.light.surface,
    borderRadius: SIZES.radius,
    marginBottom: 25,
  },
  organizerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.light.text,
  },
  organizerLabel: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
  },
  followBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
  },
  followText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.light.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: COLORS.light.textSecondary,
    lineHeight: 24,
    marginBottom: 15,
  },
  mapPlaceholder: {
    height: 150,
    width: '100%',
    backgroundColor: '#EEE',
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.light.background,
    paddingVertical: 15,
    paddingHorizontal: SIZES.padding,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  bookBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});
