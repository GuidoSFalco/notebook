
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { EVENTS, CATEGORIES } from '../assets/data';
import EventCard from '../components/EventCard';
import CategoryPill from '../components/CategoryPill';
import { Search, Bell } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hola, Guido 👋</Text>
        <Text style={styles.subtitle}>Descubre eventos increíbles</Text>
      </View>
      <TouchableOpacity style={styles.notificationButton}>
        <Bell size={24} color={COLORS.text} />
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
      <TextInput
        placeholder="Buscar eventos, conciertos..."
        style={styles.searchInput}
        placeholderTextColor={COLORS.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
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
          const IconComponent = Icons[cat.icon.charAt(0).toUpperCase() + cat.icon.slice(1)] || Icons.Circle; // Simple dynamic icon mapping
          return (
            <CategoryPill
              key={cat.id}
              name={cat.name}
              // icon={IconComponent} // Optional: Pass icon if mapped correctly
              isSelected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );

  const renderFeatured = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Destacados</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Ver todo</Text>
        </TouchableOpacity>
      </View>
      <EventCard 
        event={EVENTS[0]} 
        onPress={() => navigation.navigate('EventDetail', { event: EVENTS[0] })}
      />
    </View>
  );

  const renderNearby = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
      </View>
      {EVENTS.slice(1).map((event) => (
        <EventCard 
          key={event.id}
          event={event} 
          layout="horizontal"
          onPress={() => navigation.navigate('EventDetail', { event })}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderHeader()}
        {renderSearchBar()}
        {renderCategories()}
        {renderFeatured()}
        {renderNearby()}
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
  scrollContent: {
    padding: SIZES.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SIZES.s,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.text,
  },
  categoriesContainer: {
    marginBottom: SIZES.l,
    marginHorizontal: -SIZES.l, // Full width scroll
  },
  categoriesList: {
    paddingHorizontal: SIZES.l,
  },
  section: {
    marginBottom: SIZES.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  seeAll: {
    ...FONTS.caption,
    color: COLORS.primary,
  },
});
