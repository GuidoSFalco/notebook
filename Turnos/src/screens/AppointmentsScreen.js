import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { MY_APPOINTMENTS, PROFESSIONALS } from '../constants/mockData';

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();

  const getProfessional = (id) => PROFESSIONALS.find(p => p.id === id);

  const renderAppointment = ({ item }) => {
    const professional = getProfessional(item.professionalId);
    if (!professional) return null;

    const isCompleted = item.status === 'completed';

    return (
      <View style={[styles.card, isCompleted && styles.cardCompleted]}>
        <View style={styles.header}>
            <Text style={styles.service}>{item.service}</Text>
            <View style={[styles.badge, isCompleted ? styles.badgeCompleted : styles.badgeConfirmed]}>
                <Text style={[styles.badgeText, isCompleted ? styles.badgeTextCompleted : styles.badgeTextConfirmed]}>
                    {item.status === 'confirmed' ? 'Confirmado' : 'Finalizado'}
                </Text>
            </View>
        </View>

        <Text style={styles.professionalName}>{professional.name}</Text>
        
        <View style={styles.dateTimeContainer}>
            <View style={styles.infoRow}>
                <Calendar size={16} color={COLORS.light.textSecondary} />
                <Text style={styles.infoText}>{item.date.split('T')[0]}</Text>
            </View>
            <View style={styles.infoRow}>
                <Clock size={16} color={COLORS.light.textSecondary} />
                <Text style={styles.infoText}>{item.date.split('T')[1].substring(0, 5)}</Text>
            </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mis Turnos</Text>
      </View>

      <FlatList
        data={MY_APPOINTMENTS}
        keyExtractor={item => item.id}
        renderItem={renderAppointment}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  headerContainer: {
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  listContent: {
    padding: SPACING.m,
  },
  card: {
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.light,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  cardCompleted: {
    opacity: 0.7,
    borderLeftColor: COLORS.light.textSecondary,
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.s,
  },
  service: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.light.text,
  },
  professionalName: {
      fontSize: 15,
      color: COLORS.light.textSecondary,
      marginBottom: SPACING.m,
  },
  dateTimeContainer: {
      flexDirection: 'row',
      gap: SPACING.l,
  },
  infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  infoText: {
      fontSize: 14,
      color: COLORS.light.text,
      fontWeight: '500',
  },
  badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: RADIUS.s,
  },
  badgeConfirmed: {
      backgroundColor: '#E8F5E9', // Light green
  },
  badgeCompleted: {
      backgroundColor: '#F2F2F7', // Light gray
  },
  badgeText: {
      fontSize: 12,
      fontWeight: '600',
  },
  badgeTextConfirmed: {
      color: COLORS.success,
  },
  badgeTextCompleted: {
      color: COLORS.light.textSecondary,
  },
});
