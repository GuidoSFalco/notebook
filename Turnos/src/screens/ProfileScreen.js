import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Settings, CreditCard, Bell, LogOut, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

const MenuItem = ({ icon: Icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <View style={styles.iconContainer}>
        <Icon size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    <ChevronRight size={20} color={COLORS.light.textSecondary} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
            <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
                style={styles.avatar} 
            />
            <Text style={styles.name}>Guido Cliente</Text>
            <Text style={styles.email}>guido@example.com</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
            <View style={styles.menuContainer}>
                <MenuItem icon={CreditCard} title="Métodos de Pago" onPress={() => {}} />
                <MenuItem icon={Bell} title="Notificaciones" onPress={() => {}} />
                <MenuItem icon={Settings} title="Configuración" onPress={() => {}} />
            </View>
        </View>

        <View style={styles.section}>
            <TouchableOpacity style={styles.logoutButton}>
                <LogOut size={20} color={COLORS.error} />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  content: {
    padding: SPACING.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.m,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: 16,
    color: COLORS.light.textSecondary,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.light.text,
    marginBottom: SPACING.m,
    marginLeft: SPACING.xs,
  },
  menuContainer: {
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.l,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.s,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.light.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
    gap: SPACING.s,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '600',
  },
});
