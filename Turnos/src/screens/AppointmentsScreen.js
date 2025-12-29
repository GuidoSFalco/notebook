import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, XCircle, CalendarDays } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { MY_APPOINTMENTS, PROFESSIONALS } from '../constants/mockData';

export default function AppointmentsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState(MY_APPOINTMENTS);

  useEffect(() => {
    if (route.params?.updatedAppointmentId && route.params?.newStatus) {
        updateStatus(route.params.updatedAppointmentId, route.params.newStatus);
        // Clear params to avoid double update if needed, though simpler just to leave it
        navigation.setParams({ updatedAppointmentId: null, newStatus: null });
    }
  }, [route.params]);

  const getProfessional = (id) => PROFESSIONALS.find(p => p.id === id);

  const handleCancelRequest = (id) => {
    Alert.alert(
      "Cancelar Turno",
      "¿Estás seguro que deseas solicitar la cancelación? Podría haber penalizaciones si faltan menos de 24hs.",
      [
        { text: "No, volver", style: "cancel" },
        { 
          text: "Sí, cancelar", 
          style: "destructive",
          onPress: () => updateStatus(id, 'cancellation_requested')
        }
      ]
    );
  };

  const handleRescheduleRequest = (appointment) => {
    navigation.navigate('Reschedule', { appointment });
  };

  const updateStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === id ? { ...appt, status: newStatus } : appt
    ));
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed': return { text: 'Confirmado', color: COLORS.success, bg: '#E8F5E9' };
      case 'completed': return { text: 'Finalizado', color: COLORS.light.textSecondary, bg: '#F2F2F7' };
      case 'cancellation_requested': return { text: 'Cancelación Solicitada', color: COLORS.error, bg: '#FFEBEE' };
      case 'reschedule_requested': return { text: 'Cambio Solicitado', color: COLORS.warning, bg: '#FFF3E0' };
      case 'cancelled': return { text: 'Cancelado', color: COLORS.light.textSecondary, bg: '#F2F2F7' };
      default: return { text: status, color: COLORS.light.textSecondary, bg: '#F2F2F7' };
    }
  };

  const renderAppointment = ({ item }) => {
    const professional = getProfessional(item.professionalId);
    if (!professional) return null;

    const statusInfo = getStatusInfo(item.status);
    const isActionable = item.status === 'confirmed';

    return (
      <View style={[styles.card, { borderLeftColor: statusInfo.color }]}>
        <View style={styles.header}>
            <Text style={styles.service}>{item.service}</Text>
            <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
                <Text style={[styles.badgeText, { color: statusInfo.color }]}>
                    {statusInfo.text}
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

        {isActionable && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]} 
              onPress={() => handleRescheduleRequest(item)}
            >
              <CalendarDays size={18} color={COLORS.warning} />
              <Text style={[styles.actionText, { color: COLORS.warning }]}>Cambiar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelRequest(item.id)}
            >
              <XCircle size={18} color={COLORS.error} />
              <Text style={[styles.actionText, { color: COLORS.error }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mis Turnos</Text>
      </View>

      <FlatList
        data={appointments}
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
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.light,
    borderLeftWidth: 4,
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
  badge: {
      paddingHorizontal: SPACING.s,
      paddingVertical: 4,
      borderRadius: RADIUS.s,
  },
  badgeText: {
      fontSize: 12,
      fontWeight: '600',
  },
  professionalName: {
      fontSize: 14,
      color: COLORS.light.textSecondary,
      marginBottom: SPACING.m,
  },
  dateTimeContainer: {
      flexDirection: 'row',
      gap: SPACING.l,
      marginBottom: SPACING.m,
  },
  infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
  },
  infoText: {
      color: COLORS.light.textSecondary,
      fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.light.background,
    paddingTop: SPACING.m,
    gap: SPACING.m,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.s,
    gap: SPACING.xs,
    borderWidth: 1,
  },
  rescheduleButton: {
    borderColor: COLORS.warning,
    backgroundColor: '#FFF3E0', // Light Orange
  },
  cancelButton: {
    borderColor: COLORS.error,
    backgroundColor: '#FFEBEE', // Light Red
  },
  actionText: {
    fontWeight: '600',
    fontSize: 14,
  }
});
