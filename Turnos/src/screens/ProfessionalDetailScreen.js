import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Star, MapPin, Clock, DollarSign, Award, ThumbsUp, Calendar } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function ProfessionalDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { professional } = route.params;

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {/* Header Visual */}
        <View style={styles.headerImageContainer}>
            <Image source={{ uri: professional.image }} style={styles.headerImage} />
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
            <Text style={styles.aboutText}>{professional.about}</Text>
        </View>

        {/* Availability Preview */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Próxima Disponibilidad</Text>
                <Calendar size={20} color={COLORS.primary} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
                {professional.availability.map((date, index) => (
                    <View key={index} style={styles.dateCard}>
                        <Text style={styles.dateDay}>{date.split('-')[2]}</Text>
                        <Text style={styles.dateMonth}>DIC</Text>
                    </View>
                ))}
            </ScrollView>
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
             <Text style={styles.sectionTitle}>Información</Text>
             <View style={styles.featuresGrid}>
                {renderFeature(<Clock size={20} color={COLORS.primary} />, 'Duración', '30 min')}
                {renderFeature(<MapPin size={20} color={COLORS.primary} />, 'Modalidad', 'Presencial')}
             </View>
        </View>

      </ScrollView>

      {/* Sticky Footer Action */}
      <View style={[styles.footer, { paddingBottom: Math.max(SPACING.l, insets.bottom) }]}>
        <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio total</Text>
            <Text style={styles.priceValue}>${professional.price}</Text>
        </View>
        <View style={{ flex: 1 }}>
             <Button 
                title="Reservar Turno" 
                onPress={() => navigation.navigate('Booking', { professional })}
            />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  headerImageContainer: {
    height: 340,
    width: '100%',
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
    backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)', // Web polyfill if needed, mostly for visual idea
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.l,
    paddingBottom: SPACING.xl + 20, // Space for the floating card overlap
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: RADIUS.s,
    alignSelf: 'flex-start',
    marginBottom: SPACING.s,
    gap: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: SPACING.s,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.card,
    marginHorizontal: SPACING.l,
    marginTop: -30,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    ...SHADOWS.medium,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.light.text,
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
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.l,
  },
  cardSection: {
    marginTop: SPACING.m,
    marginHorizontal: SPACING.l,
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    ...SHADOWS.light,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.s,
  },
  contactItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
    fontWeight: '500',
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: SPACING.s,
  },
  aboutText: {
    fontSize: 16,
    color: COLORS.light.textSecondary,
    lineHeight: 24,
  },
  featuresGrid: {
      flexDirection: 'row',
      gap: SPACING.l,
  },
  featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.m,
      flex: 1,
      backgroundColor: '#F8F9FA',
      padding: SPACING.m,
      borderRadius: RADIUS.m,
  },
  featureIconContainer: {
      width: 40,
      height: 40,
      borderRadius: RADIUS.s,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      ...SHADOWS.light,
  },
  featureTitle: {
      fontSize: 12,
      color: COLORS.light.textSecondary,
      marginBottom: 2,
  },
  featureValue: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.light.text,
  },
  datesScroll: {
      flexDirection: 'row',
  },
  dateCard: {
      width: 60,
      height: 70,
      backgroundColor: COLORS.light.card,
      borderRadius: RADIUS.m,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.m,
      borderWidth: 1,
      borderColor: COLORS.light.border,
  },
  dateDay: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.light.text,
  },
  dateMonth: {
      fontSize: 12,
      color: COLORS.light.textSecondary,
      textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.light.card,
    padding: SPACING.l,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.l,
    ...SHADOWS.medium,
  },
  priceContainer: {
      minWidth: 100,
  },
  priceLabel: {
      fontSize: 12,
      color: COLORS.light.textSecondary,
      marginBottom: 2,
  },
  priceValue: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.light.text,
  },
});
