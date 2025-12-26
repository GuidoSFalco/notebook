import React, { useState } from 'react';
import { StyleSheet, FlatList, ScrollView, Pressable, Platform } from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed';
import { MOCK_EVENTS } from '@/data/mockEvents';
import EventCard from '@/components/EventCard';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = ['All', 'Music', 'Technology', 'Art', 'Food', 'Wellness'];

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const insets = useSafeAreaInsets();
  
  const tintColor = useThemeColor({}, 'tint');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');

  const filteredEvents = selectedCategory === 'All' 
    ? MOCK_EVENTS 
    : MOCK_EVENTS.filter(e => e.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={{ height: 60, marginBottom: 10 }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryChip,
                  { 
                    backgroundColor: isSelected ? tintColor : surfaceColor,
                    borderColor: isSelected ? tintColor : 'transparent',
                    borderWidth: 1
                  }
                ]}
              >
                <Text 
                  style={[
                    styles.categoryText, 
                    { 
                      color: isSelected ? '#fff' : textColor,
                      fontWeight: isSelected ? '600' : '400'
                    }
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found in this category.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
