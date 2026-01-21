import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { X, Calendar, MapPin, ArrowLeft, Share2, Heart, Edit, User, Maximize2 } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Configuración de Alturas
const MAX_HEIGHT = height * 0.85; // Expandido (90% pantalla)
const MIN_HEIGHT = height / 3;   // Colapsado (1/3 pantalla)
const SNAP_BOTTOM = height; 

// Posiciones de Desplazamiento (TranslateY)
const SNAP_TOP = 0;
const SNAP_MIDDLE = MAX_HEIGHT - MIN_HEIGHT;

const DRAG_THRESHOLD = 50;

export default function EventBottomSheet({ event, onClose, visible }) {
  const navigation = useNavigation();
  const panY = useRef(new Animated.Value(SNAP_BOTTOM)).current;
  const lastOffset = useRef(SNAP_BOTTOM);

  const animateTo = (toValue) => {
    Animated.spring(panY, {
      toValue,
      useNativeDriver: false, // Changed to false to fix synchronization bugs with PanResponder
      bounciness: 4,
      speed: 12,
    }).start(({ finished }) => {
      lastOffset.current = toValue;
      if (toValue === SNAP_BOTTOM && visible) {
        onClose();
      }
    });
  };

  useEffect(() => {
    if (visible && event) {
      if (lastOffset.current === SNAP_BOTTOM) {
        panY.setValue(SNAP_BOTTOM);
      }
      animateTo(SNAP_MIDDLE);
    } else {
      animateTo(SNAP_BOTTOM);
    }
  }, [visible, event]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        panY.stopAnimation((value) => {
          panY.setOffset(0);
          panY.setValue(value);
          lastOffset.current = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        if (lastOffset.current + gestureState.dy < -50) return;
        panY.setValue(lastOffset.current + gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentY = lastOffset.current + gestureState.dy;
        
        let target = SNAP_MIDDLE;

        if (gestureState.vy < -0.5) {
            target = SNAP_TOP; 
        } else if (gestureState.vy > 0.5) {
            if (currentY > SNAP_MIDDLE + 50) target = SNAP_BOTTOM; 
            else target = SNAP_MIDDLE; 
        } else {
            if (currentY < SNAP_MIDDLE / 2) {
                target = SNAP_TOP; 
            } else if (currentY > SNAP_MIDDLE + (height - SNAP_MIDDLE) / 3) {
                target = SNAP_BOTTOM; 
            } else {
                target = SNAP_MIDDLE; 
            }
        }
        
        animateTo(target);
      },
    })
  ).current;

  if (!event) return null;

  const isVirtual = event.type === 'virtual' || event.isVirtual;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: panY }] }
      ]}
    >
      <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
        <View style={styles.dragHandle} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Image Section (Replicating EventDetailScreen) */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          {/* Header Actions */}
          <View style={[styles.headerActions, { top: 10 }]}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => {
                  animateTo(SNAP_BOTTOM);
                  // onClose is called in animation callback
              }}
            >
              <ArrowLeft size={24} color={COLORS.surface} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                style={[styles.iconButton, { marginRight: 10 }]}
                onPress={() => navigation.navigate('EventDetail', { event })}
              >
                <Maximize2 size={24} color={COLORS.surface} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { marginRight: 10 }]}>
                <Share2 size={24} color={COLORS.surface} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { marginRight: 10 }]}>
                <Heart size={24} color={COLORS.surface} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Title on Image */}
          <View style={styles.titleContainer}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.bodyContent}>
            {/* Organizer */}
            <View style={styles.organizerRow}>
                <Image source={{ uri: event.organizer.avatar }} style={styles.organizerAvatar} />
                <View style={styles.organizerInfo}>
                    <Text style={styles.organizerLabel}>Organizado por</Text>
                    <Text style={styles.organizerName}>{event.organizer.name}</Text>
                </View>
                <View style={styles.organizerActions}>
                    <TouchableOpacity style={styles.followButton}>
                        <Text style={styles.followText}>Seguir</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Title */}
            <View style={{ marginBottom: SIZES.s }}>
                <Text style={[styles.title, { color: COLORS.text, marginBottom: 0 }]}>{event.title}</Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>{event.description}</Text>

            {/* Date and Time */}
            <Text style={styles.sectionSubtitle}>Fecha, Hora y Ubicación</Text>
            <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.locationCard}>
                    <View style={styles.locationIconContainer}>
                        <Calendar size={24} color={COLORS.secondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.locationName}>
                            {event.endDate ? `${event.date} - ${event.endDate}` : event.date}
                        </Text>
                        {event.time && <Text style={styles.locationAddress}>{event.time}</Text>}
                        <Text style={[styles.locationAddress, { color: COLORS.primary, marginTop: 4, fontWeight: '600' }]}>Agregar al calendario</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {isVirtual ? (
                <>
                    <Text style={styles.sectionTitle}>Evento virtual</Text>
                    {event.virtualLink ? (
                        <Text style={styles.virtualLink}>{event.virtualLink}</Text>
                    ) : (
                        <Text style={styles.virtualHelperText}>
                            Este evento se realiza de forma virtual.
                        </Text>
                    )}
                </>
            ) : (
                <TouchableOpacity activeOpacity={0.7}>
                    <View style={styles.locationCard}>
                        <View style={styles.locationIconContainer}>
                            <MapPin size={24} color={COLORS.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.locationName}>{event.locationAddress || event.location}</Text>
                            {event.locationAddress && event.locationAddress !== event.location ? (
                                <Text style={styles.locationAddress}>{event.locationAddress}</Text>
                            ) : null}
                            <Text style={[styles.locationAddress, { color: COLORS.primary, marginTop: 4, fontWeight: '600' }]}>Abrir en maps</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}

            {/* Attendees */}
            <View style={styles.attendeesSection}>
                <Text style={styles.sectionTitle}>Asistentes ({event.attendees})</Text>
                <View style={styles.avatarRow}>
                    {[1,2,3,4,5].map((_, i) => (
                        <View key={i} style={[styles.attendeeAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: 5-i }]} />
                    ))}
                </View>
            </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Precio total</Text>
          <Text style={styles.priceValue}>{event.price}</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyText}>Comprar Ticket</Text>
        </TouchableOpacity>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MAX_HEIGHT, 
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...SHADOWS.large,
    zIndex: 1000,
    overflow: 'hidden', // Ensure content doesn't spill out when rounded
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SIZES.s,
    backgroundColor: 'transparent',
    zIndex: 20,
    position: 'absolute',
    top: 0,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.5)', // Visible on dark image
    borderRadius: 2,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  imageContainer: {
    height: 300, // Slightly smaller than detail screen for bottom sheet context
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', // Darker background for visibility
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  categoryTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    color: COLORS.surface,
    ...FONTS.captionWhite,
    fontWeight: '700',
  },
  title: {
    ...FONTS.h2,
    color: COLORS.surface,
    marginBottom: 10,
  },
  bodyContent: {
    padding: SIZES.l,
    marginTop: -20, // Overlap image slightly if desired, or keep flat
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
    marginTop: SIZES.s,
  },
  organizerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerLabel: {
    ...FONTS.caption,
  },
  organizerName: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followText: {
    color: COLORS.primary,
    ...FONTS.caption,
    fontWeight: '600',
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.m,
  },
  sectionSubtitle: {
    ...FONTS.h3,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SIZES.s,
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xl,
  },
  virtualLink: {
    ...FONTS.body,
    color: COLORS.primary,
    marginBottom: SIZES.xl,
  },
  virtualHelperText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xl,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  locationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationName: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  locationAddress: {
    ...FONTS.caption,
  },
  attendeesSection: {
    marginBottom: SIZES.xl,
  },
  avatarRow: {
    flexDirection: 'row',
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    borderWidth: 2,
    borderColor: COLORS.background,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceLabel: {
    ...FONTS.caption,
  },
  priceValue: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    ...SHADOWS.medium,
  },
  buyText: {
    color: COLORS.surface,
    ...FONTS.h3,
    fontSize: 16,
  },
});
