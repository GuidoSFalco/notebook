import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { myTickets } from '../data/mockData';
import { TripCard } from '../components/TripCard'; // Reusing TripCard or making a TicketCard

export const HistoryScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Viajes</Text>
      </View>

      <FlatList
        data={myTickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.ticketItem}>
            <View style={styles.ticketHeader}>
               <Text style={styles.status}>{item.status === 'active' ? 'ACTIVO' : 'PASADO'}</Text>
               <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.route}>{item.origin} → {item.destination}</Text>
            <Text style={styles.time}>{item.time} • Asiento {item.seat}</Text>
            <Text style={styles.id}>ID: {item.id}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tienes viajes próximos</Text>
          </View>
        }
      />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  listContent: {
    padding: spacing.m,
  },
  ticketItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  status: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  route: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  id: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  }
});
