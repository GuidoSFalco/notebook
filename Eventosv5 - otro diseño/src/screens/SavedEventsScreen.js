import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import EventCard from '../components/EventCard';
import { EVENTS } from '../assets/data';

export default function SavedEventsScreen({ navigation }) {
  // Mock saved events
  const [savedEvents, setSavedEvents] = useState(EVENTS.slice(1, 4));

  const removeEvent = (id) => {
    setSavedEvents(current => current.filter(e => e.id !== id));
  };

  const confirmRemoveEvent = (id) => {
    Alert.alert(
      'Eliminar de guardados',
      '¿Quieres quitar este evento de tus guardados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeEvent(id),
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Guardados</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={savedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <View style={{ flex: 1 }}>
              <EventCard 
                event={item} 
                layout="horizontal"
                onPress={() => navigation.navigate('EventDetail', { event: item })}
              />
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => confirmRemoveEvent(item.id)}
            >
              <Trash2 size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes eventos guardados</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.l,
    paddingVertical: SIZES.m,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  listContent: {
    padding: SIZES.l,
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  removeButton: {
    padding: SIZES.s,
    marginLeft: SIZES.s,
    marginTop: SIZES.s,
  },
  emptyContainer: {
    padding: SIZES.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
});
