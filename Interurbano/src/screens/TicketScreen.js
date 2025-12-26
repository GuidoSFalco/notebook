import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Button } from '../components/Button';
import { QrCode, CheckCircle } from 'lucide-react-native';

export const TicketScreen = ({ navigation, route }) => {
  const { trip, seat, ticketId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <CheckCircle size={64} color={colors.secondary} />
          <Text style={styles.successTitle}>¡Viaje Confirmado!</Text>
          <Text style={styles.successMessage}>Tu boleto ha sido generado exitosamente.</Text>
        </View>

        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Text style={styles.company}>{trip.company}</Text>
            <Text style={styles.ticketId}>#{ticketId}</Text>
          </View>
          
          <View style={styles.routeContainer}>
            <View>
              <Text style={styles.cityLabel}>Origen</Text>
              <Text style={styles.city}>{trip.origin}</Text>
              <Text style={styles.time}>{trip.departureTime}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cityLabel}>Destino</Text>
              <Text style={styles.city}>{trip.destination}</Text>
              <Text style={styles.time}>{trip.arrivalTime}</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View>
              <Text style={styles.detailLabel}>Asiento</Text>
              <Text style={styles.detailValue}>{seat}</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Precio</Text>
              <Text style={styles.detailValue}>${trip.price}</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Clase</Text>
              <Text style={styles.detailValue}>{trip.type}</Text>
            </View>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.qrContainer}>
            <QrCode size={150} color="black" />
            <Text style={styles.qrText}>Escanea este código al subir</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Volver al Inicio" 
          variant="outline"
          onPress={() => navigation.navigate('HomeTab')} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Blue background for success vibe
  },
  content: {
    flex: 1,
    padding: spacing.m,
    justifyContent: 'center',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: spacing.m,
  },
  successMessage: {
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  ticketCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.l,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.l,
  },
  company: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  ticketId: {
    color: colors.textSecondary,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.l,
  },
  cityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  city: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.l,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: spacing.l,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrText: {
    marginTop: spacing.m,
    color: colors.textSecondary,
    fontSize: 12,
  },
  footer: {
    padding: spacing.m,
  },
});
