import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ScrollView, Platform, Image } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { EVENTS } from '../assets/data';
import { Search, Filter, Calendar, MapPin, User, ArrowRight, X } from 'lucide-react-native';

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
  
  // Initial region (Buenos Aires mostly based on mock data, but let's center on the first event or a default)
  const initialRegion = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedTime, selectedType]);

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

        // Reset hours for date comparison
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

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]}
      >
        {filteredEvents.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            title={event.title}
            description={event.location}
          >
             <View style={[
               styles.markerContainer, 
               event.visibility === 'private' ? styles.privateMarker : styles.publicMarker
             ]}>
               {event.visibility === 'private' ? <User size={16} color="#FFF" /> : <MapPin size={16} color="#FFF" />}
             </View>

            <Callout tooltip onPress={() => navigation.navigate('EventDetail', { event })}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{event.title}</Text>
                <Text style={styles.calloutDate}>{event.date}</Text>
                <View style={styles.calloutFooter}>
                  <Text style={styles.calloutPrice}>{event.price}</Text>
                  <ArrowRight size={14} color={COLORS.primary} />
                </View>
              </View>
            </Callout>
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
  calloutContainer: {
    width: 200,
    backgroundColor: COLORS.surface,
    padding: SIZES.s,
    borderRadius: SIZES.radius,
    ...SHADOWS.medium,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  calloutDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calloutPrice: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
