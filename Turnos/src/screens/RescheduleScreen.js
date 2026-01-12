import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react-native';
import Button from '../components/Button';
import CustomCalendar from '../components/CustomCalendar';
import VerticalAgenda from '../components/VerticalAgenda';
import { generateTimeSlots, formatDateES, generateMockOccupancy } from '../utils/timeUtils';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import AppointmentService from '../services/appointment.service';
import ProfessionalService from '../services/professional.service';

const TIME_SLOTS = generateTimeSlots(15, 9, 18);

export default function RescheduleScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { appointment } = route.params;
  const [professional, setProfessional] = useState(appointment.professional || { id: appointment.professionalId, name: appointment.professionalName || 'Profesional' });
  
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(appointment.date.split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [professionalAppointments, setProfessionalAppointments] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              // Fetch professional appointments
              const appts = await AppointmentService.getByProfessional(appointment.professionalId);
              setProfessionalAppointments(appts);

              // Fetch professional details if not fully available (e.g. for phone)
              if (!professional.phone) {
                  const profData = await ProfessionalService.getById(appointment.professionalId);
                  setProfessional(profData);
              }
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData();
  }, [appointment.professionalId]);

  const occupancy = React.useMemo(() => generateMockOccupancy(new Date().getFullYear(), new Date().getMonth()), []);

  const handleWhatsApp = () => {
    // Check if professional has phone
    if (professional?.phone) {
        const message = `Hola ${professional.name}, soy ${appointment.clientName || 'tu paciente'}. Quisiera consultar sobre el cambio de mi turno del ${appointment.date.split('T')[0]}.`;
        const url = `whatsapp://send?phone=${professional.phone}&text=${encodeURIComponent(message)}`;
        
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', 'WhatsApp no está instalado en este dispositivo');
            }
        });
    } else {
        Alert.alert('Información', 'El profesional no tiene un número de contacto disponible.');
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // 3 = Reschedule Requested (mapped to backend status)
      await AppointmentService.updateStatus(appointment.id, 3);
      
      Alert.alert(
        'Solicitud Enviada',
        `Se ha enviado la solicitud de cambio al profesional. Te notificaremos cuando sea aceptada.`,
        [
          {
            text: 'Volver a Mis Turnos',
            onPress: () => {
              navigation.navigate('Main', { 
                  screen: 'Appointments',
                  params: { 
                      updatedAppointmentId: appointment.id,
                      newStatus: 'reschedule_requested'
                  }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error rescheduling:', error);
      Alert.alert('Error', 'No se pudo enviar la solicitud de cambio.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentAppointment = () => (
    <View style={styles.currentCard}>
        <Text style={styles.sectionTitle}>Turno Actual</Text>
        <View style={styles.row}>
            <Text style={styles.label}>Profesional:</Text>
            <Text style={styles.value}>{professional?.name}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{appointment.date.split('T')[0]}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Horario:</Text>
            <Text style={styles.value}>{appointment.date.split('T')[1].substring(0, 5)}</Text>
        </View>
    </View>
  );

  const getProfessionalAppointments = (date) => {
      if (!date) return [];
      return professionalAppointments.filter(a => 
         a.date.startsWith(date)
      ).map(a => ({
         startTime: a.date.split('T')[1].substring(0, 5),
         endTime: '11:00', // Mock duration
         status: 'Ocupado',
         clientName: 'Reservado',
         color: COLORS.light.border
      }));
  };

  const renderStep1 = () => (
    <View>
      {renderCurrentAppointment()}
      
      <Text style={styles.stepHeader}>Seleccioná una nueva fecha</Text>
      
      <View style={styles.calendarContainer}>
        <CustomCalendar 
            selectedDate={selectedDate}
            onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
            }}
            originalDate={appointment.date.split('T')[0]}
            blockedDates={professional?.fullDates}
            occupancy={occupancy}
        />
      </View>

      {selectedDate && (
          <>
            <Text style={styles.stepHeader}>Seleccioná un nuevo horario</Text>
            <VerticalAgenda 
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                appointments={getProfessionalAppointments(selectedDate)}
                scrollable={true}
                height={400}
            />
          </>
      )}

      <View style={styles.footer}>
          <Button 
            title="Continuar" 
            onPress={() => setStep(2)}
            disabled={!selectedDate || !selectedTime}
            style={styles.fullButton}
          />
          
          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
              <MessageCircle size={20} color={COLORS.success} />
              <Text style={styles.whatsappText}>Consultar por WhatsApp</Text>
          </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.confirmationContainer}>
      <CheckCircle size={64} color={COLORS.warning} style={{ marginBottom: SPACING.l }} />
      <Text style={styles.confirmationTitle}>Confirmar Solicitud</Text>
      <Text style={styles.confirmationText}>Estás solicitando cambiar tu turno por el siguiente:</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Nueva Fecha</Text>
            <Text style={styles.summaryValue}>{formatDateES(selectedDate)}</Text>
        </View>
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Nuevo Horario</Text>
            <Text style={styles.summaryValue}>{selectedTime}</Text>
        </View>
      </View>

      <Text style={styles.note}>
          * El cambio está sujeto a aprobación del profesional.
      </Text>

      <View style={styles.footer}>
        <Button 
            title="Confirmar Solicitud" 
            onPress={handleConfirm}
            loading={loading}
            style={styles.fullButton}
        />
        <Button 
            title="Volver" 
            variant="outline"
            onPress={() => setStep(1)}
            disabled={loading}
            style={[styles.fullButton, { marginTop: SPACING.m }]}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* <View style={styles.header}>
        <Button 
            title="Cancelar" 
            variant="outline" 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
        />
      </View> */}

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 ? renderStep1() : renderStep2()}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  backButton: {
      height: 36,
      paddingHorizontal: SPACING.m,
  },
  content: {
    padding: SPACING.l,
    paddingBottom: 100,
  },
  currentCard: {
      backgroundColor: COLORS.light.card,
      padding: SPACING.m,
      borderRadius: RADIUS.m,
      marginBottom: SPACING.xl,
      borderLeftWidth: 4,
      borderLeftColor: COLORS.primary,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: SPACING.m,
      color: COLORS.light.text,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.s,
  },
  label: {
      color: COLORS.light.textSecondary,
  },
  value: {
      fontWeight: '600',
      color: COLORS.light.text,
  },
  stepHeader: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: SPACING.m,
      color: COLORS.light.text,
  },
  calendarContainer: {
    marginBottom: SPACING.xl,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
    marginBottom: SPACING.xl,
  },
  timeButton: {
    width: '30%',
    marginBottom: SPACING.s,
  },
  originalTimeButton: {
      borderColor: COLORS.warning,
      backgroundColor: '#FFF8E1',
  },
  originalTimeText: {
      color: COLORS.warning,
      fontWeight: '700',
  },
  footer: {
      marginTop: SPACING.l,
  },
  fullButton: {
      width: '100%',
  },
  whatsappButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: SPACING.l,
      padding: SPACING.m,
  },
  whatsappText: {
      marginLeft: SPACING.s,
      color: COLORS.success,
      fontWeight: '600',
  },
  confirmationContainer: {
      alignItems: 'center',
      paddingTop: SPACING.xl,
  },
  confirmationTitle: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: SPACING.s,
      color: COLORS.light.text,
  },
  confirmationText: {
      fontSize: 16,
      color: COLORS.light.textSecondary,
      marginBottom: SPACING.xl,
      textAlign: 'center',
  },
  summaryCard: {
      width: '100%',
      backgroundColor: COLORS.light.card,
      padding: SPACING.l,
      borderRadius: RADIUS.m,
      marginBottom: SPACING.m,
  },
  summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.m,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.light.background,
      paddingBottom: SPACING.s,
  },
  summaryLabel: {
      color: COLORS.light.textSecondary,
      fontSize: 16,
  },
  summaryValue: {
      fontWeight: '700',
      fontSize: 16,
      color: COLORS.light.text,
  },
  note: {
      fontSize: 14,
      color: COLORS.light.textSecondary,
      fontStyle: 'italic',
      marginBottom: SPACING.xl,
  },
});
