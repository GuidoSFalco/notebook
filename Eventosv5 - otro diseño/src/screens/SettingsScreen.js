import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { ChevronLeft, Moon, Globe, Bell, User, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(true);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Configuración</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  const renderSectionHeader = (title) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderItem = (icon, label, valueComponent, onPress) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={onPress} 
      disabled={!onPress}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      {valueComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.content}>
        
        {renderSectionHeader('General')}
        {renderItem(
          <Globe size={20} color={COLORS.primary} />,
          'Idioma',
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>Español</Text>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </View>,
          () => {}
        )}
        {renderItem(
          <Moon size={20} color={COLORS.primary} />,
          'Modo Oscuro',
          <Switch 
            value={isDarkMode} 
            onValueChange={setIsDarkMode}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={'#fff'}
          />
        )}
        {renderItem(
          <Bell size={20} color={COLORS.primary} />,
          'Notificaciones',
          <Switch 
            value={areNotificationsEnabled} 
            onValueChange={setAreNotificationsEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={'#fff'}
          />
        )}

        {renderSectionHeader('Cuenta')}
        {renderItem(
          <User size={20} color={COLORS.primary} />,
          'Información de la cuenta',
          <ChevronRight size={20} color={COLORS.textSecondary} />,
          () => {}
        )}

      </ScrollView>
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
  content: {
    padding: SIZES.l,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    marginTop: SIZES.l,
    marginBottom: SIZES.m,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.s,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  itemLabel: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginRight: SIZES.s,
  },
});
