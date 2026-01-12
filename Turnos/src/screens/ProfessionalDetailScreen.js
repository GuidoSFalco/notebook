import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Star, MapPin, Clock, DollarSign, Award, ThumbsUp, Calendar } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ProfessionalService from '../services/professional.service';

const { width } = Dimensions.get('window');

export default function ProfessionalDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { professional: initialProfessional } = route.params;
  const [professional, setProfessional] = useState(initialProfessional);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const data = await ProfessionalService.getById(initialProfessional.id);
      // Merge initial data with detailed data if needed, or just set data
      // Assuming data is the full object
      setProfessional(data);
    } catch (e) {
      console.error('Error loading professional details', e);
    } finally {
      setLoading(false);
    }
  };

  const renderFeature = (icon, title, value) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        {icon}
      </View>
      <View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureValue}>{value}</Text>
      </View>
    </View>
  );

  if (!professional) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {/* Header Visual */}
        <View style={styles.headerImageContainer}>
            <Image source={{ uri: professional.image || 'https://via.placeholder.com/400' }} style={styles.headerImage} />
            <View style={styles.headerOverlay} />
            <View style={[styles.headerContent, { paddingTop: insets.top + SPACING.l }]}>
                <View style={styles.badge}>
                    <Award size={14} color="#FFF" />
                    <Text style={styles.badgeText}>Top Profesional</Text>
                </View>
                <Text style={styles.name}>{professional.name}</Text>
                <Text style={styles.specialty}>{professional.specialty}</Text>
                <View style={styles.locationContainer}>
                    <MapPin size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.location}>{professional.location}</Text>
                </View>
            </View>
        </View>

        {/* Quick Stats Card */}
        <View style={styles.statsCard}>
            <View style={styles.statItem}>
                <View style={styles.statValueContainer}>
                    <Star size={18} color={COLORS.warning} fill={COLORS.warning} />
                    <Text style={styles.statValue}>{professional.rating}</Text>
                </View>
                <Text style={styles.statLabel}>{professional.reviews} reseñas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <View style={styles.statValueContainer}>
                    <ThumbsUp size={18} color={COLORS.primary} />
                    <Text style={styles.statValue}>98%</Text>
                </View>
                <Text style={styles.statLabel}>Recomendado</Text>
            </View>
            <View style={styles.statDivider} />
             <View style={styles.statItem}>
                <View style={styles.statValueContainer}>
                    <DollarSign size={18} color={COLORS.success} />
                    <Text style={styles.statValue}>${professional.price}</Text>
                </View>
                <Text style={styles.statLabel}>Consulta</Text>
            </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre mí</Text>
            <Text style={styles.aboutText}>{professional.about || 'Sin descripción disponible.'}</Text>
        </View>

        {/* Availability Preview */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Próxima Disponibilidad</Text>
                <Calendar size={20} color={COLORS.primary} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
                {professional.availability && professional.availability.map((dateStr, index) => {
                    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return (
                        <View key={index} style={styles.dateCard}>
                            <Text style={styles.dateDay}>{day}</Text>
                            <Text style={styles.dateMonth}>
                                {format(date, 'MMM', { locale: es }).toUpperCase().replace('.', '')}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.m }]}>
        <Button 
            title="Reservar Turno" 
            onPress={() => navigation.navigate('Booking', { professional })}
            style={styles.bookButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  headerImageContainer: {
    height: 300,
    width: width,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))', // Note: linear-gradient not supported natively without library
  },
  headerContent: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.l,
    right: SPACING.l,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: SPACING.xs,
  },
  specialty: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: SPACING.s,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: 'rgba(255,255,255,0.9)',
    marginLeft: SPACING.xs,
    fontSize: 14,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.card,
    margin: SPACING.l,
    marginTop: -SPACING.xl,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    ...SHADOWS.medium,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.light.text,
    marginLeft: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.light.border,
  },
  section: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: SPACING.s,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.light.textSecondary,
  },
  datesScroll: {
    marginHorizontal: -SPACING.l,
    paddingHorizontal: SPACING.l,
  },
  dateCard: {
    backgroundColor: COLORS.light.card,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    marginRight: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    minWidth: 70,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
    fontWeight: '600',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  featureTitle: {
    fontSize: 14,
    color: COLORS.light.textSecondary,
    marginBottom: 2,
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.light.background,
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  bookButton: {
    width: '100%',
  }
});
