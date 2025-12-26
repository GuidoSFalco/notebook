import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfessionalCard from '../components/ProfessionalCard';
import CategoryChip from '../components/CategoryChip';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { PROFESSIONALS, CATEGORIES } from '../constants/mockData';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProfessionals = PROFESSIONALS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.greeting}>Hola, Guido</Text>
      <Text style={styles.title}>Encontrá tu especialista</Text>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.light.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar médico, especialidad..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.light.textSecondary}
        />
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <CategoryChip 
            category={item} 
            isSelected={selectedCategory === item.name}
            onPress={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
          />
        )}
      />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredProfessionals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProfessionalCard 
            professional={item} 
            onPress={() => navigation.navigate('ProfessionalDetail', { professional: item })}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  listContent: {
    padding: SPACING.m,
  },
  headerContainer: {
    marginBottom: SPACING.l,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.light.textSecondary,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: SPACING.m,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.m,
    paddingHorizontal: SPACING.m,
    height: 50,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.s,
    fontSize: 16,
    color: COLORS.light.text,
  },
  categoriesContainer: {
    paddingRight: SPACING.m,
  },
});
