import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { timeToMinutes } from '../utils/timeUtils';

const SLOT_HEIGHT = 40;
const SLOT_INTERVAL = 15; // minutes

export default function VerticalAgenda({
  selectedTime,
  onSelectTime,
  onAppointmentPress,
  appointments = [],
  startHour = 8,
  endHour = 20,
  scrollable = true,
  height,
}) {
  const scrollViewRef = useRef(null);

  // Generate slots
  const slots = useMemo(() => {
    const result = [];
    const startMin = startHour * 60;
    const endMin = endHour * 60;
    
    for (let m = startMin; m < endMin; m += SLOT_INTERVAL) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const time = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      result.push(time);
    }
    return result;
  }, [startHour, endHour]);

  // Calculate position for an appointment
  const getAppointmentStyle = (appt) => {
    const startMin = timeToMinutes(appt.startTime);
    const endMin = timeToMinutes(appt.endTime);
    const dayStartMin = startHour * 60;

    const top = ((startMin - dayStartMin) / SLOT_INTERVAL) * SLOT_HEIGHT;
    const duration = endMin - startMin;
    const height = (duration / SLOT_INTERVAL) * SLOT_HEIGHT;

    return {
      top,
      height: Math.max(height, SLOT_HEIGHT / 2), // Minimum height
    };
  };

  const GridContent = () => (
    <View style={styles.gridContainer}>
      {/* Time Slots Background */}
      {slots.map((time) => {
        const isSelected = selectedTime === time;
        
        return (
          <View key={time} style={styles.slotContainer}>
            <View style={styles.timeLabelContainer}>
              <Text style={[
                styles.timeLabel,
                time.endsWith('00') && styles.hourLabel
              ]}>
                {time}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.slotContent,
                isSelected && styles.selectedSlot
              ]}
              onPress={() => onSelectTime && onSelectTime(time)}
              activeOpacity={0.7}
            >
              {isSelected && (
                <Text style={styles.selectedText}>Seleccionado</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Appointments Overlay */}
      {appointments.map((appt, index) => {
         const style = getAppointmentStyle(appt);
         
         return (
           <TouchableOpacity 
             key={`${appt.id || index}`} 
             style={[styles.appointmentCard, style]}
             onPress={() => onAppointmentPress && onAppointmentPress(appt)}
             activeOpacity={0.9}
           >
             <View style={[
               styles.appointmentInner,
               { borderLeftColor: appt.color || COLORS.secondary }
             ]}>
                <Text style={styles.apptTitle} numberOfLines={1}>
                  {appt.clientName || 'Ocupado'}
                </Text>
                <Text style={styles.apptTime}>
                  {appt.startTime} - {appt.endTime}
                </Text>
                {appt.status && (
                   <Text style={styles.apptStatus}>{appt.status}</Text>
                )}
             </View>
           </TouchableOpacity>
         );
      })}
    </View>
  );

  if (!scrollable) {
    return (
      <View style={[styles.container, styles.staticContainer, height && { height }]}>
         <GridContent />
      </View>
    );
  }

  return (
    <View style={[styles.container, height && { height }]}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <GridContent />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
    borderRadius: RADIUS.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  staticContainer: {
    flex: 0,
    height: 'auto',
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  gridContainer: {
    position: 'relative',
  },
  slotContainer: {
    flexDirection: 'row',
    height: SLOT_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  timeLabelContainer: {
    width: 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    borderRightWidth: 1,
    borderRightColor: COLORS.light.border,
    backgroundColor: COLORS.light.background,
  },
  timeLabel: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
  },
  hourLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  slotContent: {
    flex: 1,
    backgroundColor: COLORS.light.card,
    padding: SPACING.s,
    justifyContent: 'center',
  },
  selectedSlot: {
    backgroundColor: COLORS.primary + '20', // 20% opacity hex
  },
  selectedText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  appointmentCard: {
    position: 'absolute',
    right: 4,
    left: 64, // 60 width + border
    padding: 2,
  },
  appointmentInner: {
    flex: 1,
    backgroundColor: COLORS.secondary + '15', // Light background
    borderRadius: RADIUS.s,
    borderLeftWidth: 4,
    padding: SPACING.xs,
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  apptTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  apptTime: {
    fontSize: 10,
    color: COLORS.light.textSecondary,
  },
  apptStatus: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 2,
  }
});
