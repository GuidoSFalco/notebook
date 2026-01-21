import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ScrollView, Platform, Image, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { EVENTS } from '../assets/data';
import { Search, Filter, MapPin, User, X, Navigation } from 'lucide-react-native';
import EventBottomSheet from '../components/EventBottomSheet';

const { width, height } = Dimensions.get('window');

const FILTER_TIMES = [
  { id: 'all', label: 'Todos' },
  { id: 'today', label: 'Hoy' },
  { id: 'tomorrow', label: 'Mañana' },
  { id: 'week', label: 'Esta semana' },
];

const FILTER_TYPES = [
  { id: 'all', label: 'Todos' },
  { id: 'public', label: 'Públicos' },
  { id: 'private', label: 'Privados' },
];

export default function MapScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTime, setSelectedTime] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  // Initial region (Buenos Aires)
  const initialRegion = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapRef = useRef(null);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedTime, selectedType]);

  // Simulate User Location (In a real app, use expo-location)
  useEffect(() => {
    // Mock location near the center for demonstration
    // If you have expo-location installed:
    // (async () => {
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== 'granted') return;
    //   let location = await Location.getCurrentPositionAsync({});
    //   setUserLocation(location.coords);
    // })();
    
    setTimeout(() => {
        setUserLocation({
            latitude: -34.6045,
            longitude: -58.3825,
        });
    }, 1000);
  }, []);

  const filterEvents = () => {
    let result = EVENTS.filter(event => {
      // Filter by location existence (only physical events)
      if (!event.latitude || !event.longitude) return false;

      // Filter by Search (Name or Organizer)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        event.title.toLowerCase().includes(query) || 
        event.organizer.name.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;

      // Filter by Type
      if (selectedType !== 'all') {
        if (selectedType === 'public' && event.visibility !== 'public') return false;
        if (selectedType === 'private' && event.visibility !== 'private') return false;
      }

      // Filter by Time
      if (selectedTime !== 'all' && event.rawDate) {
        const eventDate = new Date(event.rawDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const isSameDay = (d1, d2) => 
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();

        if (selectedTime === 'today' && !isSameDay(eventDate, today)) return false;
        if (selectedTime === 'tomorrow' && !isSameDay(eventDate, tomorrow)) return false;
        if (selectedTime === 'week' && (eventDate < today || eventDate > nextWeek)) return false;
      }

      return true;
    });

    setFilteredEvents(result);
  };

  const handleMarkerPress = (event) => {
    setSelectedEvent(event);
    // Optional: Center map on event
    mapRef.current?.animateToRegion({
        latitude: event.latitude,
        longitude: event.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    }, 500);
  };

  const handleMapPress = () => {
      if (selectedEvent) {
          setSelectedEvent(null);
      }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]}
      >
        {/* User Location Marker - Distinct Icon */}
        {userLocation && (
            <Marker
                coordinate={userLocation}
                title="Mi Ubicación"
                zIndex={999}
            >
                <View style={styles.userLocationContainer}>
                    <View style={styles.userLocationIcon}>
                         <Navigation size={16} color="#FFF" fill="#FFF" />
                    </View>
                    <View style={styles.userLocationPulse} />
                </View>
            </Marker>
        )}

        {/* Event Markers */}
        {filteredEvents.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            onPress={() => handleMarkerPress(event)}
          >
             <View style={[
               styles.markerContainer, 
               event.visibility === 'private' ? styles.privateMarker : styles.publicMarker,
               selectedEvent?.id === event.id && styles.selectedMarker
             ]}>
               {event.visibility === 'private' ? (
                   <User size={16} color="#FFF" />
               ) : (
                   <MapPin size={16} color="#FFF" />
               )}
             </View>
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar evento o creador..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, showFilters && styles.filterButtonActive]} 
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? COLORS.primary : COLORS.text} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filterLabel}>Tipo de Evento</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {FILTER_TYPES.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.filterChip,
                    selectedType === type.id && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedType === type.id && styles.filterChipTextActive
                  ]}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Fecha</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {FILTER_TIMES.map(time => (
                <TouchableOpacity
                  key={time.id}
                  style={[
                    styles.filterChip,
                    selectedTime === time.id && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedTime(time.id)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedTime === time.id && styles.filterChipTextActive
                  ]}>{time.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>

      {/* Bottom Sheet for Event Details */}
      <EventBottomSheet 
        event={selectedEvent} 
        visible={!!selectedEvent}
        onClose={() => setSelectedEvent(null)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: SIZES.m,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: SIZES.s,
    marginBottom: SIZES.s,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.m,
    height: 50,
    ...SHADOWS.medium,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.s,
    fontFamily: FONTS.body?.fontFamily,
    color: COLORS.text,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  filterButtonActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  filtersContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.m,
    ...SHADOWS.medium,
  },
  filterLabel: {
    ...FONTS.h4,
    marginBottom: SIZES.s,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  filterScroll: {
    marginBottom: SIZES.m,
    maxHeight: 40,
  },
  filterChip: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.xs,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: SIZES.s,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 36,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    ...SHADOWS.small,
  },
  publicMarker: {
    backgroundColor: COLORS.primary,
  },
  privateMarker: {
    backgroundColor: COLORS.secondary,
  },
  userLocationContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
  },
  userLocationIcon: {
      backgroundColor: '#2196F3',
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#FFF',
      zIndex: 2,
  },
  userLocationPulse: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(33, 150, 243, 0.3)',
      zIndex: 1,
  }
});
