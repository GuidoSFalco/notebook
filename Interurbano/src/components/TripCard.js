import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../theme/colors';
import { Clock, ArrowRight, Bus } from 'lucide-react-native';

export const TripCard = ({ trip, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={styles.companyContainer}>
          <Bus size={16} color={colors.primary} />
          <Text style={styles.companyName}>{trip.company}</Text>
          <Text style={styles.tripType}>• {trip.type}</Text>
        </View>
        <Text style={styles.price}>${trip.price.toLocaleString()}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{trip.departureTime}</Text>
          <Text style={styles.city}>{trip.origin}</Text>
        </View>

        <View style={styles.durationContainer}>
          <Text style={styles.duration}>{trip.duration}</Text>
          <View style={styles.line} />
          <ArrowRight size={16} color={colors.textSecondary} />
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.time}>{trip.arrivalTime}</Text>
          <Text style={styles.city}>{trip.destination}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.seatsContainer}>
          <View style={[styles.seatIndicator, { backgroundColor: trip.seatsAvailable > 5 ? colors.success : colors.error }]} />
          <Text style={styles.seatsText}>{trip.seatsAvailable} asientos disponibles</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.l,
    padding: spacing.m,
    marginBottom: spacing.m,
    ...shadows.small,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    marginLeft: spacing.s,
    fontWeight: '600',
    color: colors.text,
    fontSize: 14,
  },
  tripType: {
    marginLeft: spacing.xs,
    color: colors.textSecondary,
    fontSize: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  city: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  durationContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.s,
  },
  duration: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  line: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
    marginBottom: -8, // Hack to align with arrow
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.background,
    paddingTop: spacing.s,
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  seatsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
