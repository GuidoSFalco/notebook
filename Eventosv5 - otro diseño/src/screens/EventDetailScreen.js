import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking, Platform, Alert, Modal, FlatList, Share, PanResponder, Animated as RNAnimated } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { MapPin, Calendar, ArrowLeft, Share2, Heart, Edit, DollarSign, ListTodo, Image as ImageIcon, Users, Plus, X, BarChart, Mic, MessageCircle, FileText, Settings, Video, Wifi, Info, Briefcase, ChevronUp, ChevronDown, UtensilsCrossed, ChefHat, ZoomIn, ZoomOut, Globe, Lock, Clock, Navigation, Minus, LayoutGrid, List, Coffee, Wine, Beer, Pizza, Sandwich, Cake, IceCream, Martini } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOOGLE_MAPS_API_KEY } from '../config/mapsConfig';
import EventMap from '../components/EventMap';
import { TaskService, CateringService } from '../services/mockApi';

const { width, height } = Dimensions.get('window');

const MENU_CATEGORIES = {
   'Entradas': { icon: Pizza, label: 'Entradas' },
   'Platos Principales': { icon: UtensilsCrossed, label: 'Principales' },
   'Postres': { icon: IceCream, label: 'Postres' },
   'Bebidas': { icon: Martini, label: 'Bebidas' },
   'Cafetería': { icon: Coffee, label: 'Cafetería' },
   'Vinos': { icon: Wine, label: 'Vinos' },
   'Cervezas': { icon: Beer, label: 'Cervezas' },
   'Tragos': { icon: Martini, label: 'Tragos' },
   'Sandwiches': { icon: Sandwich, label: 'Sandwiches' },
   'Tortas': { icon: Cake, label: 'Tortas' },
   // Fallbacks for compatibility
   'Entrada': { icon: Pizza, label: 'Entradas' },
   'Plato Principal': { icon: UtensilsCrossed, label: 'Principales' },
   'Postre': { icon: IceCream, label: 'Postres' },
   'Bebida': { icon: Martini, label: 'Bebidas' },
};

// --- Gallery Components ---

const ZoomView = ({ source, width, height }) => {
  const [scale, setScale] = useState(1);
  const lastScale = useRef(1);
  const baseScale = useRef(new RNAnimated.Value(1)).current;
  const pinchScale = useRef(new RNAnimated.Value(1)).current;
  
  const lastDistance = useRef(0);
  
  const onPinchEvent = RNAnimated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: true }
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (evt.nativeEvent.touches.length === 2) {
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          lastDistance.current = Math.hypot(touch1.pageX - touch2.pageX, touch1.pageY - touch2.pageY);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length === 2) {
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          const currentDistance = Math.hypot(touch1.pageX - touch2.pageX, touch1.pageY - touch2.pageY);
          
          if (lastDistance.current > 0) {
            const scaleFactor = currentDistance / lastDistance.current;
            baseScale.setValue(lastScale.current * scaleFactor);
          }
        }
      },
      onPanResponderRelease: () => {
         // Reset for simplicity in this context
      }
    })
  ).current;

  // Android: Double Tap to Zoom (Simulated)
  const lastTap = useRef(null);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && (now - lastTap.current) < 300) {
      RNAnimated.timing(baseScale, {
        toValue: lastScale.current > 1 ? 1 : 2,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        lastScale.current = lastScale.current > 1 ? 1 : 2;
      });
    } else {
      lastTap.current = now;
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap} style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      <RNAnimated.Image
        source={source}
        style={{
          width,
          height: height * 0.8,
          transform: [{ scale: baseScale }]
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const Lightbox = ({ visible, media, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(true);
  const flatListRef = useRef(null);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  const handleScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== currentIndex) {
      setCurrentIndex(roundIndex);
    }
  }, [currentIndex]);

  const getItemLayout = (_, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  const handleShare = async () => {
    try {
      const item = media[currentIndex];
      await Share.share({
        message: `Mira esta foto del evento: ${item.url}`,
        url: item.url,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
       <ZoomView source={{ uri: item.url }} width={width} height={height} />
       
       {showInfo && (
         <View style={galleryStyles.lightboxMeta}>
           <Text style={galleryStyles.lightboxDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
           <Text style={galleryStyles.lightboxUser}>Subido por: User {item.uploadedBy}</Text>
         </View>
       )}
    </View>
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={galleryStyles.lightboxContainer}>
        <SafeAreaView edges={['top']} style={galleryStyles.lightboxHeader}>
          <TouchableOpacity style={galleryStyles.lightboxButton} onPress={onClose}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={galleryStyles.lightboxActions}>
            <TouchableOpacity style={galleryStyles.lightboxButton} onPress={() => setShowInfo(!showInfo)}>
              <Info size={24} color={showInfo ? COLORS.primary : "#FFF"} />
            </TouchableOpacity>
            <TouchableOpacity style={galleryStyles.lightboxButton} onPress={handleShare}>
              <Share2 size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        
        <FlatList
          ref={flatListRef}
          data={media}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          getItemLayout={getItemLayout}
          initialScrollIndex={initialIndex}
          scrollEventThrottle={16}
        />
        
        <View style={galleryStyles.lightboxControls}>
            <Text style={galleryStyles.lightboxCounter}>{currentIndex + 1} / {media.length}</Text>
        </View>
      </View>
    </Modal>
  );
};

const galleryStyles = StyleSheet.create({
  lightboxContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  lightboxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  lightboxActions: {
    flexDirection: 'row',
  },
  lightboxButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  lightboxControls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lightboxCounter: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  lightboxMeta: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    borderRadius: 12,
  },
  lightboxDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  lightboxUser: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
});

const ALL_TOOLS = [
  { id: 'Expenses', name: 'Gastos', icon: DollarSign, color: '#4CAF50' },
  { id: 'Tasks', name: 'Tareas', icon: ListTodo, color: '#2196F3' },
  { id: 'Gallery', name: 'Galería', icon: ImageIcon, color: '#E91E63' },
  { id: 'Catering', name: 'Catering', icon: UtensilsCrossed, color: '#FF5722' },
  { id: 'Organogram', name: 'Organigrama', icon: Users, color: '#FF9800' },
  { id: 'Analytics', name: 'Analíticas', icon: BarChart, color: '#9C27B0' },
  { id: 'Speakers', name: 'Speakers', icon: Mic, color: '#673AB7' },
  { id: 'Chat', name: 'Chat', icon: MessageCircle, color: '#00BCD4' },
  { id: 'Files', name: 'Archivos', icon: FileText, color: '#607D8B' },
  { id: 'Config', name: 'Config', icon: Settings, color: '#795548' },
  { id: 'Live', name: 'En Vivo', icon: Video, color: '#F44336' },
  { id: 'WiFi', name: 'WiFi', icon: Wifi, color: '#03A9F4' },
  { id: 'Info', name: 'Info', icon: Info, color: '#FFC107' },
  { id: 'Sponsors', name: 'Sponsors', icon: Briefcase, color: '#8BC34A' },
];

const QuickActionButton = ({ icon: Icon, label, onPress }) => (
  <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: COLORS.dockBackground }]}>
      <Icon size={24} color={COLORS.primary} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;
  const insets = useSafeAreaInsets();
  
  // Section Navigation Refs
  const scrollViewRef = useRef(null);
  const sectionPositions = useRef({});

  // View Mode State
  const [galleryViewMode, setGalleryViewMode] = useState('horizontal'); // 'horizontal' | 'grid'
  const [menuViewMode, setMenuViewMode] = useState('horizontal'); // 'horizontal' | 'grid'
  const [selectedMenuCategory, setSelectedMenuCategory] = useState(null);
  
  // State for Tools Management
  const [myTools, setMyTools] = useState([
    { id: 'Expenses', name: 'Gastos', icon: DollarSign, color: '#4CAF50' },
    { id: 'Tasks', name: 'Tareas', icon: ListTodo, color: '#2196F3' },
    { id: 'Gallery', name: 'Galería', icon: ImageIcon, color: '#E91E63' },
  ]);
  const [isToolPickerVisible, setIsToolPickerVisible] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'management'
  const [activeSection, setActiveSection] = useState('info');
  const [currentUserRole, setCurrentUserRole] = useState('VIEWER');
  
  // Content State
  const [publicPhotos, setPublicPhotos] = useState([]);
  const [publicCatering, setPublicCatering] = useState([]);

  // Modal State for Preview
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [cateringModalVisible, setCateringModalVisible] = useState(false);
  const [selectedCateringItem, setSelectedCateringItem] = useState(null);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxVisible(true);
  };

  const openCateringDetail = (item) => {
    setSelectedCateringItem(item);
    setCateringModalVisible(true);
  };

  useEffect(() => {
    const init = async () => {
       try {
         const p = await TaskService.getPermissionsByEventAndTool(event.id, 'General');
         setCurrentUserRole(p.role);
         
         const photos = await TaskService.getMediaByAlbumId('all', event.id);
         setPublicPhotos(photos.filter(m => m.visibility === 'public'));

         const cateringItems = await CateringService.getItemsByEventId(event.id);
         setPublicCatering(cateringItems);
       } catch (e) {
         console.error(e);
       }
    };
    init();
  }, []);

  const isOrganizer = currentUserRole === 'ADMIN' || currentUserRole === 'COLLABORATOR';

  const isVirtual = event.type === 'virtual' || event.isVirtual;
  const hasCoordinates = typeof event.latitude === 'number' && typeof event.longitude === 'number';
  const mapRegion = hasCoordinates
    ? {
        latitude: event.latitude,
        longitude: event.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : null;

  const handleAddTool = (tool) => {
    setMyTools([...myTools, tool]);
    setIsToolPickerVisible(false);
  };

  const handleRemoveTool = (toolId) => {
    const tool = myTools.find(t => t.id === toolId);
    if (!tool) return;

    Alert.alert(
      'Eliminar herramienta', 
      `¿Estás seguro que deseas quitar ${tool.name} de este evento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => setMyTools(myTools.filter(t => t.id !== toolId)), style: 'destructive' }
      ]
    );
  };

  const handleAddToCalendar = () => {
    try {
      const startDate = event.rawDate ? new Date(event.rawDate) : new Date();
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); 

      const formatDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
      };

      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);
      
      const title = encodeURIComponent(event.title);
      const details = encodeURIComponent(event.description || '');
      const location = encodeURIComponent(event.locationAddress || event.location || '');

      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;

      Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el calendario');
    }
  };

  const handleOpenMaps = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = event.latitude && event.longitude ? `${event.latitude},${event.longitude}` : null;
    const label = event.title;
    const url = Platform.select({
      ios: latLng ? `maps:0,0?q=${label}@${latLng}` : `maps:0,0?q=${encodeURIComponent(event.locationAddress || event.location)}`,
      android: latLng ? `geo:0,0?q=${latLng}(${encodeURIComponent(label)})` : `geo:0,0?q=${encodeURIComponent(event.locationAddress || event.location)}`
    });

    if (url) {
      Linking.openURL(url).catch(() => {
         const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.locationAddress || event.location)}`;
         Linking.openURL(webUrl);
      });
    }
  };

  // --- Render Sections ---

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const scrollY = contentOffset.y;
    
    // Check if close to bottom (within 20px)
    const isCloseToBottom = layoutMeasurement.height + scrollY >= contentSize.height - 20;

    if (isCloseToBottom) {
       // Determine the last available section
       let lastSection = 'info';
       if (!isVirtual && hasCoordinates && mapRegion) lastSection = 'map';
       if (publicPhotos.length > 0) lastSection = 'gallery';
       if (publicCatering.length > 0) lastSection = 'menu';
       
       if (activeSection !== lastSection) {
          setActiveSection(lastSection);
       }
       return;
    }

    const sheetStart = height * 0.45 - 30;
    const tabOffset = isOrganizer ? (sectionPositions.current['tabs'] || 0) : 0;
    
    const getTriggerPoint = (id) => {
       const y = sectionPositions.current[id];
       if (y === undefined) return null;
       
       let totalY = sheetStart + tabOffset + y;
       if (['gallery', 'menu'].includes(id)) {
          totalY += (sectionPositions.current['experience'] || 0);
       }
       
       // Activate when section is in view (approx top third)
       return totalY - (height / 2.5); 
    };

    const points = {
       menu: getTriggerPoint('menu'),
       gallery: getTriggerPoint('gallery'),
       map: getTriggerPoint('map'),
    };

    let newSection = 'info';
    
    if (points.menu !== null && scrollY >= points.menu) {
       newSection = 'menu';
    } else if (points.gallery !== null && scrollY >= points.gallery) {
       newSection = 'gallery';
    } else if (points.map !== null && scrollY >= points.map) {
       newSection = 'map';
    }

    if (newSection !== activeSection) {
       setActiveSection(newSection);
    }
  };

  const renderTabSelector = () => {
    if (!isOrganizer) return null;
    
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'overview' && styles.tabButtonActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Resumen</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'management' && styles.tabButtonActive]}
          onPress={() => setActiveTab('management')}
        >
          <Text style={[styles.tabText, activeTab === 'management' && styles.tabTextActive]}>Gestión</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleScrollToSection = (sectionId, align = 'top') => {
    console.log(sectionPositions.current);
    let y = sectionPositions.current[sectionId];
    if (y !== undefined && scrollViewRef.current) {
      // Add nested offset for experience section items
      if (['gallery', 'menu'].includes(sectionId)) {
         y += (sectionPositions.current['experience'] || 0);
      }

      const sheetStart = height * 0.45 - 30;
      let finalY = sheetStart + y;
      
      // Adjust for tabs if organizer
      if (isOrganizer) {
         finalY += (sectionPositions.current['tabs'] || 0);
      }

      if (align === 'center') {
        console.log(finalY, height);
        // finalY = finalY - (height / 2);
        finalY = finalY - (height / 2.5);
      }

      scrollViewRef.current.scrollTo({ y: finalY, animated: true });
    }
  };

  const renderOverview = () => (
    <View style={styles.sectionContent}>
      
      {/* 3. Quick Actions Strip */}
      <View style={styles.quickActionsContainer}>
        <QuickActionButton icon={Calendar} label="Agendar" onPress={handleAddToCalendar} />
        <QuickActionButton icon={Navigation} label="Cómo llegar" onPress={handleOpenMaps} />
        <QuickActionButton icon={Users} label="Asistentes" onPress={() => navigation.navigate('Organogram', { event })} />
        <QuickActionButton icon={MessageCircle} label="Contactar" onPress={() => {}} />
      </View>

      {/* Description */}
      <View 
        style={styles.contentBlock}
        onLayout={(event) => {
          sectionPositions.current['info'] = event.nativeEvent.layout.y;
        }}
      >
         <Text style={styles.sectionTitle}>Sobre el evento</Text>
         <Text style={styles.descriptionText}>{event.description}</Text>
      </View>

      {/* Map Preview */}
      {!isVirtual && hasCoordinates && mapRegion && (
        <View 
          style={styles.contentBlock}
          onLayout={(event) => {
             sectionPositions.current['map'] = event.nativeEvent.layout.y;
          }}
        >
           <Text style={styles.sectionTitle}>Ubicación</Text>
           <View style={styles.mapContainer}>
              <EventMap
                style={styles.map}
                initialRegion={mapRegion}
                region={mapRegion}
                markerCoordinate={mapRegion}
                interactive={false}
                googleMapsApiKey={GOOGLE_MAPS_API_KEY || undefined}
              />
              <TouchableOpacity style={styles.mapOverlayBtn} onPress={handleOpenMaps}>
                 <Navigation size={20} color="#FFF" />
                 <Text style={styles.mapOverlayText}>Cómo llegar</Text>
              </TouchableOpacity>
           </View>
        </View>
      )}
      
      {/* Experience Section (Gallery & Catering) */}
      {(publicPhotos.length > 0 || publicCatering.length > 0) && (
         <View 
            style={styles.sectionContainer}
            onLayout={(event) => {
               sectionPositions.current['experience'] = event.nativeEvent.layout.y;
            }}
         >
            <Text style={[styles.sectionTitle, { fontSize: 20, marginBottom: 15 }]}>Experiencia</Text>
            
            {publicPhotos.length > 0 && (
               <View 
                 style={{ marginBottom: 20 }}
                 onLayout={(event) => {
                    sectionPositions.current['gallery'] = event.nativeEvent.layout.y;
                 }}
               >
                  <View style={[styles.experienceHeader, { backgroundColor: '#E91E6315' }]}>
                     <View style={styles.experienceTitleContainer}>
                        <View style={[styles.experienceIconBadge, { backgroundColor: '#E91E6320' }]}>
                           <ImageIcon size={20} color="#E91E63" />
                        </View>
                        <Text style={[styles.experienceTitle, { color: '#E91E63' }]}>Galería</Text>
                     </View>
                     <TouchableOpacity 
                        style={styles.viewToggleBtn}
                        onPress={() => setGalleryViewMode(prev => prev === 'horizontal' ? 'grid' : 'horizontal')}
                     >
                        {galleryViewMode === 'horizontal' ? <LayoutGrid size={20} color="#E91E63" /> : <List size={20} color="#E91E63" />}
                     </TouchableOpacity>
                  </View>
                  
                  {galleryViewMode === 'horizontal' ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 4 }}>
                       {publicPhotos.slice(0, 5).map((photo, index) => (
                          <TouchableOpacity key={photo.id} onPress={() => openLightbox(index)} style={styles.galleryItem}>
                             <Image source={{ uri: photo.url }} style={styles.galleryImage} />
                          </TouchableOpacity>
                       ))}
                    </ScrollView>
                  ) : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
                       {publicPhotos.map((photo, index) => (
                          <TouchableOpacity 
                            key={photo.id} 
                            onPress={() => openLightbox(index)} 
                            style={[styles.galleryItem, { width: '30%', marginHorizontal: '1.5%', marginBottom: 10, marginRight: 0 }]}
                          >
                             <Image source={{ uri: photo.url }} style={[styles.galleryImage, { width: '100%', height: 100 }]} />
                          </TouchableOpacity>
                       ))}
                    </View>
                  )}
               </View>
            )}

            {publicCatering.length > 0 && (
               <View
                 onLayout={(event) => {
                    sectionPositions.current['menu'] = event.nativeEvent.layout.y;
                 }}
               >
                  <View style={[styles.experienceHeader, { backgroundColor: '#FF572215' }]}>
                     <View style={styles.experienceTitleContainer}>
                        <View style={[styles.experienceIconBadge, { backgroundColor: '#FF572220' }]}>
                           <UtensilsCrossed size={20} color="#FF5722" />
                        </View>
                        <Text style={[styles.experienceTitle, { color: '#FF5722' }]}>Menú</Text>
                     </View>
                     <TouchableOpacity 
                        style={styles.viewToggleBtn}
                        onPress={() => {
                           setMenuViewMode(prev => prev === 'horizontal' ? 'grid' : 'horizontal');
                           setSelectedMenuCategory(null);
                        }}
                     >
                        {menuViewMode === 'horizontal' ? <LayoutGrid size={20} color="#FF5722" /> : <List size={20} color="#FF5722" />}
                     </TouchableOpacity>
                  </View>
                  
                  {menuViewMode === 'horizontal' ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 4 }}>
                       {publicCatering.slice(0, 5).map((item) => (
                          <TouchableOpacity key={item.id} onPress={() => openCateringDetail(item)} style={styles.cateringItem}>
                             <Image source={{ uri: item.image }} style={styles.cateringImage} />
                             <View style={styles.cateringOverlay}>
                                <Text style={styles.cateringName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.cateringPrice}>${item.price}</Text>
                             </View>
                          </TouchableOpacity>
                       ))}
                    </ScrollView>
                  ) : (
                    <View style={{ marginHorizontal: -6 }}>
                       {!selectedMenuCategory ? (
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                             {[...new Set(publicCatering.map(item => item.category || 'Otros'))].map((category, index) => {
                                const config = MENU_CATEGORIES[category] || { icon: UtensilsCrossed, label: category };
                                const Icon = config.icon;
                                return (
                                   <TouchableOpacity 
                                     key={index} 
                                     onPress={() => setSelectedMenuCategory(category)}
                                     style={{ 
                                        width: '30%', 
                                        marginHorizontal: '1.5%', 
                                        marginBottom: 12, 
                                        alignItems: 'center',
                                        backgroundColor: COLORS.surface,
                                        padding: 12,
                                        borderRadius: 16,
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,0.03)',
                                     }}
                                   >
                                      <View style={{ 
                                         width: 44, 
                                         height: 44, 
                                         borderRadius: 14, 
                                         backgroundColor: '#FF572215', 
                                         justifyContent: 'center', 
                                         alignItems: 'center',
                                         marginBottom: 8
                                      }}>
                                         <Icon size={22} color="#FF5722" />
                                      </View>
                                      <Text style={{ ...FONTS.caption, color: COLORS.text, textAlign: 'center', fontWeight: '600', fontSize: 11 }} numberOfLines={1}>
                                         {config.label || category}
                                      </Text>
                                   </TouchableOpacity>
                                );
                             })}
                          </View>
                       ) : (
                          <View>
                             <TouchableOpacity 
                                onPress={() => setSelectedMenuCategory(null)} 
                                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 8 }}
                             >
                                <View style={{ padding: 6, backgroundColor: '#FF572210', borderRadius: 20, marginRight: 8 }}>
                                   <ArrowLeft size={16} color="#FF5722" />
                                </View>
                                <Text style={{ ...FONTS.body4, color: '#FF5722', fontWeight: '600' }}>
                                   {/* Volver a {MENU_CATEGORIES[selectedMenuCategory]?.label || selectedMenuCategory} */}
                                   Volver
                                </Text>
                             </TouchableOpacity>
                             
                             <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                {publicCatering
                                   .filter(item => (item.category || 'Otros') === selectedMenuCategory)
                                   .map((item) => (
                                      <TouchableOpacity 
                                        key={item.id} 
                                        onPress={() => openCateringDetail(item)} 
                                        style={{ 
                                           width: (width - 52) / 2,
                                           marginBottom: 16,
                                           borderRadius: 16,
                                           flexDirection: 'column',
                                           alignItems: 'flex-start'
                                        }}
                                      >
                                         <Image source={{ uri: item.image }} style={[styles.cateringImage, { width: '100%', height: 120, marginBottom: 8 }]} />
                                         <Text style={{ ...FONTS.body4, fontWeight: '700', color: COLORS.text }} numberOfLines={2}>{item.name}</Text>
                                         <Text style={styles.cateringPrice}>${item.price}</Text>
                                      </TouchableOpacity>
                                   ))}
                             </View>
                          </View>
                       )}
                    </View>
                  )}
               </View>
            )}
         </View>
      )}

    </View>
  );

  const renderManagement = () => (
    <View style={styles.sectionContent}>
       <View style={styles.toolsGrid}>
          {myTools.map((tool) => (
             <TouchableOpacity 
               key={tool.id} 
               style={styles.toolCard}
               onPress={() => {
                  if (['Expenses', 'Tasks', 'Gallery', 'Organogram', 'Catering'].includes(tool.id)) {
                    navigation.navigate(tool.id, { event });
                  } else {
                    Alert.alert('Próximamente', `La herramienta ${tool.name} estará disponible pronto.`);
                  }
               }}
               onLongPress={() => handleRemoveTool(tool.id)}
             >
                <View style={[styles.toolIconWrapper, { backgroundColor: tool.color + '15' }]}>
                   <tool.icon size={32} color={tool.color} />
                </View>
                <Text style={styles.toolName}>{tool.name}</Text>
                <TouchableOpacity style={styles.removeToolBtn} onPress={() => handleRemoveTool(tool.id)}>
                   <X size={12} color="#FFF" />
                </TouchableOpacity>
             </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
             style={[styles.toolCard, styles.addToolCard]}
             onPress={() => setIsToolPickerVisible(true)}
          >
             <View style={styles.addToolIconWrapper}>
                <Plus size={32} color={COLORS.primary} />
             </View>
             <Text style={[styles.toolName, { color: COLORS.primary }]}>Agregar</Text>
          </TouchableOpacity>
       </View>
       
       <View style={styles.infoBox}>
          <Info size={20} color={COLORS.textSecondary} style={{ marginBottom: 8 }} />
          <Text style={styles.infoBoxText}>
             Personaliza tu panel de gestión agregando o quitando herramientas según las necesidades de tu evento.
          </Text>
       </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          {event.image ? (
            <Image source={{ uri: event.image }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface }]}>
              <LinearGradient
                colors={COLORS.gradientPrimary}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <ImageIcon size={64} color={COLORS.surface} />
            </View>
          )}
          <LinearGradient
             colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
             style={styles.heroGradient}
          />
          
          {/* Header Actions */}
          <View style={[styles.headerActions, { top: insets.top + 10 }]}>
             <TouchableOpacity style={styles.glassBtn} onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color="#FFF" />
             </TouchableOpacity>
             <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.glassBtn, { marginRight: 10 }]}>
                   <Share2 size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.glassBtn}>
                   <Heart size={24} color="#FFF" />
                </TouchableOpacity>
             </View>
          </View>

        </View>

        {/* Main Content Sheet */}
        <View style={styles.sheetContainer}>
           {isOrganizer && (
              <View 
                style={styles.tabWrapper}
                onLayout={(event) => {
                   sectionPositions.current['tabs'] = event.nativeEvent.layout.height;
                }}
              >
                 {/* Header Info Card (Floating) */}
                 <View style={styles.infoCard}>
                   <View style={styles.categoryBadge}>
                     <Text style={styles.categoryText}>{event.category}</Text>
                   </View>
                   <Text style={styles.eventTitle}>{event.title}</Text>
                   
                   <View style={styles.infoRow}>
                     <Calendar size={18} color={COLORS.primary} />
                     <Text style={styles.infoText}> {event.date} {event.endDate ? `- ${event.endDate}` : ''}</Text>
                   </View>
                   
                   {!isVirtual && (
                     <View style={styles.infoRow}>
                       <MapPin size={18} color={COLORS.primary} />
                       <Text style={styles.infoText} numberOfLines={2}>{event.locationAddress || event.location}</Text>
                     </View>
                   )}

                   <View style={styles.organizerRow}>
                     <Image source={{ uri: event.organizer.avatar }} style={styles.organizerAvatar} />
                     <View>
                       <Text style={styles.organizerLabel}>Organizado por</Text>
                       <Text style={styles.organizerName}>{event.organizer.name}</Text>
                     </View>
                   </View>
                 </View>
                 {renderTabSelector()}
              </View>
           )}
           
           {isOrganizer && activeTab === 'management' ? renderManagement() : renderOverview()}
        </View>
      </ScrollView>

      {/* Floating Dock (Tools) - Redesigned */}
      {isOrganizer ? (
         <View style={[styles.floatingDock, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
            {isDockExpanded ? (
               <View style={[styles.dockContainer, { flexDirection: 'column', borderRadius: 24, padding: 16, width: '90%', alignItems: 'stretch' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.dockAddButton} onPress={() => setIsToolPickerVisible(true)}>
                           <Plus size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={[styles.dockDivider, { height: 24 }]} />
                        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>Mis Herramientas</Text>
                     </View>
                     <TouchableOpacity style={styles.dockExpandButton} onPress={() => setIsDockExpanded(false)}>
                        <ChevronDown size={20} color={COLORS.textSecondary} />
                     </TouchableOpacity>
                  </View>
                  
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                     {myTools.map((tool) => (
                        <TouchableOpacity 
                           key={tool.id} 
                           style={{ width: '25%', alignItems: 'center', marginBottom: 16 }}
                           onPress={() => {
                              if (['Expenses', 'Tasks', 'Gallery', 'Organogram', 'Catering'].includes(tool.id)) {
                                 navigation.navigate(tool.id, { event });
                              } else {
                                 Alert.alert('Próximamente', `La herramienta ${tool.name} estará disponible pronto.`);
                              }
                           }}
                           onLongPress={() => handleRemoveTool(tool.id)}
                        >
                           <View style={[styles.dockIcon, { backgroundColor: tool.color + '20', width: 44, height: 44, borderRadius: 22 }]}>
                              <tool.icon size={24} color={tool.color} />
                           </View>
                           <Text style={[styles.dockLabel, { marginTop: 4, textAlign: 'center' }]}>{tool.name}</Text>
                        </TouchableOpacity>
                     ))}
                  </View>
               </View>
            ) : (
               <View style={styles.dockContainer}>
                  <TouchableOpacity style={styles.dockAddButton} onPress={() => setIsToolPickerVisible(true)}>
                     <Plus size={24} color="#FFF" />
                  </TouchableOpacity>
                  <View style={styles.dockDivider} />
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dockScroll}>
                     {myTools.map((tool) => (
                        <TouchableOpacity 
                           key={tool.id} 
                           style={styles.dockItem}
                           onPress={() => {
                              if (['Expenses', 'Tasks', 'Gallery', 'Organogram', 'Catering'].includes(tool.id)) {
                                 navigation.navigate(tool.id, { event });
                              } else {
                                 Alert.alert('Próximamente', `La herramienta ${tool.name} estará disponible pronto.`);
                              }
                           }}
                           onLongPress={() => handleRemoveTool(tool.id)}
                        >
                           <View style={[styles.dockIcon, { backgroundColor: tool.color + '20' }]}>
                              <tool.icon size={20} color={tool.color} />
                           </View>
                           {/* Label hidden in collapsed mode as requested */}
                        </TouchableOpacity>
                     ))}
                  </ScrollView>
                  <TouchableOpacity style={styles.dockExpandButton} onPress={() => setIsDockExpanded(true)}>
                      <ChevronUp size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
               </View>
            )}
         </View>
      ) : (
         /* Buy Ticket Floating Bar */
         <View style={[styles.floatingDock, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
            <View style={styles.ticketBar}>
               <View>
                  <Text style={styles.ticketLabel}>Precio total</Text>
                  <Text style={styles.ticketPrice}>{event.price}</Text>
               </View>
               <TouchableOpacity style={styles.ticketButton}>
                  <Text style={styles.ticketButtonText}>Comprar Ticket</Text>
                  <ArrowLeft size={18} color="#FFF" style={{ transform: [{ rotate: '180deg' }], marginLeft: 8 }} />
               </TouchableOpacity>
            </View>
         </View>
      )}



      {/* Tool Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isToolPickerVisible}
        onRequestClose={() => setIsToolPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Galería de Herramientas</Text>
              <TouchableOpacity onPress={() => setIsToolPickerVisible(false)} style={styles.closeButton}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Selecciona las herramientas que necesitas para tu evento</Text>
            
            <ScrollView contentContainerStyle={styles.pickerGrid}>
              {ALL_TOOLS.filter(t => !myTools.find(mt => mt.id === t.id)).map((tool) => (
                <TouchableOpacity 
                  key={tool.id} 
                  style={styles.pickerItem}
                  onPress={() => handleAddTool(tool)}
                >
                  <View style={[styles.pickerIcon, { backgroundColor: tool.color + '15' }]}>
                    <tool.icon size={28} color={tool.color} />
                  </View>
                  <Text style={styles.pickerLabel}>{tool.name}</Text>
                  <View style={styles.addMiniBtn}>
                    <Plus size={16} color="#FFF" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Lightbox Modal */}
      <Lightbox
        visible={lightboxVisible}
        media={publicPhotos}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxVisible(false)}
      />

      {/* Catering Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cateringModalVisible}
        onRequestClose={() => setCateringModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles del Plato</Text>
              <TouchableOpacity onPress={() => setCateringModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            {selectedCateringItem && (
              <ScrollView style={{ marginBottom: 20 }}>
                <Image 
                  source={{ uri: selectedCateringItem.image }} 
                  style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 16, backgroundColor: '#f0f0f0' }} 
                />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <Text style={{ ...FONTS.h3, color: COLORS.text, flex: 1, marginRight: 10 }}>{selectedCateringItem.name}</Text>
                  <Text style={{ ...FONTS.h3, color: COLORS.primary, fontWeight: '700' }}>${selectedCateringItem.price.toLocaleString()}</Text>
                </View>

                <View style={{ alignSelf: 'flex-start', backgroundColor: COLORS.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 }}>
                  <Text style={{ ...FONTS.caption, color: COLORS.textSecondary }}>{selectedCateringItem.category}</Text>
                </View>
                
                <Text style={{ ...FONTS.body, color: COLORS.textSecondary, marginBottom: 24, lineHeight: 22 }}>{selectedCateringItem.description}</Text>
                
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <ChefHat size={20} color={COLORS.primary} />
                    <Text style={{ ...FONTS.h4, color: COLORS.text, marginLeft: 8 }}>Ingredientes</Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {selectedCateringItem.ingredients && selectedCateringItem.ingredients.length > 0 ? (
                      selectedCateringItem.ingredients.map((ing, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 8 }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginRight: 8 }} />
                          <Text style={{ ...FONTS.body4, color: COLORS.text }}>{ing}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={{ ...FONTS.body4, color: COLORS.textSecondary }}>No hay ingredientes listados.</Text>
                    )}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Index Menu */}
      {(!isOrganizer || activeTab === 'overview') && (() => {
         const menuItems = [
            { 
               id: 'info', 
               icon: FileText, 
               onPress: () => scrollViewRef.current?.scrollTo({ y: 0, animated: true }) 
            }
         ];

         if (!isVirtual && hasCoordinates && mapRegion) {
            menuItems.push({ 
               id: 'map', 
               icon: MapPin, 
               onPress: () => handleScrollToSection('map', 'center') 
            });
         }

         if (publicPhotos.length > 0) {
            menuItems.push({ 
               id: 'gallery', 
               icon: ImageIcon, 
               onPress: () => handleScrollToSection('gallery', 'center') 
            });
         }

         if (publicCatering.length > 0) {
            menuItems.push({ 
               id: 'menu', 
               icon: UtensilsCrossed, 
               onPress: () => handleScrollToSection('menu', 'center') 
            });
         }
         
         // Override last item to scroll to end if there is more than one item
         if (menuItems.length > 1) {
             menuItems[menuItems.length - 1].onPress = () => scrollViewRef.current?.scrollToEnd({ animated: true });
         }

         return (
            <View style={styles.indexMenuContainer}>
               {menuItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                     <TouchableOpacity 
                        key={item.id} 
                        onPress={item.onPress} 
                        style={[
                           styles.indexMenuItem,
                           isActive && { backgroundColor: COLORS.primary, transform: [{ scale: 1.1 }] }
                        ]}
                     >
                        <item.icon size={20} color={isActive ? '#FFF' : COLORS.primary} />
                     </TouchableOpacity>
                  );
               })}
            </View>
         );
      })()}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroContainer: {
    height: height * 0.45,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  glassBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  categoryBadge: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
    ...SHADOWS.medium,
  },
  categoryText: {
    ...FONTS.caption,
    color: '#FFF',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    lineHeight: 34,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  organizerMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingRight: 12,
    paddingLeft: 4,
    paddingVertical: 4,
    borderRadius: 15,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 0,
    minHeight: height * 0.6,
  },
  tabWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 4,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: COLORS.background,
    ...SHADOWS.small,
  },
  tabText: {
    ...FONTS.body4,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  sectionContent: {
    paddingBottom: 40,
  },
  statsScroll: {
    paddingBottom: 20,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...SHADOWS.small,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    ...FONTS.body4,
    fontWeight: '700',
    color: COLORS.text,
  },
  contentBlock: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 10,
  },
  descriptionText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  linkText: {
    color: COLORS.primary,
    ...FONTS.body4,
    fontWeight: '600',
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  organizerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  organizerName: {
    ...FONTS.h4,
    fontWeight: '700',
    color: COLORS.text,
  },
  organizerRole: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 20,
  },
  followBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  attendeeItem: {
    marginRight: 10,
  },
  attendeeAvatarMock: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.border,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  mapContainer: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapOverlayBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  mapOverlayText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 12,
  },
  galleryItem: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  galleryImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
  },
  cateringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cateringImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  cateringName: {
    ...FONTS.body4,
    fontWeight: '700',
    color: COLORS.text,
  },
  cateringCategory: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  cateringPrice: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontWeight: '700',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  toolCard: {
    width: '30%', // 3 columns
    marginHorizontal: '1.5%',
    marginBottom: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...SHADOWS.small,
    position: 'relative',
  },
  addToolCard: {
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
  },
  toolIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addToolIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  toolName: {
    ...FONTS.caption,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.text,
  },
  removeToolBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexMenuContainer: {
    position: 'absolute',
    right: 16,
    top: '40%',
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
    // ...SHADOWS.medium,
    zIndex: 100,
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'rgba(0,0,0,0.05)',
  },
  indexMenuItem: {
    padding: 10,
    marginVertical: 6,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  viewToggleBtn: {
     padding: 8,
    //  backgroundColor: COLORS.background,
     borderRadius: 12,
    //  ...SHADOWS.small,
  },
  infoBox: {
    marginHorizontal: 20,
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginTop: 20,
  },
  infoBoxText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SIZES.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.large,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  priceLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  priceValue: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
    ...SHADOWS.medium,
  },
  buyText: {
    color: COLORS.surface,
    ...FONTS.h3,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: SIZES.l,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  modalSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.l,
  },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 40,
  },
  pickerItem: {
    width: '30%',
    marginHorizontal: '1.5%',
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  pickerIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickerLabel: {
    ...FONTS.caption,
    textAlign: 'center',
    color: COLORS.text,
  },
  addMiniBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  closeButton: {
    padding: 4,
    backgroundColor: COLORS.background,
    borderRadius: 20,
  },
  // Added from v10
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    paddingTop: 40,
    marginTop: -60, // Floats over image
    ...SHADOWS.medium,
    marginBottom: 20,
  },
  eventTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 30,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 10, ...FONTS.body, color: COLORS.textSecondary, flex: 1 },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border || '#EEE', // Fallback
    paddingTop: 12,
  },
  organizerLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Poppins_500Medium',
  },
  // Quick Actions Styles
  quickActionsContainer: {
    flexDirection: 'row', justifyContent: 'space-around', marginVertical: 24, paddingHorizontal: 10
  },
  quickActionItem: { alignItems: 'center', flex: 1 },
  quickActionIcon: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionLabel: { color: COLORS.text, fontWeight: '600', fontFamily: 'Poppins_500Medium', fontSize: 12 },
  // Floating Dock Styles (v3)
  floatingDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 40,
    padding: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: '90%',
  },
  dockAddButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dockDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  dockScroll: {
    alignItems: 'center',
    paddingRight: 8,
  },
  dockItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  dockIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dockLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.text,
  },
  // Experience Section Styles (Gallery & Catering)
  sectionContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  subSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  galleryItem: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    width: 140,
    height: 100,
  },
  galleryImage: {
    backgroundColor: COLORS.border,
    width: '100%',
    height: '100%',
  },
  cateringItem: {
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    width: 200,
    height: 140,
  },
  cateringImage: {
    width: '100%',
    height: '100%',
  },
  cateringOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
  },
  cateringName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cateringPrice: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  dockExpandButton: {
    marginLeft: 4,
    padding: 4,
  },
  ticketBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    paddingHorizontal: 24,
    width: '90%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  ticketLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ticketPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ticketButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  ticketButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridToolItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 24,
  },
  gridToolIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridToolLabel: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  removeBadge: {
    position: 'absolute',
    top: -4,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 16,
    // ...SHADOWS.small,
  },
  experienceTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 10,
  },
});
