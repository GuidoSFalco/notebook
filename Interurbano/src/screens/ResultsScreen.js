import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { TripCard } from '../components/TripCard';
import { trips } from '../data/mockData';

export const ResultsScreen = ({ navigation, route }) => {
  const { origin, destination, date } = route.params || {};

  const handleTripSelect = (trip) => {
    navigation.navigate('SeatSelection', { trip });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.routeText}>{origin || 'Origen'} → {destination || 'Destino'}</Text>
        <Text style={styles.dateText}>{date || 'Hoy'}</Text>
      </View>
      
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripCard trip={item} onPress={() => handleTripSelect(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: spacing.m,
  },
});
