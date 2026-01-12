import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Clock, Filter, Check, X, Phone, ArrowRight, CalendarDays } from 'lucide-react-native';
import { format, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import VerticalAgenda from '../components/VerticalAgenda';
import ViewModeToggle from '../components/ViewModeToggle';
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

const STATUS_TO_INT = {
    'confirmed': 0,
    'completed': 1,
    'cancelled': 2,
    'reschedule_requested': 3,
    'cancellation_requested': 4,
    'proposal_sent': 5
};

export default function ProfessionalAppointmentsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState([]); 
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('agenda'); // 'agenda' | 'list'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await AppointmentService.getMyAppointments();
      const mappedData = data.map(appt => ({
        ...appt,
        status: typeof appt.status === 'number' ? STATUS_MAP[appt.status] || appt.status : appt.status,
        startTime: formatTime(appt.date),
        endTime: appt.endTime || '11:00',
        clientName: appt.clientName || 'Cliente',
        service: appt.serviceType || appt.service || 'Consulta'
      }));
      setAppointments(mappedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'No se pudieron cargar los turnos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };


  const getStatusBadge = (status) => {
      switch (status) {
          case 'confirmed': return { text: 'Confirmado', color: COLORS.success, bg: '#E8F5E9' };
          case 'reschedule_requested': return { text: 'Solicitud de Cambio', color: COLORS.warning, bg: '#FFF3E0' };
          case 'cancellation_requested': return { text: 'Solicitud de Cancelación', color: COLORS.error, bg: '#FFEBEE' };
          case 'cancelled': return { text: 'Cancelado', color: COLORS.light.textSecondary, bg: '#F2F2F7' };
          case 'completed': return { text: 'Finalizado', color: COLORS.primary, bg: '#E3F2FD' };
          case 'proposal_sent': return { text: 'Propuesta Enviada', color: COLORS.secondary, bg: '#E8EAF6' };
          default: return { text: status, color: COLORS.light.textSecondary, bg: '#F2F2F7' };
      }
  };

  const appointmentsForDate = useMemo(() => {
    return appointments.filter(a => {
        if (!a.date.startsWith(selectedDate)) return false;
        if (filterStatus === 'all') return true;
        if (filterStatus === 'pending_action') {
            return a.status === 'reschedule_requested' || a.status === 'cancellation_requested';
        }
        return a.status === filterStatus;
    }).map(a => ({
        ...a,
        startTime: formatTime(a.date),
        endTime: a.endTime || '11:00', // Mock duration if not present
        color: getStatusBadge(a.status).color
    }));
  }, [appointments, selectedDate, filterStatus]);

  const occupancy = useMemo(() => {
    const occ = {};
    const counts = {};
    appointments.forEach(a => {
        const dateStr = a.date.split('T')[0];
        counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    
    Object.keys(counts).forEach(date => {
        const count = counts[date];
        if (count >= 5) occ[date] = 'full';
        else if (count >= 3) occ[date] = 'high';
        else occ[date] = 'medium';
    });
    return occ;
  }, [appointments]);

  const handleAction = async (id, action, type) => {
      if (action === 'propose') {
          const appointment = appointments.find(a => a.id === id);
          setSelectedAppointment(appointment);
          navigation.navigate('ProposeDate', {
            appointment,
            onProposalSent: (dates) => {
                // Ideally this updates backend via ProposeDate screen or we refresh here
                fetchAppointments();
            }
          });
          return;
      }

      Alert.alert(
          action === 'accept' ? 'Confirmar Acción' : 'Rechazar Solicitud',
          `¿Estás seguro que deseas ${action === 'accept' ? 'aceptar' : 'rechazar'} esta solicitud?`,
          [
              { text: 'Cancelar', style: 'cancel' },
              { 
                  text: 'Confirmar', 
                  onPress: async () => {
                      try {
                          let newStatus = 'confirmed';
                          if (type === 'reschedule') {
                              newStatus = action === 'accept' ? 'confirmed' : 'confirmed';
                          } else if (type === 'cancellation') {
                              newStatus = action === 'accept' ? 'cancelled' : 'confirmed';
                          }

                          const statusInt = STATUS_TO_INT[newStatus];
                          if (statusInt !== undefined) {
                              await AppointmentService.updateStatus(id, statusInt);
                              fetchAppointments();
                              setSelectedAppointment(null);
                          }
                      } catch (error) {
                          console.error('Error updating status:', error);
                          Alert.alert('Error', 'No se pudo actualizar el estado');
                      }
                  }
              }
          ]
      );
  };

  const renderAppointmentDetails = (item) => {
    if (!item) return null;
    const badge = getStatusBadge(item.status);
    const isPendingAction = item.status.includes('requested');
    const isReschedule = item.status === 'reschedule_requested';
    const requestedDate = isReschedule ? format(addDays(new Date(item.date), 2), "yyyy-MM-dd'T'10:00:00") : null;

    return (
      <View style={[styles.card, { borderLeftColor: badge.color }]}>
        <View style={styles.cardHeader}>
            <View>
                <Text style={styles.clientName}>{item.clientName || 'Cliente Anónimo'}</Text>
                <Text style={styles.service}>{item.service}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
            </View>
        </View>

        <View style={styles.infoContainer}>
            <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Turno Original</Text>
                <View style={styles.infoRow}>
                    <Calendar size={16} color={COLORS.light.textSecondary} />
                    <Text style={styles.infoText}>{formatDateES(item.date)}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Clock size={16} color={COLORS.light.textSecondary} />
                    <Text style={styles.infoText}>{formatTime(item.date)}</Text>
                </View>
            </View>

            {isReschedule && requestedDate && (
                <>
                    <ArrowRight size={20} color={COLORS.light.textSecondary} style={{ marginTop: 20 }} />
                    <View style={styles.infoBlock}>
                        <Text style={[styles.infoLabel, { color: COLORS.warning }]}>Solicitado</Text>
                        <View style={styles.infoRow}>
                            <Calendar size={16} color={COLORS.warning} />
                            <Text style={[styles.infoText, { color: COLORS.warning, fontWeight: '700' }]}>
                                {requestedDate.split('T')[0]}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Clock size={16} color={COLORS.warning} />
                            <Text style={[styles.infoText, { color: COLORS.warning, fontWeight: '700' }]}>
                                {requestedDate.split('T')[1].substring(0, 5)}
                            </Text>
                        </View>
                    </View>
                </>
            )}
        </View>
        
        {item.clientPhone && (
            <View style={[styles.infoRow, { marginTop: SPACING.s }]}>
                <Phone size={16} color={COLORS.light.textSecondary} />
                <Text style={styles.infoText}>{item.clientPhone}</Text>
            </View>
        )}

        {isPendingAction && (
            <View style={styles.actionsContainer}>
                <Text style={styles.actionTitle}>
                    {isReschedule ? 'Solicita cambio de fecha' : 'Solicita cancelar turno'}
                </Text>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => {
                            handleAction(item.id, 'reject', isReschedule ? 'reschedule' : 'cancellation');
                        }}
                    >
                        <X size={20} color={COLORS.error} />
                        <Text style={[styles.actionText, { color: COLORS.error }]}>Rechazar</Text>
                    </TouchableOpacity>
                    
                    {isReschedule && (
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.proposalButton]}
                            onPress={() => {
                                handleAction(item.id, 'propose', 'reschedule');
                            }}
                        >
                            <CalendarDays size={20} color={COLORS.secondary} />
                            <Text style={[styles.actionText, { color: COLORS.secondary }]}>Proponer</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => {
                            handleAction(item.id, 'accept', isReschedule ? 'reschedule' : 'cancellation');
                        }}
                    >
                        <Check size={20} color={COLORS.success} />
                        <Text style={[styles.actionText, { color: COLORS.success }]}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}
        
        <Button 
            title="Cerrar" 
            variant="outline" 
            onPress={() => setSelectedAppointment(null)} 
            style={{ marginTop: SPACING.m }}
        />
      </View>
    );
  };

  const renderListItem = ({ item }) => {
    const badge = getStatusBadge(item.status);
    return (
      <TouchableOpacity 
        style={[styles.card, { borderLeftColor: badge.color }]}
        onPress={() => setSelectedAppointment(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
            <View>
                <Text style={styles.clientName}>{item.clientName || 'Cliente Anónimo'}</Text>
                <Text style={styles.service}>{item.service}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
            </View>
        </View>

        <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
                <Clock size={16} color={COLORS.light.textSecondary} />
                <Text style={styles.infoText}>{item.startTime} - {item.endTime}</Text>
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda Profesional</Text>
        <View style={{ flexDirection: 'row', gap: SPACING.s, alignItems: 'center' }}>
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
                <Filter size={20} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
      </View>

      {showFilters && (
          <View style={styles.filterBar}>
              <TouchableOpacity 
                style={[styles.filterChip, filterStatus === 'all' && styles.filterChipActive]}
                onPress={() => setFilterStatus('all')}
              >
                  <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterChip, filterStatus === 'pending_action' && styles.filterChipActive]}
                onPress={() => setFilterStatus('pending_action')}
              >
                  <Text style={[styles.filterText, filterStatus === 'pending_action' && styles.filterTextActive]}>Solicitudes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterChip, filterStatus === 'confirmed' && styles.filterChipActive]}
                onPress={() => setFilterStatus('confirmed')}
              >
                  <Text style={[styles.filterText, filterStatus === 'confirmed' && styles.filterTextActive]}>Confirmados</Text>
              </TouchableOpacity>
          </View>
      )}

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Date Navigation */}
        <View style={{ paddingHorizontal: SPACING.m, marginBottom: SPACING.m }}>
          <CustomCalendar 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            occupancy={occupancy}
          />
        </View>

        <View style={styles.agendaContainer}>
          {loading ? (
             <View style={{ padding: SPACING.xl, alignItems: 'center' }}>
                 <ActivityIndicator size="large" color={COLORS.primary} />
             </View>
          ) : viewMode === 'agenda' ? (
              <VerticalAgenda 
                  selectedTime={null}
                  onSelectTime={() => {}}
                  onAppointmentPress={setSelectedAppointment}
                  appointments={appointmentsForDate}
                  scrollable={false}
              />
          ) : (
              <View style={styles.listContent}>
                  {appointmentsForDate.length > 0 ? (
                      appointmentsForDate.map(item => (
                          <View key={item.id} style={{ marginBottom: SPACING.m }}>
                              {renderListItem({ item })}
                          </View>
                      ))
                  ) : (
                      <View style={styles.emptyState}>
                          <Text style={styles.emptyText}>No hay turnos para esta fecha</Text>
                      </View>
                  )}
              </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedAppointment}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedAppointment(null)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                {renderAppointmentDetails(selectedAppointment)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  filterButton: {
      padding: SPACING.s,
      backgroundColor: COLORS.light.card,
      borderRadius: RADIUS.s,
  },
  filterBar: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.m,
      marginBottom: SPACING.m,
      gap: SPACING.s,
  },
  filterChip: {
      paddingHorizontal: SPACING.m,
      paddingVertical: SPACING.s,
      borderRadius: RADIUS.xl,
      backgroundColor: COLORS.light.card,
      borderWidth: 1,
      borderColor: COLORS.light.border,
  },
  filterChipActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
  },
  filterText: {
      color: COLORS.light.text,
      fontSize: 14,
      fontWeight: '500',
  },
  filterTextActive: {
      color: '#FFF',
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
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.s,
  },
  clientName: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.light.text,
  },
  service: {
      fontSize: 14,
      color: COLORS.light.textSecondary,
  },
  badge: {
      paddingHorizontal: SPACING.s,
      paddingVertical: 4,
      borderRadius: RADIUS.s,
  },
  badgeText: {
      fontSize: 10,
      fontWeight: '700',
  },
  infoContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.m,
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
  actionsContainer: {
      borderTopWidth: 1,
      borderTopColor: COLORS.light.background,
      paddingTop: SPACING.m,
  },
  actionTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: SPACING.m,
      color: COLORS.light.text,
  },
  buttonsRow: {
      flexDirection: 'row',
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
  acceptButton: {
      backgroundColor: '#E8F5E9',
      borderColor: '#E8F5E9',
  },
  rejectButton: {
      backgroundColor: '#FFEBEE',
      borderColor: '#FFEBEE',
  },
  proposalButton: {
      backgroundColor: '#E8EAF6',
      borderColor: '#E8EAF6',
  },
  actionText: {
      fontWeight: '600',
      fontSize: 14,
  },
  emptyState: {
      alignItems: 'center',
      paddingTop: SPACING.xl,
  },
  emptyText: {
      color: COLORS.light.textSecondary,
      fontSize: 16,
  },
  agendaContainer: {
      flex: 1,
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: SPACING.m,
  },
  modalContent: {
      backgroundColor: 'transparent',
  }
});
