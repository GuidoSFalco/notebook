import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { EVENTS, CATEGORIES } from '../data/mockData';
import EventCard from '../components/EventCard';

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('1'); // '1' is All
  const [searchQuery, setSearchQuery] = useState('');

  const renderCategory = ({ item }) => {
    const isSelected = item.id === selectedCategory;
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && styles.categoryItemSelected
        ]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Ionicons 
          name={item.icon} 
          size={20} 
          color={isSelected ? '#FFF' : COLORS.light.textSecondary} 
        />
        <Text style={[
          styles.categoryText,
          isSelected && styles.categoryTextSelected
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const filteredEvents = EVENTS.filter(event => {
    const matchesCategory = selectedCategory === '1' || event.category === CATEGORIES.find(c => c.id === selectedCategory)?.name;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.headerTitle}>Discover Events</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.light.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events, places..."
          placeholderTextColor={COLORS.light.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Event List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventCard 
            event={item} 
            onPress={() => navigation.navigate('EventDetails', { event: item })} 
          />
        )}
        contentContainerStyle={styles.eventList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: SIZES.font,
    color: COLORS.light.textSecondary,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.light.text,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
    marginBottom: SIZES.medium,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.light.inputBg,
    height: 50,
    borderRadius: 15,
    paddingLeft: 45,
    paddingRight: 15,
    fontSize: SIZES.medium,
    color: COLORS.light.text,
  },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  categoriesContainer: {
    marginBottom: SIZES.medium,
  },
  categoriesList: {
    paddingHorizontal: SIZES.padding,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    marginLeft: 6,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  categoryTextSelected: {
    color: '#FFF',
  },
  eventList: {
    paddingBottom: 100, // For Tab Bar
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: COLORS.light.textSecondary,
    fontSize: SIZES.medium,
  }
});
