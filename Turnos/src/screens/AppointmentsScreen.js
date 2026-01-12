import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, XCircle, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import VerticalAgenda from '../components/VerticalAgenda';
import ViewModeToggle from '../components/ViewModeToggle';
import Button from '../components/Button';
import CustomCalendar from '../components/CustomCalendar';
import { formatDateES, formatTime } from '../utils/timeUtils';
import AppointmentService from '../services/appointment.service';

const STATUS_MAP = {
  0: 'confirmed',
  1: 'completed',
  2: 'cancelled',
  3: 'reschedule_requested',
  4: 'cancellation_requested',
  5: 'proposal_sent'
};

export default function AppointmentsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await AppointmentService.getMyAppointments();
      const mappedData = data.map(appt => ({
        ...appt,
        status: typeof appt.status === 'number' ? STATUS_MAP[appt.status] || appt.status : appt.status,
        service: appt.serviceType || appt.service || 'Consulta'
      }));
      setAppointments(mappedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Alert.alert('Error', 'No se pudieron cargar los turnos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (route.params?.updatedAppointmentId && route.params?.newStatus) {
        // Refresh data to ensure consistency
        fetchAppointments();
        // Clear params
        navigation.setParams({ updatedAppointmentId: null, newStatus: null });
    }
  }, [route.params, fetchAppointments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleCancelRequest = (id) => {
    Alert.alert(
      "Cancelar Turno",
      "¿Estás seguro que deseas solicitar la cancelación? Podría haber penalizaciones si faltan menos de 24hs.",
      [
        { text: "No, volver", style: "cancel" },
        { 
          text: "Sí, cancelar", 
          style: "destructive",
          onPress: async () => {
            try {
               // 4 = Cancellation Requested
               await AppointmentService.updateStatus(id, 4);
               fetchAppointments();
            } catch (error) {
               console.error('Error cancelling:', error);
               Alert.alert('Error', 'No se pudo cancelar el turno');
            }
          }
        }
      ]
    );
  };


  const handleRescheduleRequest = (appointment) => {
    navigation.navigate('Reschedule', { appointment });
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

  const occupancy = useMemo(() => {
    const counts = {};
    appointments.forEach(app => {
        if (app.status !== 'cancelled') {
            const date = app.date.split('T')[0];
            counts[date] = (counts[date] || 0) + 1;
        }
    });

    const result = {};
    Object.keys(counts).forEach(date => {
        const count = counts[date];
        if (count >= 3) result[date] = 'high';
        else if (count === 2) result[date] = 'medium';
        else result[date] = 'low';
    });
    return result;
  }, [appointments]);

  const appointmentsForDate = useMemo(() => {
    return appointments.filter(a => a.date.startsWith(selectedDate)).map(a => ({
        ...a,
        startTime: a.date.split('T')[1].substring(0, 5),
        endTime: a.endTime || '11:00', // Mock duration
        color: getStatusInfo(a.status).color
    }));
  }, [appointments, selectedDate]);

  const renderAppointment = ({ item }) => {
    const professionalName = item.professional?.name || item.professionalName || 'Profesional';

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

        <Text style={styles.professionalName}>{professionalName}</Text>
        
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.title}>Mis Turnos</Text>
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ paddingHorizontal: SPACING.m, marginBottom: SPACING.m }}>
            <CustomCalendar 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate}
                occupancy={occupancy}
            />
        </View>

        {viewMode === 'list' ? (
            <View style={styles.listContent}>
                {appointmentsForDate.length > 0 ? (
                    appointmentsForDate.map(item => (
                        <View key={item.id} style={{ marginBottom: SPACING.m }}>
                            {renderAppointment({ item })}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No tenés turnos para esta fecha</Text>
                    </View>
                )}
            </View>
        ) : (
            <View style={{ flex: 1 }}>
                <VerticalAgenda 
                    selectedTime={null}
                    onSelectTime={() => {}}
                    onAppointmentPress={setSelectedAppointment}
                    appointments={appointmentsForDate}
                    scrollable={false}
                />
            </View>
        )}
      </ScrollView>
      )}

      <Modal
        visible={!!selectedAppointment}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedAppointment(null)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                {selectedAppointment && renderAppointment({ item: selectedAppointment })}
                <Button 
                    title="Cerrar" 
                    variant="outline" 
                    onPress={() => setSelectedAppointment(null)} 
                    style={{ marginTop: SPACING.m }}
                />
            </View>
        </View>
      </Modal>
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
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: SPACING.m,
  },
  modalContent: {
      backgroundColor: 'transparent',
  },
  emptyState: {
      alignItems: 'center',
      paddingTop: SPACING.xl,
  },
  emptyText: {
      color: COLORS.light.textSecondary,
      fontSize: 16,
  }
});
