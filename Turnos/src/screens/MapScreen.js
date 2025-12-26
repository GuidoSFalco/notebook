import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Animated, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from '../components/MapProxy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Star, MapPin, Calendar } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { PROFESSIONALS } from '../constants/mockData';
import Button from '../components/Button';

const { width, height } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = 320;

export default function MapScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const bottomSheetAnim = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const mapRef = useRef(null);

  // Animation handling
  useEffect(() => {
    if (selectedProfessional) {
      Animated.spring(bottomSheetAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();

      // Center map on marker with offset for bottom sheet
      mapRef.current?.animateCamera({
        center: {
          latitude: selectedProfessional.coordinate.latitude - 0.005, // Offset to show pin above sheet
          longitude: selectedProfessional.coordinate.longitude,
        },
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 14,
      });
    } else {
      Animated.timing(bottomSheetAnim, {
        toValue: BOTTOM_SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedProfessional]);

  const closeSheet = () => setSelectedProfessional(null);

  const renderBottomSheet = () => {
    if (!selectedProfessional) return null;
    
    return (
      <Animated.View 
        style={[
          styles.bottomSheet, 
          { 
            transform: [{ translateY: bottomSheetAnim }],
            paddingBottom: insets.bottom + SPACING.m 
          }
        ]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={closeSheet}>
            <X size={20} color={COLORS.light.textSecondary} />
        </TouchableOpacity>

        <View style={styles.sheetHeader}>
            <Image source={{ uri: selectedProfessional.image }} style={styles.sheetImage} />
            <View style={styles.sheetInfo}>
                <Text style={styles.sheetName}>{selectedProfessional.name}</Text>
                <Text style={styles.sheetSpecialty}>{selectedProfessional.specialty}</Text>
                <View style={styles.ratingRow}>
                    <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
                    <Text style={styles.ratingText}>{selectedProfessional.rating} ({selectedProfessional.reviews})</Text>
                </View>
            </View>
        </View>

        <View style={styles.sheetBody}>
            <View style={styles.locationRow}>
                <MapPin size={16} color={COLORS.light.textSecondary} />
                <Text style={styles.locationText} numberOfLines={1}>{selectedProfessional.location}</Text>
            </View>
            <Text style={styles.sheetAbout} numberOfLines={2}>{selectedProfessional.about}</Text>
            
            <View style={styles.availabilityPreview}>
                <Text style={styles.availabilityTitle}>Próximo turno:</Text>
                <View style={styles.availabilityBadge}>
                    <Calendar size={12} color={COLORS.success} />
                    <Text style={styles.availabilityText}>{selectedProfessional.availability[0]}</Text>
                </View>
            </View>
        </View>

        <View style={styles.sheetFooter}>
            <Button 
                title="Reservar Turno" 
                onPress={() => {
                    navigation.navigate('ProfessionalDetail', { professional: selectedProfessional });
                }}
            />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: -34.5889,
          longitude: -58.4305,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={() => {
            if (selectedProfessional) closeSheet();
        }}
      >
        {PROFESSIONALS.map((professional) => (
          <Marker
            key={professional.id}
            coordinate={{
                latitude: Number(professional.coordinate.latitude),
                longitude: Number(professional.coordinate.longitude),
            }}
            onPress={() => {
                setSelectedProfessional(professional);
            }}
          >
             <View style={[styles.markerContainer, selectedProfessional?.id === professional.id && styles.markerSelected]}>
                <Image source={{ uri: professional.image }} style={styles.markerImage} />
             </View>
          </Marker>
        ))}
      </MapView>

      {/* Fallback for Web if MapView doesn't load properly (handled by react-native-web-maps usually, but just in case) */}
      {Platform.OS === 'web' && (
          <View style={[styles.webWarning, { top: insets.top + 20 }]}>
              <Text style={styles.webWarningText}>Mapa interactivo optimizado para App Mobile</Text>
          </View>
      )}

      {renderBottomSheet()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    padding: 3,
    backgroundColor: 'white',
    borderRadius: 20,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  markerSelected: {
      borderColor: COLORS.primary,
      transform: [{ scale: 1.2 }],
      backgroundColor: COLORS.primary,
  },
  markerImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: COLORS.light.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.m,
    ...SHADOWS.medium,
    elevation: 20,
  },
  closeButton: {
      position: 'absolute',
      right: SPACING.m,
      top: SPACING.m,
      zIndex: 10,
      padding: SPACING.xs,
  },
  sheetHeader: {
      flexDirection: 'row',
      marginBottom: SPACING.m,
      marginTop: SPACING.s,
  },
  sheetImage: {
      width: 60,
      height: 60,
      borderRadius: RADIUS.m,
      marginRight: SPACING.m,
  },
  sheetInfo: {
      flex: 1,
      justifyContent: 'center',
  },
  sheetName: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.light.text,
      marginBottom: 2,
  },
  sheetSpecialty: {
      fontSize: 14,
      color: COLORS.primary,
      fontWeight: '600',
      marginBottom: 4,
  },
  ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
  },
  ratingText: {
      fontSize: 13,
      color: COLORS.light.textSecondary,
  },
  sheetBody: {
      flex: 1,
  },
  locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: SPACING.s,
  },
  locationText: {
      fontSize: 14,
      color: COLORS.light.textSecondary,
      flex: 1,
  },
  sheetAbout: {
      fontSize: 14,
      color: COLORS.light.text,
      lineHeight: 20,
      marginBottom: SPACING.m,
  },
  availabilityPreview: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.s,
      marginBottom: SPACING.m,
  },
  availabilityTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.light.text,
  },
  availabilityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#E8F5E9',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: RADIUS.s,
  },
  availabilityText: {
      fontSize: 13,
      color: COLORS.success,
      fontWeight: '600',
  },
  sheetFooter: {
      marginTop: 'auto',
  },
  webWarning: {
      position: 'absolute',
      left: 20,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
  },
  webWarningText: {
      color: 'white',
      fontSize: 12,
  }
});
