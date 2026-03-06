import React, { useState, useEffect, useCallback, useRef,useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Platform,
  Share,
  PanResponder,
  Animated as RNAnimated
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Trash2, X, Check, MoreVertical, Image as ImageIcon, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Grid, List as ListIcon, Share2, Info, Globe, Lock, Eye } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { TaskService, MOCK_USERS, CURRENT_USER_ID } from '../services/mockApi';

const { width, height } = Dimensions.get('window');

// --- Components ---

const AlbumTab = ({ album, isActive, onPress }) => (
  <TouchableOpacity
    style={[
      styles.albumTab,
      isActive && styles.albumTabActive
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.albumTabText,
      isActive && styles.albumTabTextActive
    ]}>
      {album.name}
    </Text>
    {album.count > 0 && (
      <View style={[
        styles.albumBadge,
        isActive && styles.albumBadgeActive
      ]}>
        <Text style={[
          styles.albumBadgeText,
          isActive && styles.albumBadgeTextActive
        ]}>
          {album.count}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const PhotoItem = ({ item, isSelected, isSelectionMode, layout, onPress, onLongPress }) => {
  const isList = layout === 'list';
  const itemWidth = isList ? width - SIZES.l * 2 : width / 3;
  const itemHeight = isList ? 200 : width / 3;

  return (
    <TouchableOpacity
      style={[
        styles.photoContainer, 
        { width: itemWidth, height: isList ? 'auto' : itemHeight, marginBottom: isList ? 16 : 0 }
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.url }}
        style={[
          styles.photo,
          { height: itemHeight, borderRadius: isList ? 12 : 0 },
          isSelected && styles.photoSelected
        ]}
        resizeMode="cover"
      />
      
      {isList && (
        <View style={styles.listMeta}>
          <Text style={styles.listDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             {item.visibility === 'public' ? <Globe size={12} color="#FFF" style={{ marginRight: 4 }} /> : <Lock size={12} color="#FFF" style={{ marginRight: 4 }} />}
             <Text style={styles.listUser}>Por: User {item.uploadedBy}</Text>
          </View>
        </View>
      )}

      {!isList && (
         <View style={styles.gridMeta}>
            {item.visibility === 'public' ? <Globe size={12} color="#FFF" /> : <Lock size={12} color="#FFF" />}
         </View>
      )}

      {isSelectionMode && (
        <View style={[styles.selectionOverlay, isSelected && styles.selectionOverlayActive]}>
          {isSelected ? (
            <View style={styles.checkCircle}>
              <Check size={16} color="#FFF" />
            </View>
          ) : (
            <View style={styles.radioCircle} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

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
        // Simplify: just reset or keep? 
        // Real implementation requires maintaining state. 
        // For now, let's just stick to ScrollView for iOS and simple Image for Android if complex logic fails.
        // Actually, let's use a simpler approach: Double Tap for Android.
      }
    })
  ).current;

  // If iOS, use ScrollView
  if (Platform.OS === 'ios') {
    return (
      <ScrollView
        maximumZoomScale={3}
        minimumZoomScale={1}
        centerContent
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width, height, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image
          source={source}
          style={{ width, height: height * 0.8 }}
          resizeMode="contain"
        />
      </ScrollView>
    );
  }

  // Android: Double Tap to Zoom (Simulated)
  const lastTap = useRef(null);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && (now - lastTap.current) < 300) {
      // Double tap
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

const Lightbox = ({ visible, media, initialIndex, onClose, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(true);
  const flatListRef = useRef(null);

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
        url: item.url, // iOS only
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCurrent = () => {
    const item = media[currentIndex];
    Alert.alert(
      "Eliminar foto",
      "¿Estás seguro de eliminar esta foto?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => onDelete(item.id)
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
       <ZoomView source={{ uri: item.url }} width={width} height={height} />
       
       {/* Overlay Metadata */}
       {showInfo && (
         <View style={styles.lightboxMeta}>
           <Text style={styles.lightboxDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
           <Text style={styles.lightboxUser}>Subido por: User {item.uploadedBy}</Text>
         </View>
       )}
    </View>
  );

  if (!visible) return null;

  const currentItem = media[currentIndex];
  const isOwner = currentItem?.uploadedBy === CURRENT_USER_ID;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.lightboxContainer}>
        {/* Top Bar */}
        <SafeAreaView edges={['top']} style={styles.lightboxHeader}>
          <TouchableOpacity style={styles.lightboxButton} onPress={onClose}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.lightboxActions}>
            <TouchableOpacity style={styles.lightboxButton} onPress={() => setShowInfo(!showInfo)}>
              <Info size={24} color={showInfo ? COLORS.primary : "#FFF"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.lightboxButton} onPress={handleShare}>
              <Share2 size={24} color="#FFF" />
            </TouchableOpacity>
            {isOwner && (
              <TouchableOpacity style={styles.lightboxButton} onPress={handleDeleteCurrent}>
                <Trash2 size={24} color={COLORS.error} />
              </TouchableOpacity>
            )}
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
        
        <View style={styles.lightboxControls}>
            <Text style={styles.lightboxCounter}>{currentIndex + 1} / {media.length}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default function GalleryScreen({ navigation, route }) {
  const { event } = route.params;
  const insets = useSafeAreaInsets();
  
  // States
  const [albums, setAlbums] = useState([]);
  const [currentAlbumId, setCurrentAlbumId] = useState('all');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'
  const [currentUserRole, setCurrentUserRole] = useState('VIEWER');
  const [filterVisibility, setFilterVisibility] = useState('all'); // 'all' | 'public' | 'private'
  
  // Lightbox State
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedAlbums, fetchedMedia, permissions] = await Promise.all([
        TaskService.getAlbumsByEventId(event.id),
        TaskService.getMediaByAlbumId(currentAlbumId, event.id),
        TaskService.getPermissionsByEventAndTool(event.id, 'Gallery')
      ]);
      setAlbums(fetchedAlbums);
      setMedia(fetchedMedia);
      setCurrentUserRole(permissions.role);
      
      // Force public filter for viewers
      if (permissions.role === 'VIEWER') {
        setFilterVisibility('public');
      }
    } catch (error) {
      console.error("Error loading gallery:", error);
      Alert.alert("Error", "No se pudo cargar la galería.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentAlbumId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Handlers
  const handleAlbumChange = (albumId) => {
    setCurrentAlbumId(albumId);
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleLongPress = (item) => {
    setSelectionMode(true);
    toggleSelection(item.id);
  };

  const handlePress = (item, index) => {
    if (selectionMode) {
      toggleSelection(item.id);
    } else {
      setLightboxIndex(index);
      setLightboxVisible(true);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      const newIds = prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id];
      
      if (newIds.length === 0) setSelectionMode(false);
      return newIds;
    });
  };

  // Filter Logic
  const filteredMedia = useMemo(() => {
    let result = media;
    if (filterVisibility !== 'all') {
      result = result.filter(m => m.visibility === filterVisibility);
    }
    return result;
  }, [media, filterVisibility]);

  const handleUpload = async () => {
    try {
      if (currentUserRole === 'VIEWER') return;

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permiso denegado", "Se necesita acceso a la galería para subir fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8, // Basic compression
      });

      if (!result.canceled) {
        // Ask for visibility
        Alert.alert(
          "Visibilidad de la foto",
          "¿Quién puede ver esta foto?",
          [
            { text: "Cancelar", style: "cancel" },
            { 
              text: "Solo Participantes (Privado)", 
              onPress: () => uploadImage(result.assets[0].uri, 'private')
            },
            { 
              text: "Todos (Público)", 
              onPress: () => uploadImage(result.assets[0].uri, 'public')
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Falló la selección de imagen");
    }
  };

  const uploadImage = async (uri, visibility) => {
    try {
      setLoading(true);
      const newItem = {
        url: uri,
        type: 'image',
        albumId: currentAlbumId === 'all' ? 'album-1' : currentAlbumId, 
        uploadedBy: CURRENT_USER_ID,
        visibility: visibility
      };
      
      await TaskService.uploadMedia(newItem);
      await loadData(); // Refresh
      Alert.alert("Éxito", "Foto subida correctamente");
    } catch (error) {
      Alert.alert("Error", "Falló la subida de imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Eliminar fotos",
      `¿Estás seguro de eliminar ${selectedIds.length} fotos?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await TaskService.deleteMedia(selectedIds);
            setSelectionMode(false);
            setSelectedIds([]);
            loadData();
          }
        }
      ]
    );
  };

  // Render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>
            {selectionMode ? `${selectedIds.length} seleccionados` : 'Galería'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {selectionMode ? 'Modo selección' : 'Fotos y Recuerdos'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {!selectionMode && (
            <TouchableOpacity onPress={() => setLayout(prev => prev === 'grid' ? 'list' : 'grid')} style={styles.actionButton}>
              {layout === 'grid' ? <ListIcon size={24} color={COLORS.text} /> : <Grid size={24} color={COLORS.text} />}
            </TouchableOpacity>
          )}
          
          {selectionMode && (
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Trash2 size={24} color={COLORS.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Albums Tabs */}
      {!selectionMode && (
        <View style={styles.tabsWrapper}>
          <FlatList
            data={albums}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.tabsContainer}
            renderItem={({ item }) => (
              <AlbumTab 
                album={item} 
                isActive={currentAlbumId === item.id} 
                onPress={() => handleAlbumChange(item.id)}
              />
            )}
          />
        </View>
      )}

      {/* Filter Toggle for Participants */}
      {currentUserRole !== 'VIEWER' && !selectionMode && (
        <View style={styles.filterContainer}>
           <TouchableOpacity 
             style={[styles.filterChip, filterVisibility === 'all' && styles.filterChipActive]}
             onPress={() => setFilterVisibility('all')}
           >
             <Text style={[styles.filterText, filterVisibility === 'all' && styles.filterTextActive]}>Todas</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.filterChip, filterVisibility === 'public' && styles.filterChipActive]}
             onPress={() => setFilterVisibility('public')}
           >
             <Globe size={14} color={filterVisibility === 'public' ? '#FFF' : COLORS.textSecondary} style={{ marginRight: 4 }} />
             <Text style={[styles.filterText, filterVisibility === 'public' && styles.filterTextActive]}>Públicas</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.filterChip, filterVisibility === 'private' && styles.filterChipActive]}
             onPress={() => setFilterVisibility('private')}
           >
             <Lock size={14} color={filterVisibility === 'private' ? '#FFF' : COLORS.textSecondary} style={{ marginRight: 4 }} />
             <Text style={[styles.filterText, filterVisibility === 'private' && styles.filterTextActive]}>Privadas</Text>
           </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={filteredMedia}
            key={layout} // Force re-render when layout changes
            keyExtractor={item => item.id}
            numColumns={layout === 'grid' ? 3 : 1}
            renderItem={({ item, index }) => (
              <PhotoItem
                item={item}
                layout={layout}
                isSelectionMode={selectionMode}
                isSelected={selectedIds.includes(item.id)}
                onPress={() => handlePress(item, index)}
                onLongPress={() => handleLongPress(item)}
              />
            )}
            contentContainerStyle={[
              styles.gridContainer,
              layout === 'list' && styles.listContainer
            ]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ImageIcon size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>No hay fotos en este álbum</Text>
              </View>
            }
          />
        )}
      </View>

      {/* FAB for Upload */}
      {!selectionMode && !loading && currentUserRole !== 'VIEWER' && (
        <TouchableOpacity style={styles.fab} onPress={handleUpload}>
          <Plus size={32} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* Lightbox */}
      <Lightbox 
        visible={lightboxVisible} 
        media={media} 
        initialIndex={lightboxIndex} 
        onClose={() => setLightboxVisible(false)}
        onDelete={async (id) => {
          setLightboxVisible(false);
          setLoading(true);
          await TaskService.deleteMedia([id]);
          await loadData();
        }}
      />
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
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    fontSize: 24,
  },
  headerSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  tabsWrapper: {
    paddingBottom: SIZES.s,
  },
  tabsContainer: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    gap: SIZES.s,
  },
  albumTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  albumTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  albumTabText: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  albumTabTextActive: {
    color: '#FFF',
  },
  albumBadge: {
    marginLeft: 6,
    backgroundColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  albumBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  albumBadgeText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  albumBadgeTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    padding: 2,
  },
  listContainer: {
    padding: SIZES.m,
  },
  photoContainer: {
    padding: 1,
    overflow: 'hidden',
  },
  listMeta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  listDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listUser: {
    color: '#DDD',
    fontSize: 12,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  photoSelected: {
    opacity: 0.7,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridMeta: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.m,
    paddingBottom: SIZES.s,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFF',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SIZES.m,
  },
  // Lightbox Styles
  lightboxContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  lightboxHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.3)', 
  },
  lightboxActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lightboxButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  lightboxMeta: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  lightboxDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lightboxUser: {
    color: '#CCC',
    fontSize: 12,
  },
  lightboxControls: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  lightboxCounter: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
