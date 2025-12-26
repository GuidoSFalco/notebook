import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MapPin, Calendar, Search } from 'lucide-react-native';

export const HomeScreen = ({ navigation }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    navigation.navigate('Results', {
      origin,
      destination,
      date
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, Viajero 👋</Text>
          <Text style={styles.title}>¿A dónde quieres ir hoy?</Text>
        </View>

        <View style={styles.searchCard}>
          <Input 
            label="Origen" 
            placeholder="¿Desde dónde sales?" 
            value={origin}
            onChangeText={setOrigin}
            icon={<MapPin size={20} color={colors.primary} />}
          />
          <Input 
            label="Destino" 
            placeholder="¿A dónde vas?" 
            value={destination}
            onChangeText={setDestination}
            icon={<MapPin size={20} color={colors.secondary} />}
          />
          <Input 
            label="Fecha de viaje" 
            placeholder="Hoy, 24 Dic" 
            value={date}
            onChangeText={setDate}
            icon={<Calendar size={20} color={colors.textSecondary} />}
          />
          
          <Button 
            title="Buscar Pasajes" 
            onPress={handleSearch} 
            style={{ marginTop: spacing.s }}
          />
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Búsquedas Recientes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentList}>
            {['Córdoba - Carlos Paz', 'Rio Cuarto - Córdoba', 'Alta Gracia - Córdoba'].map((item, index) => (
              <TouchableOpacity key={index} style={styles.recentChip}>
                <ClockIcon />
                <Text style={styles.recentText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ClockIcon = () => (
    <Search size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.m,
  },
  header: {
    marginTop: spacing.l,
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchCard: {
    backgroundColor: colors.surface,
    padding: spacing.l,
    borderRadius: borderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: spacing.xl,
  },
  recentSection: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.m,
    color: colors.text,
  },
  recentList: {
    flexDirection: 'row',
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.l,
    marginRight: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentText: {
    color: colors.text,
    fontSize: 14,
  }
});
