import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isBefore, 
  startOfDay 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function CustomCalendar({ 
  selectedDate, 
  onSelectDate, 
  originalDate, 
  availableDates = [], 
  blockedDates = [],
  multiSelect = false,
  selectedDates = [],
  occupancy = {} // { 'YYYY-MM-DD': 'full' | 'high' | 'medium' | 'low' }
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Safe access to array props
  const safeAvailableDates = availableDates || [];
  const safeBlockedDates = blockedDates || [];
  
  // Helper to parse YYYY-MM-DD to local Date to avoid UTC shifts
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Initialize current month based on selected date or original date if provided
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(parseLocalDate(selectedDate));
    } else if (originalDate) {
      setCurrentMonth(parseLocalDate(originalDate));
    }
  }, []); // Run once on mount

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
          <ChevronLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {format(currentMonth, 'MMMM yyyy', { locale: es }).replace(/^\w/, (c) => c.toUpperCase())}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <ChevronRight size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return (
      <View style={styles.daysHeader}>
        {days.map((day, index) => (
          <Text key={index} style={styles.dayLabel}>{day}</Text>
        ))}
      </View>
    );
  };

  const getOccupancyColor = (status) => {
    switch (status) {
      case 'full': return COLORS.error; // Ocupado / Lleno
      case 'high': return COLORS.warning; // Casi lleno
      case 'medium': return COLORS.secondary; // Disponibilidad parcial
      case 'low': return COLORS.success; // Disponible
      default: return 'transparent';
    }
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "yyyy-MM-dd";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const today = startOfDay(new Date());

    // Generate all days to be rendered
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <View style={styles.calendarBody}>
        {calendarDays.map((date, index) => {
          const dateString = format(date, dateFormat);
          
          // Compare strings directly to avoid timezone issues with new Date('YYYY-MM-DD') which defaults to UTC
          const isSelected = multiSelect 
            ? selectedDates.includes(dateString)
            : selectedDate === dateString;
            
          const isOriginal = originalDate === dateString;
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isToday = isSameDay(date, today);
          const isPast = isBefore(date, today);
          
          // Check availability
          // 1. Past dates are disabled (unless it's the original date)
          // 2. If availableDates is provided, date MUST be in it.
          // 3. If blockedDates is provided, date MUST NOT be in it.
          
          let isAvailable = !isPast;

          if (availableDates.length > 0) {
            isAvailable = isAvailable && availableDates.includes(dateString);
          }
          
          if (blockedDates.length > 0) {
             isAvailable = isAvailable && !blockedDates.includes(dateString);
          }

          // Original date should always be enabled regardless of availability rules
          const isDisabled = !isCurrentMonth || (!isAvailable && !isOriginal);

          const occupancyStatus = occupancy[dateString];
          const occupancyColor = getOccupancyColor(occupancyStatus);

          let cellStyle = [styles.cell];
          let textStyle = [styles.cellText];
          let containerStyle = [styles.dayContainer];

          if (isSelected) {
            containerStyle.push(styles.selectedContainer);
            textStyle.push(styles.selectedText);
          } else if (isOriginal) {
            containerStyle.push(styles.originalContainer);
            textStyle.push(styles.originalText);
          } else if (isToday) {
            containerStyle.push(styles.todayContainer);
            textStyle.push(styles.todayText);
          } else if (isDisabled) {
             textStyle.push(styles.disabledText);
          }

          return (
            <TouchableOpacity
              key={dateString}
              style={styles.cell}
              onPress={() => !isDisabled && onSelectDate(dateString)}
              disabled={isDisabled}
            >
              <View style={containerStyle}>
                <Text style={textStyle}>{format(date, 'd')}</Text>
                {isOriginal && !isSelected && <View style={styles.originalDot} />}
                {!isSelected && !isDisabled && occupancyStatus && (
                  <View style={[styles.occupancyDot, { backgroundColor: occupancyColor }]} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
      
      {originalDate && (
        <View style={styles.legend}>
            <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                <Text style={styles.legendText}>Seleccionado</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
                <Text style={styles.legendText}>Turno Actual</Text>
            </View>
        </View>
      )}

      {Object.keys(occupancy).length > 0 && (
        <View style={[styles.legend, { marginTop: originalDate ? 0 : SPACING.m, borderTopWidth: originalDate ? 0 : 1 }]}>
            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
                    <Text style={styles.legendText}>Lleno</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
                    <Text style={styles.legendText}>Alto</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.secondary }]} />
                    <Text style={styles.legendText}>Medio</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
                    <Text style={styles.legendText}>Bajo</Text>
                </View>
            </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  navButton: {
    padding: SPACING.s,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
    paddingBottom: SPACING.s,
  },
  dayLabel: {
    width: '14.28%', // Match cell width
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.light.textSecondary,
    fontWeight: '600',
  },
  calendarBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  cellText: {
    fontSize: 14,
    color: COLORS.light.text,
  },
  selectedContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
  },
  selectedText: {
    color: '#FFF',
    fontWeight: '700',
  },
  originalContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  originalText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  todayContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.light.background,
  },
  todayText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  originalDot: {
      position: 'absolute',
      bottom: 2,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: COLORS.warning,
  },
  occupancyDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  disabledText: {
    color: COLORS.light.border,
  },
  legend: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: SPACING.m,
      gap: SPACING.l,
      borderTopWidth: 1,
      borderTopColor: COLORS.light.border,
      paddingTop: SPACING.s,
  },
  legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: SPACING.m,
      marginBottom: SPACING.xs,
  },
  legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: SPACING.s,
  },
  occupancyLegend: {
      marginTop: SPACING.s,
      width: '100%',
  },
  legendRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: SPACING.xs,
  },
  legendText: {
      fontSize: 12,
      color: COLORS.light.textSecondary,
  },
});
