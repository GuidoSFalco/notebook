import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { EVENTS, CATEGORIES } from '../assets/data';
import EventCard from '../components/EventCard';
import CategoryPill from '../components/CategoryPill';
import { Search, SlidersHorizontal, LayoutGrid, List, MapPin, X, ArrowLeft } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'list'
  const [showZoneInput, setShowZoneInput] = useState(false);
  const [zoneQuery, setZoneQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState(null); // { title, events }

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hola, Guido 👋</Text>
        <Text style={styles.subtitle}>Descubre eventos increíbles</Text>
      </View>
      <TouchableOpacity style={styles.profileBtn}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchWrapper}>
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar eventos, conciertos..."
            style={styles.searchInput}
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => setShowZoneInput(!showZoneInput)} style={styles.zoneIconBtn}>
             <MapPin size={20} color={showZoneInput ? COLORS.primary : COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.filterBtn}>
          <SlidersHorizontal size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      {showZoneInput && (
        <View style={styles.zoneContainer}>
            <MapPin size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
            <TextInput 
                placeholder="Filtrar por ciudad o zona..."
                style={styles.zoneInput}
                value={zoneQuery}
                onChangeText={setZoneQuery}
                placeholderTextColor={COLORS.textSecondary}
            />
            {zoneQuery.length > 0 && (
                <TouchableOpacity onPress={() => setZoneQuery('')}>
                    <X size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
            )}
        </View>
      )}
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
        <CategoryPill
          name="Todo"
          isSelected={selectedCategory === null}
          onPress={() => setSelectedCategory(null)}
        />
        {CATEGORIES.map((cat) => {
          const IconComponent = Icons[cat.icon.charAt(0).toUpperCase() + cat.icon.slice(1)] || Icons.Circle; 
          return (
            <CategoryPill
              key={cat.id}
              name={cat.name}
              isSelected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );

  const renderViewToggle = () => (
    <View style={styles.viewToggleContainer}>
        <Text style={styles.sectionTitle}>Explorar</Text>
        <View style={styles.toggleButtons}>
            <TouchableOpacity onPress={() => setViewMode('grouped')} style={styles.toggleBtn}>
                <LayoutGrid size={24} color={viewMode === 'grouped' ? COLORS.primary : COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewMode('list')} style={styles.toggleBtn}>
                <List size={24} color={viewMode === 'list' ? COLORS.primary : COLORS.textSecondary} />
            </TouchableOpacity>
        </View>
    </View>
  );

  const getFilteredEvents = () => {
      let filtered = EVENTS;
      if (selectedCategory) {
          filtered = filtered.filter(e => e.category === CATEGORIES.find(c => c.id === selectedCategory)?.name);
      }
      if (searchQuery) {
          filtered = filtered.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      if (zoneQuery) {
          filtered = filtered.filter(e => 
              (e.location && e.location.toLowerCase().includes(zoneQuery.toLowerCase())) || 
              (e.locationAddress && e.locationAddress.toLowerCase().includes(zoneQuery.toLowerCase()))
          );
      }
      return filtered;
  };

  const handleSeeAll = (title, events) => {
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => {
      // Prefer rawDate if available, otherwise string comparison (less accurate but fallback)
      if (a.rawDate && b.rawDate) {
        return new Date(a.rawDate) - new Date(b.rawDate);
      }
      return 0;
    });
    setExpandedSection({ title, events: sortedEvents });
  };

  const renderExpandedView = () => {
    if (!expandedSection) return null;

    return (
      <View>
        <View style={styles.sectionHeader}>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setExpandedSection(null)}
          >
            <ArrowLeft size={24} color={COLORS.text} style={{ marginRight: 10 }} />
            <Text style={styles.sectionTitle}>{expandedSection.title}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: SIZES.l }}>
          {expandedSection.events.map((item) => (
            <EventCard
              key={item.id}
              event={item}
              layout="horizontal"
              onPress={() => navigation.navigate('EventDetail', { event: item })}
              style={{ marginBottom: SIZES.m }}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderSection = (title, events) => {
    if (events.length === 0) return null;
    return (
      <View style={styles.section} key={title}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={() => handleSeeAll(title, events)}>
            <Text style={styles.seeAll}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={events}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              layout="vertical"
              style={{ width: 250, marginRight: 16, marginBottom: 4 }}
              onPress={() => navigation.navigate('EventDetail', { event: item })}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SIZES.l }}
        />
      </View>
    );
  };

  const renderGroupedView = () => {
      const allEvents = getFilteredEvents();
      // Logic to group events
      const todayEvents = allEvents.filter(e => e.date && e.date.toLowerCase().includes('hoy'));
      const weekEvents = allEvents.filter(e => e.date && (e.date.toLowerCase().includes('mañana') || e.date.toLowerCase().includes('semana')));
      const musicEvents = allEvents.filter(e => e.category === 'Música');
      const techEvents = allEvents.filter(e => e.category === 'Tecnología');
      const otherEvents = allEvents.filter(e => !todayEvents.includes(e) && !weekEvents.includes(e) && !musicEvents.includes(e) && !techEvents.includes(e));

      // If filters are active, and groupings are empty, show raw list or "Others"
      const hasGroups = todayEvents.length > 0 || weekEvents.length > 0 || musicEvents.length > 0 || techEvents.length > 0;
      
      if (!hasGroups && otherEvents.length > 0) {
           return renderSection("Resultados", otherEvents);
      }

      return (
          <View>
              {renderSection("Para hoy", todayEvents)}
              {renderSection("Esta semana", weekEvents)}
              {renderSection("Música", musicEvents)}
              {renderSection("Tecnología", techEvents)}
              {renderSection("Más eventos", otherEvents)}
          </View>
      );
  };

  const renderListView = () => {
      const events = getFilteredEvents();
      return (
        <View style={{ paddingHorizontal: SIZES.l }}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              layout="horizontal"
              onPress={() => navigation.navigate('EventDetail', { event })}
            />
          ))}
        </View>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderHeader()}
        {renderSearchBar()}
        {renderCategories()}
        
        {expandedSection ? (
          renderExpandedView()
        ) : (
          <>
            {renderViewToggle()}
            {viewMode === 'grouped' ? renderGroupedView() : renderListView()}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  expandedContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.l,
    paddingVertical: SIZES.m,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: SIZES.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.l,
    marginTop: SIZES.m,
    marginBottom: SIZES.l,
  },
  greeting: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchWrapper: {
      paddingHorizontal: SIZES.l,
      marginBottom: SIZES.l,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingLeft: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 50,
  },
  searchIcon: {
      marginRight: SIZES.s,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: COLORS.text,
  },
  zoneIconBtn: {
      padding: 10,
  },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  zoneContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SIZES.s,
      backgroundColor: COLORS.surface,
      padding: SIZES.s,
      borderRadius: SIZES.radius,
      borderWidth: 1,
      borderColor: COLORS.border,
  },
  zoneInput: {
      flex: 1,
      color: COLORS.text,
  },
  categoriesContainer: {
    marginBottom: SIZES.l,
  },
  categoriesList: {
    paddingHorizontal: SIZES.l,
  },
  viewToggleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SIZES.l,
      marginBottom: SIZES.m,
  },
  toggleButtons: {
      flexDirection: 'row',
  },
  toggleBtn: {
      marginLeft: SIZES.m,
  },
  section: {
    marginBottom: SIZES.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.l,
    marginBottom: SIZES.m,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
