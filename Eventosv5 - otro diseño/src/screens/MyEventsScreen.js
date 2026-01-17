import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react-native';
import EventCard from '../components/EventCard';
import { EVENTS } from '../assets/data';

export default function MyEventsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'past'
  const [myEvents, setMyEvents] = useState(EVENTS.slice(0, 3));

  const activeEvents = myEvents.slice(0, 2);
  const pastEvents = myEvents.slice(2, 3);

  const displayEvents = activeTab === 'active' ? activeEvents : pastEvents;

  const handleDeleteEvent = (id) => {
    Alert.alert(
      'Eliminar evento',
      '¿Estás seguro de que quieres eliminar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setMyEvents((current) => current.filter((event) => event.id !== id));
          },
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
      <Text style={styles.headerTitle}>Mis Eventos</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'active' && styles.activeTab]}
        onPress={() => setActiveTab('active')}
      >
        <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Activos</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'past' && styles.activeTab]}
        onPress={() => setActiveTab('past')}
      >
        <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Pasados</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      
      <FlatList
        data={displayEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <View style={{ flex: 1 }}>
              <EventCard 
                event={item} 
                layout="vertical"
                onPress={() => navigation.navigate('EventDetail', { event: item })}
              />
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('EditEvent', { event: item, mode: 'edit' })}
              >
                <Edit size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteEvent(item.id)}
              >
                <Trash2 size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes eventos {activeTab === 'active' ? 'activos' : 'pasados'}</Text>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.l,
    marginBottom: SIZES.m,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.m,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  listContent: {
    padding: SIZES.l,
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actionsContainer: {
    marginLeft: SIZES.xs,
    alignItems: 'center',
  },
  editButton: {
    padding: SIZES.s,
    marginTop: SIZES.s,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  deleteButton: {
    padding: SIZES.s,
    marginTop: SIZES.xs,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
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
