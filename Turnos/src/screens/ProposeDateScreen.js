import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarDays, Trash, Calendar, Clock, User } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import CustomCalendar from '../components/CustomCalendar';
import Button from '../components/Button';
import VerticalAgenda from '../components/VerticalAgenda';
import { generateTimeSlots, generateMockOccupancy } from '../utils/timeUtils';

const TIME_SLOTS = generateTimeSlots(15, 9, 18);

export default function ProposeDateScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { appointment, onProposalSent } = route.params || {};
  const [proposalDates, setProposalDates] = useState([]);
  const [activeDateIndex, setActiveDateIndex] = useState(0);

  const occupancy = React.useMemo(() => generateMockOccupancy(new Date().getFullYear(), new Date().getMonth()), []);

  const getDayAppointments = (date) => {
    // Mock existing appointments for the selected date to show availability
    // In a real app, this would fetch from backend/store
    return [];
  };

  const handleDateSelect = (dateString) => {
      setProposalDates(prev => {
          const exists = prev.find(p => p.date === dateString);
          if (exists) {
              return prev.filter(p => p.date !== dateString);
          } else {
              return [...prev, { date: dateString, startTime: '09:00', endTime: '10:00' }];
          }
      });
  };

  const handleSlotSelect = (date, time) => {
      setProposalDates(prev => prev.map(p => {
          if (p.date === date) {
              const [h, m] = time.split(':').map(Number);
              const endH = h + 1;
              const endTime = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
              return { ...p, startTime: time, endTime };
          }
          return p;
      }));
  };

  const handleSendProposal = () => {
      if (proposalDates.length === 0) {
          Alert.alert('Error', 'Debes seleccionar al menos una fecha alternativa.');
          return;
      }
      
      if (onProposalSent) {
        onProposalSent(proposalDates);
      }
      
      Alert.alert('Propuesta Enviada', 'Se han enviado las fechas alternativas al cliente.', [
          { text: 'OK', onPress: () => navigation.goBack() }
      ]);
  };

  const renderCurrentAppointment = () => (
    <View style={styles.currentCard}>
        <Text style={styles.sectionTitle}>Turno Original</Text>
        <View style={styles.row}>
            <User size={16} color={COLORS.light.textSecondary} />
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{appointment?.clientName || 'Cliente'}</Text>
        </View>
        <View style={styles.row}>
            <Calendar size={16} color={COLORS.light.textSecondary} />
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{appointment?.date?.split('T')[0]}</Text>
        </View>
        <View style={styles.row}>
            <Clock size={16} color={COLORS.light.textSecondary} />
            <Text style={styles.label}>Horario:</Text>
            <Text style={styles.value}>{appointment?.date?.split('T')[1]?.substring(0, 5)}</Text>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {renderCurrentAppointment()}

            <Text style={styles.stepHeader}>Seleccioná fechas alternativas</Text>
            
            <View style={styles.calendarContainer}> 
                <CustomCalendar 
                    selectedDates={proposalDates.map(p => p.date)}
                    onSelectDate={handleDateSelect}
                    originalDate={appointment?.date?.split('T')[0]}
                    multiSelect={true}
                    occupancy={occupancy}
                />
            </View>

            {proposalDates.length > 0 && (
                <>
                    <Text style={styles.stepHeader}>Definir horarios ({proposalDates.length})</Text>
                    
                    {/* Date Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
                        {proposalDates.map((item, index) => (
                            <TouchableOpacity 
                                key={item.date} 
                                style={[
                                    styles.dateTab, 
                                    activeDateIndex === index && styles.activeDateTab
                                ]}
                                onPress={() => setActiveDateIndex(index)}
                            >
                                <Text style={[
                                    styles.dateTabText,
                                    activeDateIndex === index && styles.activeDateTabText
                                ]}>{item.date}</Text>
                                <TouchableOpacity onPress={() => handleDateSelect(item.date)} hitSlop={10}>
                                    <Trash size={14} color={activeDateIndex === index ? COLORS.light.background : COLORS.error} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.agendaContainer}>
                        {proposalDates[activeDateIndex] && (
                            <VerticalAgenda
                                selectedTime={proposalDates[activeDateIndex].startTime}
                                onSelectTime={(time) => handleSlotSelect(proposalDates[activeDateIndex].date, time)}
                                appointments={getDayAppointments(proposalDates[activeDateIndex].date)}
                                scrollable={true}
                                height={400}
                            />
                        )}
                    </View>
                </>
            )}
        </ScrollView>

        <View style={styles.footer}>
            <Button 
                title="Enviar Propuesta" 
                onPress={handleSendProposal}
                disabled={proposalDates.length === 0}
                style={styles.fullButton}
            />
            <Button 
                title="Cancelar" 
                variant="outline"
                onPress={() => navigation.goBack()}
                style={[styles.fullButton, { marginTop: SPACING.m }]}
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
      ...SHADOWS.light,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: SPACING.m,
      color: COLORS.light.text,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.s,
      gap: SPACING.s,
  },
  label: {
      color: COLORS.light.textSecondary,
      width: 70,
  },
  value: {
      fontWeight: '600',
      color: COLORS.light.text,
      flex: 1,
  },
  stepHeader: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: SPACING.xxl,
      marginBottom: SPACING.m,
      color: COLORS.light.text,
  },
  calendarContainer: {
    marginBottom: SPACING.xl,
    height: 340,
  },
  datesList: {
    marginBottom: SPACING.xl,
  },
  tabsContainer: {
    marginBottom: SPACING.m,
    flexDirection: 'row',
  },
  dateTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.xl,
    marginRight: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    gap: SPACING.s,
  },
  activeDateTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateTabText: {
    color: COLORS.light.text,
    fontWeight: '600',
  },
  activeDateTabText: {
    color: '#FFFFFF',
  },
  agendaContainer: {
     marginBottom: SPACING.xl,
  },
  dateItem: {
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.light,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
    paddingBottom: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  dateLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  footer: {
      padding: SPACING.l,
      borderTopWidth: 1,
      borderTopColor: COLORS.light.border,
      backgroundColor: COLORS.light.background,
  },
  fullButton: {
      width: '100%',
  },
});
