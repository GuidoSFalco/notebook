
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ArrowLeft, ArrowRight, Upload, Calendar, MapPin, DollarSign, X, Edit2, Trash2 } from 'lucide-react-native';
import { GOOGLE_MAPS_API_KEY } from '../config/mapsConfig';
import EventMap from '../components/EventMap';
import EventDateTimePicker from '../components/EventDateTimePicker';
import * as ImagePicker from 'expo-image-picker';

const STEPS = ['Detalles', 'Ubicación', 'Tickets'];
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function CreateEventScreen({ navigation, route }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [dateText, setDateText] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [endDateText, setEndDateText] = useState('');
  const [selectedEndDateTime, setSelectedEndDateTime] = useState(null);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [eventType, setEventType] = useState('presencial');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [virtualLink, setVirtualLink] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isRefiningLocation, setIsRefiningLocation] = useState(false);
  const [originalCoordinate, setOriginalCoordinate] = useState(null);
  const suggestionsTimeout = useRef(null);

  const initialEvent = route?.params?.event || null;
  const mode = route?.params?.mode === 'edit' || initialEvent ? 'edit' : 'create';
  const onSubmit = route?.params?.onSubmit;

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

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setSelectedCategory(initialEvent.category || null);
      setDescription(initialEvent.description || '');
      setDateText(initialEvent.date || '');
      if (initialEvent.endDate) {
        setEndDateText(initialEvent.endDate);
        setHasEndDate(true);
      }
      setCoverImage(initialEvent.image || null);
      if (initialEvent.type === 'virtual' || initialEvent.isVirtual) {
        setEventType('virtual');
      } else {
        setEventType('presencial');
      }
      const initialAddress = initialEvent.locationAddress || initialEvent.location || '';
      setLocationAddress(initialAddress);
      setLocationQuery(initialAddress);
      if (typeof initialEvent.latitude === 'number' && typeof initialEvent.longitude === 'number') {
        const region = {
          latitude: initialEvent.latitude,
          longitude: initialEvent.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setMapRegion(region);
        setSelectedCoordinate({
          latitude: initialEvent.latitude,
          longitude: initialEvent.longitude,
        });
      }
      setVirtualLink(initialEvent.virtualLink || '');
    }
  }, [initialEvent]);

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
          <View style={styles.categorySearchContainer}>
            <TextInput
              style={styles.categorySearchInput}
              placeholder="Buscar categoría..."
              placeholderTextColor={COLORS.textSecondary}
              value={categorySearch}
              onChangeText={setCategorySearch}
            />
            {categorySearch.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setCategorySearch('')}
              >
                <X size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {categoriesExpanded ? (
          <Animated.View
            style={[
              styles.categoryContainerExpanded,
              { height: categoriesHeight, overflow: 'hidden' },
            ]}
          >
            <ScrollView
              nestedScrollEnabled={true}
              style={{ flex: 1 }}
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
          value={description}
          onChangeText={setDescription}
        />
      </View>
    );
  };

  const handleEventTypeChange = (type) => {
    setEventType(type);
    if (type === 'virtual') {
      setSelectedCoordinate(null);
      setLocationAddress('');
      setLocationQuery('');
      setIsRefiningLocation(false);
    }
  };

  const handleMapPress = async (event) => {
    if (eventType === 'virtual') {
      return;
    }
    const coordinate = event.nativeEvent.coordinate;
    setSelectedCoordinate(coordinate);
    setMapRegion((prev) => ({
      ...prev,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    }));
    if (isRefiningLocation) {
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) {
      setLocationAddress('');
      return;
    }
    try {
      setIsGeocoding(true);
      setGeocodeError('');
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
      console.log(url)
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK' && data.results && data.results[0]) {
        const formatted = data.results[0].formatted_address;
        setLocationAddress(formatted);
        setLocationQuery(formatted);
      } else {
        setGeocodeError('No se pudo obtener la dirección.');
      }
    } catch (error) {
      setGeocodeError('Error al obtener la dirección.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSearchLocation = async (input) => {
    const query = (input || locationQuery).trim();
    if (!query) {
      setGeocodeError('Ingresa una dirección para buscar.');
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) {
      setLocationAddress(query);
      setSelectedCoordinate(null);
      return;
    }
    try {
      setIsGeocoding(true);
      setGeocodeError('');
      const encoded = encodeURIComponent(query);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK' && data.results && data.results[0]) {
        const result = data.results[0];
        const { lat, lng } = result.geometry.location;
        const formatted = result.formatted_address;
        const coordinate = {
          latitude: lat,
          longitude: lng,
        };
        setSelectedCoordinate(coordinate);
        setMapRegion({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLocationAddress(formatted);
      } else if (data.status === 'REQUEST_DENIED') {
        setLocationAddress(query);
        setGeocodeError('Error de API Key: Permiso denegado.');
        console.error("Geocoding API Error:", data.error_message);
      } else {
        setLocationAddress(query);
        setGeocodeError('No se encontró la dirección.');
        console.log("Geocoding Status:", data.status);
      }
    } catch (error) {
      setLocationAddress(query);
      setGeocodeError('Error al buscar la dirección.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleRegionChangeComplete = (region) => {
    setMapRegion(region);
    if (isRefiningLocation) {
      setSelectedCoordinate({
        latitude: region.latitude,
        longitude: region.longitude,
      });
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
  };

  const handleClearLocationInput = () => {
    setLocationQuery('');
    setLocationSuggestions([]);
    if (geocodeError) {
      setGeocodeError('');
    }
    if (isRefiningLocation) {
      setIsRefiningLocation(false);
    }
  };

  const renderStep2 = () => (
    <View>
      <EventDateTimePicker
        startDate={selectedDateTime}
        startDateText={dateText}
        onStartDateChange={(date, formatted) => {
          setSelectedDateTime(date);
          setDateText(formatted);
        }}
        endDate={selectedEndDateTime}
        endDateText={endDateText}
        onEndDateChange={(date, formatted) => {
          setSelectedEndDateTime(date);
          setEndDateText(formatted);
        }}
        hasEndDate={hasEndDate}
        onToggleEndDate={setHasEndDate}
      />

      <Text style={styles.label}>Tipo de evento</Text>
      <View style={styles.typeToggleRow}>
        <TouchableOpacity
          style={[
            styles.typeChip,
            eventType === 'presencial' && styles.typeChipSelected,
          ]}
          onPress={() => handleEventTypeChange('presencial')}
        >
          <Text
            style={[
              styles.typeChipText,
              eventType === 'presencial' && styles.typeChipTextSelected,
            ]}
          >
            Presencial
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeChip,
            eventType === 'virtual' && styles.typeChipSelected,
          ]}
          onPress={() => handleEventTypeChange('virtual')}
        >
          <Text
            style={[
              styles.typeChipText,
              eventType === 'virtual' && styles.typeChipTextSelected,
            ]}
          >
            Virtual
          </Text>
        </TouchableOpacity>
      </View>

      {eventType === 'virtual' ? (
        <>
          <Text style={styles.label}>Enlace del evento</Text>
          <View style={styles.rowInput}>
            <TextInput
              style={styles.inputNoBorder}
              placeholder="Ej. enlace de Zoom o Google Meet"
              placeholderTextColor={COLORS.textSecondary}
              value={virtualLink}
              onChangeText={setVirtualLink}
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.locationInputWrapper}>
            <View style={styles.rowInput}>
              <MapPin size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <View style={styles.inputNoBorderContainer}>
                <TextInput 
                  style={styles.inputNoBorder} 
                  placeholder="Buscar dirección"
                  placeholderTextColor={COLORS.textSecondary}
                  value={locationQuery}
                  onChangeText={(text) => {
                    setLocationQuery(text);
                    if (geocodeError) {
                      setGeocodeError('');
                    }
                    if (isRefiningLocation) {
                      setIsRefiningLocation(false);
                    }
                    if (!GOOGLE_MAPS_API_KEY) {
                      setLocationSuggestions([]);
                      return;
                    }
                    if (suggestionsTimeout.current) {
                      clearTimeout(suggestionsTimeout.current);
                    }
                    const trimmed = text.trim();
                    if (trimmed.length < 2) {
                      setLocationSuggestions([]);
                      return;
                    }
                    suggestionsTimeout.current = setTimeout(async () => {
                      try {
                        const encoded = encodeURIComponent(trimmed);
                        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encoded}&key=${GOOGLE_MAPS_API_KEY}&language=es`;
                        const response = await fetch(url);
                        const data = await response.json();
                        if (data.status === 'OK' && data.predictions) {
                          setLocationSuggestions(data.predictions);
                        } else if (data.status === 'ZERO_RESULTS') {
                          setLocationSuggestions([]);
                        } else {
                          setLocationSuggestions([]);
                        }
                      } catch (error) {
                        setLocationSuggestions([]);
                      }
                    }, 400);
                  }}
                  onSubmitEditing={() => handleSearchLocation()}
                />
              </View>
              <TouchableOpacity style={styles.searchButton} onPress={handleClearLocationInput}>
                <Text style={styles.searchButtonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
            {locationSuggestions.length > 0 && (
              <View style={styles.locationSuggestionsContainer}>
                {locationSuggestions.map((item) => (
                  <TouchableOpacity
                    key={item.place_id}
                    style={styles.locationSuggestionItem}
                    onPress={() => {
                      const description = item.description;
                      setLocationQuery(description);
                      setLocationAddress(description);
                      setLocationSuggestions([]);
                      handleSearchLocation(description);
                    }}
                  >
                    <Text style={styles.locationSuggestionMainText}>
                      {item.structured_formatting?.main_text || item.description}
                    </Text>
                    {item.structured_formatting?.secondary_text ? (
                      <Text style={styles.locationSuggestionSecondaryText}>
                        {item.structured_formatting.secondary_text}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {locationAddress ? (
            <Text style={styles.locationHelperText}>{locationAddress}</Text>
          ) : null}
          {geocodeError ? (
            <Text style={styles.locationErrorText}>{geocodeError}</Text>
          ) : null}
          {(locationAddress || selectedCoordinate) ? (
            <View style={styles.refineLocationContainer}>
              <TouchableOpacity
                style={[
                  styles.refineLocationButton,
                  isRefiningLocation && {
                    backgroundColor: COLORS.primary,
                    borderColor: COLORS.primary,
                  },
                ]}
                onPress={() => {
                   if (!isRefiningLocation) {
                     setOriginalCoordinate(selectedCoordinate);
                     setIsRefiningLocation(true);
                   } else {
                     setIsRefiningLocation(false);
                     setOriginalCoordinate(null);
                   }
                }}
              >
                <Text
                  style={[
                    styles.refineLocationButtonText,
                    isRefiningLocation && { color: COLORS.surface },
                  ]}
                >
                  {isRefiningLocation ? 'Guardar ubicación exacta' : 'Mejorar precisión de ubicación'}
                </Text>
              </TouchableOpacity>
              
              {isRefiningLocation && (
                <TouchableOpacity
                  style={styles.cancelRefineButton}
                  onPress={() => {
                    setIsRefiningLocation(false);
                    if (originalCoordinate) {
                      setSelectedCoordinate(originalCoordinate);
                      setMapRegion(prev => ({
                        ...prev,
                        latitude: originalCoordinate.latitude,
                        longitude: originalCoordinate.longitude,
                      }));
                    }
                    setOriginalCoordinate(null);
                  }}
                >
                  <Text style={styles.cancelRefineButtonText}>Cancelar</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
          <View style={[styles.mapContainer, { zIndex: 1 }]}>
            <EventMap
              style={styles.map}
              initialRegion={mapRegion}
              region={mapRegion}
              markerCoordinate={selectedCoordinate}
              interactive
              googleMapsApiKey={GOOGLE_MAPS_API_KEY || undefined}
              onPress={handleMapPress}
              draggable={true}
              onMarkerDragEnd={handleMapPress}
              onRegionChangeComplete={handleRegionChangeComplete}
            />
            {isRefiningLocation && (
              <View pointerEvents="none" style={styles.mapCenterMarker}>
                <MapPin size={28} color={COLORS.primary} />
              </View>
            )}
            {isGeocoding && (
              <View style={styles.mapLoadingOverlay}>
                <ActivityIndicator color={COLORS.surface} />
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.label}>Imagen de Portada</Text>
      {coverImage ? (
        <View style={styles.coverImageContainer}>
          <View style={styles.coverImageWrapper}>
            <Image source={{ uri: coverImage }} style={styles.coverImage} resizeMode="cover" />
          </View>
          <View style={styles.coverImageActions}>
            <TouchableOpacity
              style={[styles.coverImageActionButton, styles.changeImageButton]}
              onPress={handlePickImage}
            >
              <Edit2 size={16} color={COLORS.primary} />
              <Text style={[styles.coverImageActionText, styles.changeImageText]}>Cambiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.coverImageActionButton, styles.removeImageButton]}
              onPress={handleRemoveImage}
            >
              <Trash2 size={16} color={COLORS.error} />
              <Text style={[styles.coverImageActionText, styles.removeImageText]}>Quitar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
          <Upload size={32} color={COLORS.primary} />
          <Text style={styles.uploadText}>Subir imagen</Text>
        </TouchableOpacity>
      )}

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

  const buildEventPayload = () => {
    const payload = {
      title,
      category: selectedCategory,
      description,
      date: dateText,
      endDate: hasEndDate ? endDateText : null,
      type: eventType,
      isVirtual: eventType === 'virtual',
      location: locationAddress || locationQuery,
      locationAddress: locationAddress || locationQuery,
      latitude: selectedCoordinate ? selectedCoordinate.latitude : undefined,
      longitude: selectedCoordinate ? selectedCoordinate.longitude : undefined,
      virtualLink: virtualLink || undefined,
      image: coverImage || (initialEvent && initialEvent.image) || undefined,
    };
    if (initialEvent && initialEvent.id) {
      payload.id = initialEvent.id;
    }
    return payload;
  };

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
        <Text style={styles.headerTitle}>{mode === 'edit' ? 'Editar Evento' : 'Crear Evento'}</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {renderProgressBar()}

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always">
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerButtonsRow}>
          {currentStep !== STEPS.length - 1 ? (
            <>
              <TouchableOpacity
                style={[styles.nextButton, styles.flexNextButton]}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>Siguiente</Text>
                <ArrowRight
                  size={20}
                  color={COLORS.surface}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              {title.trim().length > 0 && (
                <TouchableOpacity
                  style={[
                    styles.nextButton,
                    styles.flexCreateButton,
                    styles.createButton,
                  ]}
                  onPress={() => {
                    const payload = buildEventPayload();
                    if (onSubmit && typeof onSubmit === 'function') {
                      onSubmit(payload);
                    }
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.nextButtonText}>
                    {mode === 'edit' ? 'Guardar' : 'Crear'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : title.trim().length === 0 ? (
            <TouchableOpacity
              style={[
                styles.nextButton,
                styles.flexNextButton,
                styles.missingNameButton,
              ]}
              onPress={() => {
                setCurrentStep(0);
              }}
            >
              <Text style={styles.nextButtonText}>
                Falta completar el nombre del evento
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, styles.flexNextButton, styles.createButton]}
              onPress={() => {
                const payload = buildEventPayload();
                if (onSubmit && typeof onSubmit === 'function') {
                  onSubmit(payload);
                }
                navigation.goBack();
              }}
            >
              <Text style={styles.nextButtonText}>
                {mode === 'edit' ? 'Guardar' : 'Crear'}
              </Text>
              <Upload
                size={20}
                color={COLORS.surface}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          )}
        </View>
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
  missingNameButton: {
    backgroundColor: COLORS.error,
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
  categorySearchContainer: {
    marginTop: SIZES.s,
    marginBottom: SIZES.s,
    justifyContent: 'center',
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
    paddingRight: 40,
  },
  clearSearchButton: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  inputNoBorderContainer: {
    flex: 1,
  },
  inputNoBorder: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingLeft: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.radius,
    ...FONTS.body,
    color: COLORS.text,
    outlineStyle: 'none', // Disable focus outline
  },
  typeToggleRow: {
    flexDirection: 'row',
    marginTop: SIZES.s,
  },
  typeChip: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginRight: SIZES.s,
  },
  typeChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeChipText: {
    ...FONTS.caption,
    color: COLORS.text,
  },
  typeChipTextSelected: {
    color: COLORS.surface,
  },
  searchButton: {
    flexShrink: 0,
    marginLeft: SIZES.s,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.xs,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    ...FONTS.caption,
    color: COLORS.surface,
  },
  locationHelperText: {
    marginTop: SIZES.xs,
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  locationErrorText: {
    marginTop: SIZES.xs,
    ...FONTS.caption,
    color: COLORS.error,
  },
  locationInputWrapper: {
    marginBottom: SIZES.s,
  },
  locationSuggestionsContainer: {
    marginTop: 4,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    maxHeight: 180,
  },
  locationSuggestionItem: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.xs,
  },
  locationSuggestionMainText: {
    ...FONTS.body,
    color: COLORS.text,
  },
  locationSuggestionSecondaryText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  refineLocationContainer: {
    marginTop: SIZES.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.s,
  },
  refineLocationButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.s,
    paddingVertical: SIZES.xs,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelRefineButton: {
    paddingHorizontal: SIZES.s,
    paddingVertical: SIZES.xs,
    borderRadius: 20,
    backgroundColor: COLORS.error + '20', // Light red background
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  cancelRefineButtonText: {
    ...FONTS.caption,
    color: COLORS.error,
    fontSize: 12,
  },
  refineLocationButtonText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontSize: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginTop: SIZES.m,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCenterMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -14 },
      { translateY: -28 },
    ],
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
  coverImageContainer: {
    marginBottom: SIZES.s,
  },
  coverImageWrapper: {
    height: 150,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverImageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SIZES.s,
    marginTop: SIZES.s,
  },
  coverImageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.xs,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
  },
  changeImageButton: {
    borderColor: COLORS.primary,
  },
  removeImageButton: {
    borderColor: COLORS.error,
  },
  coverImageActionText: {
    ...FONTS.caption,
    fontWeight: '600',
  },
  changeImageText: {
    color: COLORS.primary,
  },
  removeImageText: {
    color: COLORS.error,
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
