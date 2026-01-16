
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { MapPin, Calendar, ArrowLeft, Share2, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOOGLE_MAPS_API_KEY } from '../config/mapsConfig';
import EventMap from '../components/EventMap';

const { width } = Dimensions.get('window');

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;
  const insets = useSafeAreaInsets();

  const isVirtual = event.type === 'virtual' || event.isVirtual;
  const hasCoordinates = typeof event.latitude === 'number' && typeof event.longitude === 'number';
  const mapRegion = hasCoordinates
    ? {
        latitude: event.latitude,
        longitude: event.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          {/* Header Actions */}
          <View style={[styles.headerActions, { top: insets.top + 10 }]}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color={COLORS.surface} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[styles.iconButton, { marginRight: 10 }]}>
                <Share2 size={24} color={COLORS.surface} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Heart size={24} color={COLORS.surface} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Title on Image */}
          <View style={styles.titleContainer}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.row}>
              <Calendar size={16} color={COLORS.surface} />
              <Text style={styles.dateText}>{event.date}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Organizer */}
          <View style={styles.organizerRow}>
            <Image source={{ uri: event.organizer.avatar }} style={styles.organizerAvatar} />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerLabel}>Organizado por</Text>
              <Text style={styles.organizerName}>{event.organizer.name}</Text>
            </View>
            <View style={styles.organizerActions}>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followText}>Seguir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditEvent', {
                    mode: 'edit',
                    event,
                    onSubmit: (updatedEvent) => {
                      navigation.setParams({ event: updatedEvent });
                    },
                  })
                }
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Acerca del evento</Text>
          <Text style={styles.description}>{event.description}</Text>

          {isVirtual ? (
            <>
              <Text style={styles.sectionTitle}>Evento virtual</Text>
              {event.virtualLink ? (
                <Text style={styles.virtualLink}>{event.virtualLink}</Text>
              ) : (
                <Text style={styles.virtualHelperText}>
                  Este evento se realiza de forma virtual.
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Ubicación</Text>
              <View style={styles.locationCard}>
                <View style={styles.locationIconContainer}>
                  <MapPin size={24} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName}>{event.locationAddress || event.location}</Text>
                  {event.locationAddress && event.locationAddress !== event.location ? (
                    <Text style={styles.locationAddress}>{event.locationAddress}</Text>
                  ) : null}
                </View>
              </View>
              {hasCoordinates && mapRegion && (
                <View style={styles.mapContainer}>
                  <EventMap
                    style={styles.map}
                    initialRegion={mapRegion}
                    region={mapRegion}
                    markerCoordinate={mapRegion}
                    interactive={false}
                    googleMapsApiKey={GOOGLE_MAPS_API_KEY || undefined}
                  />
                </View>
              )}
            </>
          )}

          {/* Attendees */}
          <View style={styles.attendeesSection}>
            <Text style={styles.sectionTitle}>Asistentes ({event.attendees})</Text>
            <View style={styles.avatarRow}>
              {[1,2,3,4,5].map((_, i) => (
                <View key={i} style={[styles.attendeeAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: 5-i }]} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
        <View>
          <Text style={styles.priceLabel}>Precio total</Text>
          <Text style={styles.priceValue}>{event.price}</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyText}>Comprar Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 400,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)', // Works on iOS mostly
  },
  titleContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  categoryTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    color: COLORS.surface,
    ...FONTS.captionWhite,
    fontWeight: '700',
  },
  title: {
    ...FONTS.h2,
    color: COLORS.surface,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: COLORS.surface,
    ...FONTS.body,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: SIZES.l,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  organizerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerLabel: {
    ...FONTS.caption,
  },
  organizerName: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followText: {
    color: COLORS.primary,
    ...FONTS.caption,
    fontWeight: '600',
  },
  editButton: {
    marginLeft: SIZES.s,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  editButtonText: {
    ...FONTS.caption,
    color: COLORS.text,
    fontWeight: '600',
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.m,
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xl,
  },
  virtualLink: {
    ...FONTS.body,
    color: COLORS.primary,
    marginBottom: SIZES.xl,
  },
  virtualHelperText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xl,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  locationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationName: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  locationAddress: {
    ...FONTS.caption,
  },
  mapContainer: {
    height: 200,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: SIZES.xl,
  },
  map: {
    flex: 1,
  },
  attendeesSection: {
    marginBottom: SIZES.xl,
  },
  avatarRow: {
    flexDirection: 'row',
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SIZES.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.large,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  priceLabel: {
    ...FONTS.caption,
  },
  priceValue: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    ...SHADOWS.medium,
  },
  buyText: {
    color: COLORS.surface,
    ...FONTS.h3,
    fontSize: 16,
  },
});
