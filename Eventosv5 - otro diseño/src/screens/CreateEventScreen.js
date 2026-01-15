
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, ArrowRight, Upload, Calendar, MapPin, DollarSign } from 'lucide-react-native';

const STEPS = ['Detalles', 'Ubicación', 'Tickets'];
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function CreateEventScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const inputAnimation = useRef(new Animated.Value(0)).current;
  const categoriesAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(inputAnimation, {
      toValue: title.length > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [title]);

  useEffect(() => {
    Animated.timing(categoriesAnimation, {
      toValue: categoriesExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [categoriesExpanded]);

  const animatedBorderColor = inputAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.secondary, COLORS.primary]
  });

  const animatedBackgroundColor = inputAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff0f3', 'rgba(108, 99, 255, 0.05)']
  });

  const categoriesHeight = categoriesAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 160],
  });

  const categories = [
    'No definido',
    'Boliche',
    'Fiesta',
    'Viaje',
    'Nacional',
    'Aire Libre',
    'Virtual',
    'Música',
    'Juntada',
    'Cumpleaños',
    'Reunion Laboral',
    'Casamiento',
    'Feria',
    'Arte',
    'Tecnología',
    'Deportivo',
    'Otros',
    'Show',
    'Conciertos',
    'Fiestas',
    'Teatro',
  ];

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentStep + 1) / STEPS.length) * 100}%` }
          ]} 
        />
      </View>
      <View style={styles.stepsLabels}>
        {STEPS.map((step, index) => (
          <Text 
            key={index} 
            style={[
              styles.stepLabel, 
              index <= currentStep && styles.stepLabelActive
            ]}
          >
            {step}
          </Text>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => {
    const normalizedSearch = categorySearch.toLowerCase().trim();

    const filteredBySearch =
      categoriesExpanded && normalizedSearch.length > 0
        ? categories.filter((cat) =>
            cat.toLowerCase().includes(normalizedSearch)
          )
        : categories;

    const withoutSelected = filteredBySearch.filter(
      (cat) => cat !== selectedCategory
    );
    const orderedCategories = selectedCategory
      ? [selectedCategory, ...withoutSelected]
      : filteredBySearch;

    return (
      <View>
        <Text style={styles.label}>Título del Evento</Text>
        <AnimatedTextInput
          style={[
            styles.input,
            styles.requiredInput,
            {
              borderColor: animatedBorderColor,
              backgroundColor: animatedBackgroundColor,
            },
          ]}
          placeholder="Ej. Fiesta en la Playa"
          placeholderTextColor={COLORS.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.labelRow}>
          <Text style={styles.label}>Categoría</Text>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setCategoriesExpanded(!categoriesExpanded)}
          >
            <Text style={styles.expandButtonText}>
              {categoriesExpanded ? 'Ver menos' : 'Ver más'}
            </Text>
          </TouchableOpacity>
        </View>

        {categoriesExpanded && (
          <TextInput
            style={styles.categorySearchInput}
            placeholder="Buscar categoría..."
            placeholderTextColor={COLORS.textSecondary}
            value={categorySearch}
            onChangeText={setCategorySearch}
          />
        )}

        {categoriesExpanded ? (
          <Animated.View
            style={[
              styles.categoryContainerExpanded,
              { height: categoriesHeight, overflow: 'hidden' },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {orderedCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.categoryContainerCollapsed,
              { height: categoriesHeight, overflow: 'hidden' },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRowHorizontal}
            >
              {orderedCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Cuéntanos más sobre tu evento..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={4}
        />
      </View>
    );
  };

  const renderStep2 = () => (
    <View>
      <Text style={styles.label}>Fecha y Hora</Text>
      <View style={styles.rowInput}>
        <Calendar size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput 
          style={styles.inputNoBorder} 
          placeholder="Seleccionar fecha"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <Text style={styles.label}>Ubicación</Text>
      <View style={styles.rowInput}>
        <MapPin size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput 
          style={styles.inputNoBorder} 
          placeholder="Buscar dirección"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Mapa Preview</Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.label}>Imagen de Portada</Text>
      <TouchableOpacity style={styles.uploadBox}>
        <Upload size={32} color={COLORS.primary} />
        <Text style={styles.uploadText}>Subir imagen</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Precio del Ticket</Text>
      <View style={styles.rowInput}>
        <DollarSign size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput 
          style={styles.inputNoBorder} 
          placeholder="0.00"
          keyboardType="numeric"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>
    </View>
  );

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.goBack();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Evento</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {renderProgressBar()}

      <ScrollView contentContainerStyle={styles.content}>
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* {currentStep === 0 ? ( */}
          <View style={styles.footerButtonsRow}>
            <TouchableOpacity style={[styles.nextButton, styles.flexNextButton]} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Siguiente</Text>
              <ArrowRight size={20} color={COLORS.surface} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            
            {title.length > 0 && (
              <TouchableOpacity style={[styles.nextButton, styles.flexCreateButton, styles.createButton]} onPress={() => navigation.goBack()}>
                <Text style={styles.nextButtonText}>Crear</Text>
              </TouchableOpacity>
            )}
          </View>
        {/* ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStep === STEPS.length - 1 ? 'Publicar Evento' : 'Siguiente'}
            </Text>
            {currentStep < STEPS.length - 1 && (
              <ArrowRight size={20} color={COLORS.surface} style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        )} */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  requiredInput: {
    borderColor: COLORS.secondary,
    borderWidth: 2,
    backgroundColor: '#fff0f3', // Light tint to make it stand out more
  },
  footerButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexNextButton: {
    flex: 1,
  },
  flexCreateButton: {
    flex: 0.5,
  },
  createButton: {
    backgroundColor: COLORS.success,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.l,
    paddingVertical: SIZES.m,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: SIZES.l,
    marginBottom: SIZES.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginBottom: SIZES.s,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  stepsLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  content: {
    padding: SIZES.l,
  },
  label: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SIZES.s,
    marginTop: SIZES.m,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryContainerExpanded: {
    marginTop: SIZES.s,
  },
  categoryContainerCollapsed: {
    // marginTop: SIZES.s,
  },
  categorySearchInput: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...FONTS.body,
    color: COLORS.text,
    marginTop: SIZES.s,
    marginBottom: SIZES.s,
  },
  expandButton: {
    paddingHorizontal: SIZES.s,
    paddingVertical: SIZES.s / 2,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  expandButtonText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontSize: 10,
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...FONTS.body,
    color: COLORS.text,
    
    outlineStyle: 'none', // Disable focus outline
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryRowHorizontal: {
    marginTop: SIZES.s,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChip: {
    minHeight: 40,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.s,
    marginBottom: SIZES.s,
  },
  categoryChipText: {
    ...FONTS.caption,
    color: COLORS.text,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipTextSelected: {
    color: COLORS.surface,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s, // Reduced padding since textinput has its own height
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 56,
  },
  inputIcon: {
    marginRight: SIZES.s,
  },
  inputNoBorder: {
    // flex: 1,
    // ...FONTS.body,
    // color: COLORS.text,
    // height: '100%',

    backgroundColor: COLORS.surface,
    paddingLeft: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.radius,
    width: '100%',
    // borderColor: COLORS.border,
    ...FONTS.body,
    color: COLORS.text,
    outlineStyle: 'none', // Disable focus outline
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: COLORS.border,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.m,
  },
  mapText: {
    color: COLORS.textSecondary,
    ...FONTS.caption,
  },
  uploadBox: {
    height: 150,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
  },
  uploadText: {
    color: COLORS.primary,
    marginTop: SIZES.s,
    ...FONTS.caption,
    fontWeight: '600',
  },
  footer: {
    padding: SIZES.l,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.surface,
    ...FONTS.h3,
    fontSize: 16,
  },
});
