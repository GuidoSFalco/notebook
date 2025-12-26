import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Button } from '../components/Button';

// Mock seat layout (1 = occupied, 0 = available)
const SEAT_LAYOUT = [
  [1, 0, null, 0, 0],
  [0, 0, null, 1, 1],
  [0, 0, null, 0, 0],
  [1, 1, null, 0, 0],
  [0, 0, null, 0, 0],
  [0, 0, null, 0, 0],
  [0, 0, null, 1, 0],
  [0, 0, null, 0, 0],
];

export const SeatSelectionScreen = ({ navigation, route }) => {
  const { trip } = route.params;
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatPress = (rowIndex, colIndex) => {
    const seatId = `${rowIndex + 1}${String.fromCharCode(65 + colIndex)}`;
    setSelectedSeat(seatId);
  };

  const handleConfirm = () => {
    navigation.navigate('Payment', { trip, seat: selectedSeat });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Elige tu asiento</Text>
        <Text style={styles.subtitle}>{trip.origin} → {trip.destination}</Text>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.seatLegend, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]} />
          <Text style={styles.legendText}>Libre</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.seatLegend, { backgroundColor: colors.border }]} />
          <Text style={styles.legendText}>Ocupado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.seatLegend, { backgroundColor: colors.secondary }]} />
          <Text style={styles.legendText}>Seleccionado</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.busContainer}>
        <View style={styles.busBody}>
          <View style={styles.driverSection}>
            <Text style={styles.driverText}>Frente</Text>
          </View>
          
          {SEAT_LAYOUT.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((status, colIndex) => {
                if (status === null) return <View key={colIndex} style={styles.aisle} />;
                
                const seatId = `${rowIndex + 1}${String.fromCharCode(65 + colIndex)}`;
                const isSelected = selectedSeat === seatId;
                const isOccupied = status === 1;

                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      styles.seat,
                      isOccupied && styles.seatOccupied,
                      isSelected && styles.seatSelected
                    ]}
                    disabled={isOccupied}
                    onPress={() => handleSeatPress(rowIndex, colIndex)}
                  >
                    <Text style={[
                      styles.seatText, 
                      isSelected && { color: colors.white }
                    ]}>{seatId}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${trip.price}</Text>
        </View>
        <Button 
          title="Continuar" 
          onPress={handleConfirm}
          disabled={!selectedSeat}
          style={{ flex: 1, marginLeft: spacing.m }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.m,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.m,
    backgroundColor: colors.background,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.s,
  },
  seatLegend: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  busContainer: {
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
  busBody: {
    backgroundColor: colors.white,
    padding: spacing.l,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  driverSection: {
    alignItems: 'center',
    marginBottom: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.s,
  },
  driverText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  aisle: {
    width: 40,
  },
  seat: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: colors.surface,
  },
  seatOccupied: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  seatSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  seatText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 0.5,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
});
