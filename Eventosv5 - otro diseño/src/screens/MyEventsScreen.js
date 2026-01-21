import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { ChevronLeft, Edit, Trash2, Filter, Calendar, LayoutList, Layers, User, Users, Eye, EyeOff, Check, X, Search } from 'lucide-react-native';
import EventCard from '../components/EventCard';
import { EVENTS, CATEGORIES } from '../assets/data';

export default function MyEventsScreen({ navigation }) {
  // State for Search
  const [searchQuery, setSearchQuery] = useState('');

  // State for Filters
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    role: 'all', // 'all' | 'owner' | 'participant'
    categories: [], // array of category names
    date: null, // specific date string YYYY-MM-DD or null
    visibility: 'all' // 'all' | 'public' | 'private'
  });
  
  // State for View Mode
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'date' | 'category'

  // State for My Events (Mocking local state with augmented data)
  const [allEvents, setAllEvents] = useState(() => {
    return EVENTS.map((e, index) => ({
      ...e,
      // Mock logic: First 2 events are 'owner', others 'participant'
      role: index < 2 ? 'owner' : 'participant',
      // Ensure rawDate exists (it does in data.js)
    }));
  });

  // Extract unique dates for filter
  const availableDates = useMemo(() => {
    const dates = new Set(allEvents.map(e => e.rawDate.split('T')[0]));
    return Array.from(dates).sort();
  }, [allEvents]);

  // Derived state: Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesOrganizer = event.organizer?.name?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesOrganizer) return false;
      }

      // Role Filter
      if (filters.role === 'owner' && event.role !== 'owner') return false;
      if (filters.role === 'participant' && event.role !== 'participant') return false;
      
      // Category Filter
      if (filters.categories.length > 0 && !filters.categories.includes(event.category)) return false;

      // Date Filter
      if (filters.date && event.rawDate.split('T')[0] !== filters.date) return false;

      // Visibility Filter
      if (filters.visibility === 'public' && event.visibility !== 'public') return false;
      if (filters.visibility === 'private' && event.visibility !== 'private') return false;

      return true;
    });
  }, [allEvents, filters, searchQuery]);

  // Derived state: Grouped Events
  const groupedEvents = useMemo(() => {
    if (viewMode === 'date') {
      const groups = {};
      filteredEvents.forEach(e => {
        const dateKey = e.rawDate.split('T')[0];
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(e);
      });
      return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    } else if (viewMode === 'category') {
      const groups = {};
      filteredEvents.forEach(e => {
        const cat = e.category || 'Sin Categoría';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(e);
      });
      return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    }
    return filteredEvents;
  }, [filteredEvents, viewMode]);

  const handleDeleteEvent = (id) => {
    Alert.alert(
      'Eliminar evento',
      '¿Estás seguro de que quieres eliminar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setAllEvents((current) => current.filter((event) => event.id !== id));
          },
        },
      ]
    );
  };

  const toggleCategoryFilter = (categoryName) => {
    setFilters(prev => {
      const exists = prev.categories.includes(categoryName);
      if (exists) {
        return { ...prev, categories: prev.categories.filter(c => c !== categoryName) };
      } else {
        return { ...prev, categories: [...prev.categories, categoryName] };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      role: 'all',
      categories: [],
      date: null,
      visibility: 'all'
    });
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Eventos</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity 
            style={[styles.iconButton, viewMode !== 'list' && styles.activeIconButton]}
            onPress={() => {
              // Cycle view modes: list -> date -> category -> list
              const modes = ['list', 'date', 'category'];
              const nextIndex = (modes.indexOf(viewMode) + 1) % modes.length;
              setViewMode(modes[nextIndex]);
            }}
          >
            {viewMode === 'list' && <LayoutList size={20} color={COLORS.text} />}
            {viewMode === 'date' && <Calendar size={20} color={COLORS.primary} />}
            {viewMode === 'category' && <Layers size={20} color={COLORS.primary} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, (filters.role !== 'all' || filters.categories.length > 0 || filters.date || filters.visibility !== 'all') && styles.activeIconButton]} 
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color={(filters.role !== 'all' || filters.categories.length > 0 || filters.date || filters.visibility !== 'all') ? COLORS.primary : COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar evento o creador..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Role Filter */}
            <Text style={styles.filterSectionTitle}>Mostrar eventos</Text>
            <View style={styles.filterOptionsRow}>
              {['all', 'owner', 'participant'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[styles.filterChip, filters.role === role && styles.activeFilterChip]}
                  onPress={() => setFilters({ ...filters, role })}
                >
                  <Text style={[styles.filterChipText, filters.role === role && styles.activeFilterChipText]}>
                    {role === 'all' ? 'Todos' : role === 'owner' ? 'Creados por mí' : 'Participando'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Visibility Filter */}
            <Text style={styles.filterSectionTitle}>Visibilidad</Text>
            <View style={styles.filterOptionsRow}>
              {['all', 'public', 'private'].map((vis) => (
                <TouchableOpacity
                  key={vis}
                  style={[styles.filterChip, filters.visibility === vis && styles.activeFilterChip]}
                  onPress={() => setFilters({ ...filters, visibility: vis })}
                >
                  <Text style={[styles.filterChipText, filters.visibility === vis && styles.activeFilterChipText]}>
                    {vis === 'all' ? 'Todos' : vis === 'public' ? 'Públicos' : 'Privados'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date Filter */}
            <Text style={styles.filterSectionTitle}>Fecha</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              <TouchableOpacity
                style={[styles.filterChip, filters.date === null && styles.activeFilterChip]}
                onPress={() => setFilters({ ...filters, date: null })}
              >
                <Text style={[styles.filterChipText, filters.date === null && styles.activeFilterChipText]}>Cualquiera</Text>
              </TouchableOpacity>
              {availableDates.map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[styles.filterChip, filters.date === date && styles.activeFilterChip]}
                  onPress={() => setFilters({ ...filters, date: date === filters.date ? null : date })}
                >
                  <Text style={[styles.filterChipText, filters.date === date && styles.activeFilterChipText]}>{date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Category Filter */}
            <Text style={styles.filterSectionTitle}>Categorías</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = filters.categories.includes(cat.name);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, isSelected && styles.activeCategoryChip]}
                    onPress={() => toggleCategoryFilter(cat.name)}
                  >
                    <Text style={[styles.categoryChipText, isSelected && styles.activeCategoryChipText]}>{cat.name}</Text>
                    {isSelected && <Check size={14} color={COLORS.surface} style={{ marginLeft: 4 }} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <View style={{ flex: 1 }}>
        <EventCard 
          event={item} 
          layout={viewMode === 'date' ? 'horizontal' : 'vertical'}
          style={viewMode === 'date' ? { width: 280, marginRight: 16 } : {}}
          onPress={() => navigation.navigate('EventDetail', { event: item })}
        />
      </View>
      {viewMode !== 'date' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('EditEvent', { event: item, mode: 'edit' })}
          >
            <Edit size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteEvent(item.id)}
          >
            <Trash2 size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    if (filteredEvents.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron eventos con los filtros seleccionados.</Text>
        </View>
      );
    }

    if (viewMode === 'list') {
      return (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
        />
      );
    }

    if (viewMode === 'date') {
      // Grouped by Date (Vertical List of Horizontal Lists)
      return (
        <ScrollView contentContainerStyle={styles.listContent}>
          {groupedEvents.map(([date, events]) => (
            <View key={date} style={styles.groupContainer}>
              <Text style={styles.groupTitle}>{date}</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={renderEventItem}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            </View>
          ))}
        </ScrollView>
      );
    }

    if (viewMode === 'category') {
      // Grouped by Category (Vertical List of Vertical Lists)
      return (
        <ScrollView contentContainerStyle={styles.listContent}>
          {groupedEvents.map(([category, events]) => (
            <View key={category} style={styles.groupContainer}>
              <Text style={styles.groupTitle}>{category}</Text>
              {events.map((event) => (
                <View key={event.id} style={{ marginBottom: 16 }}>
                  {renderEventItem({ item: event })}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderFilterModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.l,
    paddingVertical: SIZES.m,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  activeIconButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  searchContainer: {
    paddingHorizontal: SIZES.l,
    paddingBottom: SIZES.s,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.m,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.text,
    height: '100%', // Ensure it takes height
    paddingVertical: 0, // Remove default padding
  },
  listContent: {
    padding: SIZES.l,
    paddingBottom: 100,
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actionsContainer: {
    marginLeft: SIZES.xs,
    alignItems: 'center',
  },
  editButton: {
    padding: SIZES.s,
    marginTop: SIZES.s,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  deleteButton: {
    padding: SIZES.s,
    marginTop: SIZES.xs,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: SIZES.l,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.l,
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  modalBody: {
    flex: 1,
  },
  filterSectionTitle: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
    marginTop: SIZES.m,
    marginBottom: SIZES.s,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeFilterChipText: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeCategoryChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    ...FONTS.caption,
    color: COLORS.text,
  },
  activeCategoryChipText: {
    color: COLORS.surface,
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: SIZES.l,
    paddingTop: SIZES.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 16,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearButtonText: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
  },
  applyButtonText: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.surface,
  },
  // Grouping Styles
  groupContainer: {
    marginBottom: SIZES.l,
  },
  groupTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.s,
    marginLeft: 4,
  },
});

