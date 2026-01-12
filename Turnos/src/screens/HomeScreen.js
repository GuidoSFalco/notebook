import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfessionalCard from '../components/ProfessionalCard';
import CategoryChip from '../components/CategoryChip';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import ProfessionalService from '../services/professional.service';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [professionals, setProfessionals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProfessionals();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await ProfessionalService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error('Error loading categories', e);
    }
  };

  const loadProfessionals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.name = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      const data = await ProfessionalService.getAll(params);
      setProfessionals(data);
    } catch (e) {
      console.error('Error loading professionals', e);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.greeting}>Hola, {user?.name || 'Usuario'}</Text>
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
        data={categories}
        keyExtractor={item => item.id.toString()}
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
      {loading && !professionals.length ? (
         <View style={styles.loadingContainer}>
            {renderHeader()}
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
         </View>
      ) : (
        <FlatList
          data={professionals}
          keyExtractor={item => item.id.toString()}
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
      )}
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
    padding: SPACING.s,
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
    gap: SPACING.s,
  },
  loadingContainer: {
    padding: SPACING.m,
  }
});
