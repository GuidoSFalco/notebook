import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, Filter, Check, X, Phone, ArrowRight, CalendarDays } from 'lucide-react-native';
import { format, addDays } from 'date-fns';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { MY_APPOINTMENTS } from '../constants/mockData';
import Button from '../components/Button';

// Mock logged in professional ID
const CURRENT_PROFESSIONAL_ID = 'p1'; 

export default function ProfessionalAppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState(
    MY_APPOINTMENTS.filter(a => a.professionalId === CURRENT_PROFESSIONAL_ID || true) // Show all for demo purposes if p1 has few
  ); 
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [proposalData, setProposalData] = useState({
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: ''
  });

  const filteredAppointments = appointments.filter(item => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'pending_action') {
          return item.status === 'reschedule_requested' || item.status === 'cancellation_requested';
      }
      return item.status === filterStatus;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleAction = (id, action, type) => {
      if (action === 'propose') {
          const appointment = appointments.find(a => a.id === id);
          setSelectedAppointment(appointment);
          setShowProposalModal(true);
          return;
      }

      Alert.alert(
          action === 'accept' ? 'Confirmar Acción' : 'Rechazar Solicitud',
          `¿Estás seguro que deseas ${action === 'accept' ? 'aceptar' : 'rechazar'} esta solicitud?`,
          [
              { text: 'Cancelar', style: 'cancel' },
              { 
                  text: 'Confirmar', 
                  onPress: () => {
                      setAppointments(prev => prev.map(a => {
                          if (a.id !== id) return a;
                          
                          let newStatus = a.status;
                          if (type === 'reschedule') {
                              newStatus = action === 'accept' ? 'confirmed' : 'confirmed'; // Revert to confirmed if rejected, or new date if accepted
                              // Logic to update date would go here if accepted
                          } else if (type === 'cancellation') {
                              newStatus = action === 'accept' ? 'cancelled' : 'confirmed';
                          }
                          
                          return { ...a, status: newStatus };
                      }));
                  }
              }
          ]
      );
  };

  const sendProposal = () => {
      setAppointments(prev => prev.map(a => {
          if (a.id !== selectedAppointment.id) return a;
          return { ...a, status: 'proposal_sent' };
      }));
      setShowProposalModal(false);
      Alert.alert('Propuesta Enviada', 'Se ha enviado la propuesta alternativa al cliente.');
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

  const renderItem = ({ item }) => {
    const badge = getStatusBadge(item.status);
    const isPendingAction = item.status.includes('requested');
    const isReschedule = item.status === 'reschedule_requested';
    
    // Simulate requested date for demo if not present
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
                    <Text style={styles.infoText}>{item.date.split('T')[0]}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Clock size={16} color={COLORS.light.textSecondary} />
                    <Text style={styles.infoText}>{item.date.split('T')[1].substring(0, 5)}</Text>
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
                        onPress={() => handleAction(item.id, 'reject', isReschedule ? 'reschedule' : 'cancellation')}
                    >
                        <X size={20} color={COLORS.error} />
                        <Text style={[styles.actionText, { color: COLORS.error }]}>Rechazar</Text>
                    </TouchableOpacity>
                    
                    {isReschedule && (
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.proposalButton]}
                            onPress={() => handleAction(item.id, 'propose', 'reschedule')}
                        >
                            <CalendarDays size={20} color={COLORS.secondary} />
                            <Text style={[styles.actionText, { color: COLORS.secondary }]}>Proponer</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => handleAction(item.id, 'accept', isReschedule ? 'reschedule' : 'cancellation')}
                    >
                        <Check size={20} color={COLORS.success} />
                        <Text style={[styles.actionText, { color: COLORS.success }]}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda Profesional</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
            <Filter size={20} color={COLORS.primary} />
        </TouchableOpacity>
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

      <FlatList 
        data={filteredAppointments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No hay turnos para mostrar</Text>
            </View>
        }
      />

      <Modal
        visible={showProposalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProposalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Proponer Alternativa</Text>
            <Text style={styles.modalSubtitle}>Sugiere un nuevo rango de fechas y horarios</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rango de Fechas</Text>
              <View style={styles.row}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Inicio (YYYY-MM-DD)"
                  value={proposalData.startDate}
                  onChangeText={(text) => setProposalData(prev => ({...prev, startDate: text}))}
                />
                <TextInput 
                  style={styles.input} 
                  placeholder="Fin (YYYY-MM-DD)"
                  value={proposalData.endDate}
                  onChangeText={(text) => setProposalData(prev => ({...prev, endDate: text}))}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rango Horario</Text>
              <View style={styles.row}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Inicio (HH:MM)"
                  value={proposalData.startTime}
                  onChangeText={(text) => setProposalData(prev => ({...prev, startTime: text}))}
                />
                <TextInput 
                  style={styles.input} 
                  placeholder="Fin (HH:MM)"
                  value={proposalData.endTime}
                  onChangeText={(text) => setProposalData(prev => ({...prev, endTime: text}))}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => setShowProposalModal(false)}
              >
                <Text style={[styles.actionText, { color: COLORS.error }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.acceptButton]}
                onPress={sendProposal}
              >
                <Text style={[styles.actionText, { color: COLORS.success }]}>Enviar</Text>
              </TouchableOpacity>
            </View>
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
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: SPACING.l,
  },
  modalContent: {
      backgroundColor: COLORS.light.card,
      borderRadius: RADIUS.l,
      padding: SPACING.l,
      ...SHADOWS.medium,
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: SPACING.xs,
      textAlign: 'center',
  },
  modalSubtitle: {
      fontSize: 14,
      color: COLORS.light.textSecondary,
      marginBottom: SPACING.l,
      textAlign: 'center',
  },
  inputGroup: {
      marginBottom: SPACING.m,
  },
  inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: SPACING.s,
      color: COLORS.light.text,
  },
  row: {
      flexDirection: 'row',
      gap: SPACING.s,
  },
  input: {
      flex: 1,
      height: 44,
      borderWidth: 1,
      borderColor: COLORS.light.border,
      borderRadius: RADIUS.m,
      paddingHorizontal: SPACING.m,
      backgroundColor: COLORS.light.background,
  },
  modalActions: {
      flexDirection: 'row',
      marginTop: SPACING.l,
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
});
