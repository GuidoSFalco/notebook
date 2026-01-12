import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, CheckCircle } from 'lucide-react-native';
import Button from '../components/Button';
import CustomCalendar from '../components/CustomCalendar';
import VerticalAgenda from '../components/VerticalAgenda';
import { generateTimeSlots, formatDateES, generateMockOccupancy } from '../utils/timeUtils';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import AppointmentService from '../services/appointment.service';

const TIME_SLOTS = generateTimeSlots(15, 9, 18);

export default function BookingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { professional } = route.params;

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [professionalAppointments, setProfessionalAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await AppointmentService.getByProfessional(professional.id);
        setProfessionalAppointments(data);
      } catch (error) {
        console.error('Error fetching professional appointments:', error);
      }
    };

    if (professional?.id) {
      fetchAppointments();
    }
  }, [professional.id]);

  // Generate mock occupancy
  const occupancy = React.useMemo(() => generateMockOccupancy(new Date().getFullYear(), new Date().getMonth()), []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
        const dateTimeString = `${selectedDate}T${selectedTime}:00`;
        
        await AppointmentService.create({
            professionalId: professional.id,
            date: dateTimeString,
            serviceType: 'Consulta',
            notes: notes
        });

        Alert.alert(
          '¡Turno Confirmado!',
          `Has reservado con ${professional.name} para el ${selectedDate} a las ${selectedTime}`,
          [
            {
              text: 'Ir a Mis Turnos',
              onPress: () => {
                navigation.popToTop();
                navigation.navigate('Appointments');
              }
            }
          ]
        );
    } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'No se pudo reservar el turno');
    } finally {
        setLoading(false);
    }
  };

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
      <Text style={styles.stepTitle}>Seleccioná una fecha</Text>
      
      <View style={styles.calendarContainer}>
        <CustomCalendar 
          selectedDate={selectedDate}
          onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
          }}
          blockedDates={professional.fullDates}
          occupancy={occupancy}
        />
      </View>

      {selectedDate && (
        <>
            <Text style={styles.stepTitle}>Seleccioná un horario</Text>
            <VerticalAgenda 
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                appointments={getProfessionalAppointments(selectedDate)}
                scrollable={true}
                height={400}
            />
        </>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.confirmationContainer}>
      <CheckCircle size={64} color={COLORS.success} style={{ marginBottom: SPACING.l }} />
      <Text style={styles.confirmationTitle}>Confirmar Reserva</Text>
      <Text style={styles.confirmationText}>Por favor revisá los datos de tu turno</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Profesional</Text>
            <Text style={styles.summaryValue}>{professional.name}</Text>
        </View>
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fecha</Text>
            <Text style={styles.summaryValue}>{selectedDate}</Text>
        </View>
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Horario</Text>
            <Text style={styles.summaryValue}>{selectedTime}</Text>
        </View>
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Valor</Text>
            <Text style={styles.summaryValue}>${professional.price}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notas adicionales</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Ej: Primera consulta, dolor de cabeza..."
          placeholderTextColor={COLORS.light.textSecondary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: step === 1 ? '50%' : '100%' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 ? renderStep1() : renderStep2()}
      </ScrollView>

      <View style={styles.footer}>
        {step === 1 ? (
          <Button 
            title="Continuar" 
            onPress={() => setStep(2)}
            disabled={!selectedDate || !selectedTime}
            style={{ opacity: (!selectedDate || !selectedTime) ? 0.5 : 1 }}
          />
        ) : (
          <Button 
            title="Confirmar Reserva" 
            onPress={handleConfirm}
            loading={loading}
            style={{ backgroundColor: COLORS.success }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  progressContainer: {
    height: 4,
    backgroundColor: COLORS.light.border,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  content: {
    padding: SPACING.l,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.light.text,
    marginTop: SPACING.m,
    marginBottom: SPACING.m,
  },
  calendarContainer: {
    marginBottom: SPACING.l,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: SPACING.s,
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
    borderRadius: RADIUS.m,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.light.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  inputContainer: {
    width: '100%',
    marginBottom: SPACING.l,
  },
  label: {
    fontSize: 14,
    color: COLORS.light.textSecondary,
    marginBottom: SPACING.s,
    alignSelf: 'flex-start',
  },
  textArea: {
    width: '100%',
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    minHeight: 100,
    color: COLORS.light.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.l,
    backgroundColor: COLORS.light.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
});
