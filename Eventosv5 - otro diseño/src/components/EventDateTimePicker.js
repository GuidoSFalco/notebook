import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react-native';

const WEEKDAY_NAMES = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function addMonthsLocal(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function subMonthsLocal(date, amount) {
  return addMonthsLocal(date, -amount);
}

function startOfMonthLocal(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfWeekMonday(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay();
  const diff = (day + 6) % 7;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDaysLocal(date, amount) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + amount);
  return result;
}

function isSameMonthLocal(a, b) {
  if (!a || !b) {
    return false;
  }
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isSameDayLocal(a, b) {
  if (!a || !b) {
    return false;
  }
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTimeHHMM(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDateTimeSpanish(date) {
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const time = formatTimeHHMM(date);
  const base = `${weekday} ${day} de ${month} de ${year} · ${time}`;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function normalizeTimeInput(text) {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  const hours = digits.slice(0, 2);
  const minutes = digits.slice(2);
  return `${hours}:${minutes}`;
}

function parseTimeFromText(text) {
  if (!text) {
    return null;
  }
  const parts = text.split(':');
  if (parts.length !== 2) {
    return null;
  }
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }
  return { hours, minutes };
}

export default function EventDateTimePicker({
  value,
  onChange,
  label = 'Fecha y Hora',
  placeholder = 'Seleccionar fecha y hora',
}) {
  const [visible, setVisible] = useState(false);
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeText, setTimeText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [timeError, setTimeError] = useState('');

  useEffect(() => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      setMonth(value);
      setSelectedDate(value);
      setTimeText(formatTimeHHMM(value));
      setDisplayText(formatDateTimeSpanish(value));
    }
  }, [value]);

  const monthLabel = `${MONTH_NAMES[month.getMonth()]} ${month.getFullYear()}`;
  const monthStart = startOfMonthLocal(month);
  const gridStart = startOfWeekMonday(monthStart);
  const days = [];
  for (let i = 0; i < 42; i += 1) {
    days.push(addDaysLocal(gridStart, i));
  }

  const handleOpen = () => {
    const base = value instanceof Date && !Number.isNaN(value.getTime()) ? value : new Date();
    setMonth(base);
    setSelectedDate(base);
    setTimeText(formatTimeHHMM(base));
    setTimeError('');
    setVisible(true);
  };

  const handleConfirm = () => {
    const parsed = parseTimeFromText(timeText);
    if (!parsed) {
      setTimeError('Horario inválido. Usa el formato HH:MM');
      return;
    }
    const date = new Date(selectedDate);
    date.setHours(parsed.hours, parsed.minutes, 0, 0);
    const formatted = formatDateTimeSpanish(date);
    setDisplayText(formatted);
    setVisible(false);
    if (onChange) {
      onChange(date, formatted);
    }
  };

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity activeOpacity={0.8} onPress={handleOpen}>
        <View style={styles.fieldRow}>
          <Calendar size={20} color={COLORS.textSecondary} style={styles.fieldIcon} />
          <Text
            style={[
              styles.fieldText,
              !displayText && styles.fieldPlaceholder,
            ]}
          >
            {displayText || placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setVisible(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => setMonth((prev) => subMonthsLocal(prev, 1))}
                style={styles.headerButton}
              >
                <ArrowLeft size={20} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
              </Text>
              <TouchableOpacity
                onPress={() => setMonth((prev) => addMonthsLocal(prev, 1))}
                style={styles.headerButton}
              >
                <ArrowRight size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDaysRow}>
              {WEEKDAY_LABELS.map((labelItem, index) => (
                <Text
                  key={index}
                  style={styles.weekDayLabel}
                >
                  {labelItem}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {days.map((day, index) => {
                const isCurrentMonth = isSameMonthLocal(day, month);
                const isSelected = selectedDate && isSameDayLocal(day, selectedDate);
                const dayStyle = [
                  styles.dayCell,
                  !isCurrentMonth && { opacity: 0.3 },
                  isSelected && styles.dayCellSelected,
                ];
                const textStyle = [
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                ];
                return (
                  <TouchableOpacity
                    key={index}
                    style={dayStyle}
                    onPress={() => setSelectedDate(day)}
                  >
                    <Text style={textStyle}>{day.getDate()}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.timeLabel}>Horario</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={styles.timeInput}
                value={timeText}
                onChangeText={(text) => {
                  setTimeError('');
                  setTimeText(normalizeTimeInput(text));
                }}
                keyboardType="numeric"
                placeholder="HH:MM"
                placeholderTextColor={COLORS.textSecondary}
                maxLength={5}
              />
            </View>
            {timeError ? (
              <Text style={styles.timeErrorText}>{timeError}</Text>
            ) : null}

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    ...FONTS.h3,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SIZES.s,
    marginTop: SIZES.m,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 56,
  },
  fieldIcon: {
    marginRight: SIZES.s,
  },
  fieldText: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.text,
  },
  fieldPlaceholder: {
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.l,
    paddingTop: SIZES.m,
    paddingBottom: SIZES.l,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.m,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xs,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.m,
  },
  dayCell: {
    // backgroundColor: COLORS.primary,
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    marginVertical: 'auto',
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.text,
  },
  dayTextSelected: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  timeLabel: {
    ...FONTS.h3,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  timeInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...FONTS.body,
    color: COLORS.text,
  },
  timeErrorText: {
    marginTop: 2,
    ...FONTS.caption,
    color: COLORS.error,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SIZES.m,
    gap: SIZES.s,
  },
  cancelButton: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  confirmButton: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  confirmText: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontWeight: '600',
  },
});

