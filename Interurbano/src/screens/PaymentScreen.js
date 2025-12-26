import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { CreditCard } from 'lucide-react-native';

export const PaymentScreen = ({ navigation, route }) => {
  const { trip, seat } = route.params;
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // Mock payment processing
    setTimeout(() => {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }, { 
          name: 'Ticket', 
          params: { 
            trip, 
            seat,
            ticketId: `T-${Math.floor(Math.random() * 10000)}`
          } 
        }],
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.title}>Resumen de Compra</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Viaje</Text>
            <Text style={styles.value}>{trip.origin} - {trip.destination}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Horario</Text>
            <Text style={styles.value}>{trip.departureTime}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Asiento</Text>
            <Text style={styles.value}>{seat}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total a Pagar</Text>
            <Text style={styles.totalValue}>${trip.price}</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          <Input 
            label="Número de Tarjeta" 
            placeholder="0000 0000 0000 0000"
            icon={<CreditCard size={20} color={colors.textSecondary} />}
          />
          <View style={styles.halfInputs}>
            <View style={{ flex: 1, marginRight: spacing.s }}>
              <Input label="Vencimiento" placeholder="MM/YY" />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.s }}>
              <Input label="CVV" placeholder="123" secureTextEntry />
            </View>
          </View>
          <Input label="Titular" placeholder="Como aparece en la tarjeta" />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={`Pagar $${trip.price}`} 
          onPress={handlePay}
          loading={loading}
          variant="secondary"
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
  content: {
    padding: spacing.m,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.l,
    borderRadius: borderRadius.l,
    marginBottom: spacing.l,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.m,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.m,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  paymentSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.m,
    color: colors.text,
  },
  halfInputs: {
    flexDirection: 'row',
  },
  footer: {
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
