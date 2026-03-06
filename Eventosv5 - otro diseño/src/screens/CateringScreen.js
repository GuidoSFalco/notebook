
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  UtensilsCrossed, 
  Coffee, 
  Beer, 
  Cake, 
  Edit2, 
  Trash2,
  X,
  Check,
  Info,
  ChefHat
} from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import CategoryPill from '../components/CategoryPill';
import { TaskService, CateringService } from '../services/mockApi';

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: null },
  { id: 'Entradas', name: 'Entradas', icon: UtensilsCrossed },
  { id: 'Platos Principales', name: 'Platos', icon: UtensilsCrossed },
  { id: 'Postres', name: 'Postres', icon: Cake },
  { id: 'Bebidas', name: 'Bebidas', icon: Beer },
];

export default function CateringScreen({ route }) {
  const navigation = useNavigation();
  const { event } = route.params || { event: { id: '1' } }; // Fallback for dev
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('VIEWER');
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newIngredient, setNewIngredient] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    ingredients: []
  });

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, selectedCategory, searchQuery]);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const [fetchedItems, permissions] = await Promise.all([
        CateringService.getItemsByEventId('1'), // Assuming event.id is '1' for mock
        TaskService.getPermissionsByEventAndTool(event.id, 'Catering')
      ]);
      setItems(fetchedItems);
      setFilteredItems(fetchedItems);
      setUserRole(permissions.role);
    } catch (error) {
      console.error("Error loading catering items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let result = items;
    
    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) || 
        item.description.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredItems(result);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Entradas',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      ingredients: []
    });
    setModalVisible(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      ingredients: item.ingredients || []
    });
    setModalVisible(true);
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient.trim()]
      });
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({
      ...formData,
      ingredients: updatedIngredients
    });
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailsModalVisible(true);
  };

  const handleDeleteItem = (id) => {
    Alert.alert(
      'Eliminar Item',
      '¿Estás seguro de que quieres eliminar este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            await CateringService.deleteCateringItem(id);
            loadItems();
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios.');
      return;
    }

    const itemData = {
      ...formData,
      price: parseFloat(formData.price) || 0
    };

    try {
      if (editingItem) {
        await CateringService.updateCateringItem({ ...itemData, id: editingItem.id });
      } else {
        await CateringService.createCateringItem(itemData);
      }
      setModalVisible(false);
      loadItems();
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
        </View>
        
        {/* Availability Badge */}
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
           <View style={[styles.statusBadge, { backgroundColor: item.available !== false ? '#E8F5E9' : '#FFEBEE' }]}>
              <Text style={[styles.statusText, { color: item.available !== false ? '#2E7D32' : '#C62828' }]}>
                 {item.available !== false ? 'Disponible' : 'No disponible'}
              </Text>
           </View>
        </View>

        <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.cardActions}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleViewDetails(item)} style={styles.iconButton}>
               <Info size={18} color={COLORS.primary} />
            </TouchableOpacity>
            {userRole !== 'VIEWER' && (
              <>
                <TouchableOpacity onPress={() => handleEditItem(item)} style={[styles.iconButton, { marginLeft: 10 }]}>
                  <Edit2 size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={[styles.iconButton, { marginLeft: 10 }]}>
                  <Trash2 size={18} color={COLORS.error} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Catering</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar platos..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {CATEGORIES.map(cat => (
            <CategoryPill
              key={cat.id}
              name={cat.name}
              icon={cat.icon}
              isSelected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay items disponibles.</Text>
          </View>
        }
      />

      {/* FAB */}
      {userRole !== 'VIEWER' && (
        <TouchableOpacity style={styles.fab} onPress={handleAddItem}>
          <Plus size={32} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles del Plato</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            {selectedItem && (
              <ScrollView style={styles.detailsScroll}>
                <Image source={{ uri: selectedItem.image }} style={styles.detailImage} />
                
                <View style={styles.detailHeader}>
                  <Text style={styles.detailName}>{selectedItem.name}</Text>
                  <Text style={styles.detailPrice}>${selectedItem.price.toLocaleString()}</Text>
                </View>

                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{selectedItem.category}</Text>
                </View>
                
                <Text style={styles.detailDescription}>{selectedItem.description}</Text>
                
                <View style={styles.ingredientsSection}>
                  <View style={styles.ingredientsHeader}>
                    <ChefHat size={20} color={COLORS.primary} />
                    <Text style={styles.ingredientsTitle}>Ingredientes</Text>
                  </View>
                  
                  <View style={styles.ingredientsGrid}>
                    {selectedItem.ingredients && selectedItem.ingredients.length > 0 ? (
                      selectedItem.ingredients.map((ing, index) => (
                        <View key={index} style={styles.ingredientItem}>
                          <View style={styles.bulletPoint} />
                          <Text style={styles.ingredientDetailText}>{ing}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noIngredientsText}>No hay ingredientes listados.</Text>
                    )}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Edit/Add Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingItem ? 'Editar Item' : 'Nuevo Item'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formScroll}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={text => setFormData({...formData, name: text})}
                placeholder="Ej. Mini Hamburguesas"
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={text => setFormData({...formData, description: text})}
                placeholder="Ingredientes y detalles..."
                multiline
              />

              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={text => setFormData({...formData, price: text})}
                placeholder="0.00"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Categoría</Text>
              <View style={styles.categorySelector}>
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryOption,
                      formData.category === cat.id && styles.categoryOptionSelected
                    ]}
                    onPress={() => setFormData({...formData, category: cat.id})}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      formData.category === cat.id && styles.categoryOptionTextSelected
                    ]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Ingredientes</Text>
              <View style={styles.addIngredientContainer}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={newIngredient}
                  onChangeText={setNewIngredient}
                  placeholder="Agregar ingrediente..."
                />
                <TouchableOpacity style={styles.addIngredientButton} onPress={handleAddIngredient}>
                  <Plus size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.ingredientsList}>
                {formData.ingredients.map((ing, index) => (
                  <View key={index} style={styles.ingredientChip}>
                    <Text style={styles.ingredientText}>{ing}</Text>
                    <TouchableOpacity onPress={() => handleRemoveIngredient(index)} style={styles.removeIngredientButton}>
                      <X size={14} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingTop: Platform.OS === 'android' ? 40 : SIZES.m,
    paddingBottom: SIZES.m,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  backButton: {
    padding: SIZES.xs,
  },
  searchContainer: {
    padding: SIZES.m,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.s,
    ...FONTS.body,
    color: COLORS.text,
  },
  categoriesContainer: {
    marginBottom: SIZES.m,
  },
  categoriesList: {
    paddingHorizontal: SIZES.m,
  },
  listContainer: {
    padding: SIZES.m,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.m,
    marginBottom: SIZES.m,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  cardImage: {
    width: 100,
    height: '100%',
    backgroundColor: '#eee',
  },
  cardContent: {
    flex: 1,
    padding: SIZES.m,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.xs,
  },
  itemName: {
    ...FONTS.h4,
    color: COLORS.text,
    flex: 1,
    marginRight: SIZES.xs,
  },
  itemPrice: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontWeight: '700',
  },
  itemDescription: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SIZES.s,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  categoryBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.s,
    paddingVertical: 4,
    borderRadius: SIZES.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    ...FONTS.caption,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeUnavailable: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.xl,
    borderTopRightRadius: SIZES.xl,
    padding: SIZES.l,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.l,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  formScroll: {
    marginBottom: SIZES.m,
  },
  label: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
    marginTop: SIZES.s,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.s,
    padding: SIZES.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...FONTS.body,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.xs,
  },
  categoryOption: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.s,
    marginBottom: SIZES.s,
  },
  categoryOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryOptionText: {
    ...FONTS.caption,
    color: COLORS.text,
  },
  categoryOptionTextSelected: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.m,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  cancelButton: {
    flex: 1,
    padding: SIZES.m,
    borderRadius: SIZES.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.s,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    padding: SIZES.m,
    borderRadius: SIZES.m,
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.s,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...FONTS.button,
    color: COLORS.textSecondary,
  },
  saveButtonText: {
    ...FONTS.button,
    color: COLORS.surface,
  },
  
  // Ingredient Styles
  addIngredientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  addIngredientButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.s,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.m,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientText: {
    ...FONTS.caption,
    color: COLORS.text,
    marginRight: 6,
  },
  removeIngredientButton: {
    padding: 2,
  },

  // Detail Modal Styles
  detailsScroll: {
    marginBottom: SIZES.m,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.m,
    marginBottom: SIZES.m,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  detailName: {
    ...FONTS.h2,
    flex: 1,
    color: COLORS.text,
  },
  detailPrice: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  detailDescription: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.l,
    marginTop: SIZES.s,
  },
  ingredientsSection: {
    backgroundColor: COLORS.background,
    padding: SIZES.m,
    borderRadius: SIZES.m,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  ingredientsTitle: {
    ...FONTS.h3,
    marginLeft: SIZES.s,
    color: COLORS.text,
  },
  ingredientsGrid: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  ingredientDetailText: {
    ...FONTS.body,
    color: COLORS.text,
  },
  noIngredientsText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
