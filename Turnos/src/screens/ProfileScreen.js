import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Settings, CreditCard, Bell, LogOut, ChevronRight, Briefcase, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const MenuItem = ({ icon: Icon, title, onPress, rightElement }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <View style={styles.iconContainer}>
        <Icon size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    {rightElement || <ChevronRight size={20} color={COLORS.light.textSecondary} />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, role, switchRole, professionalStatus } = useAuth();
  const navigation = useNavigation();

  const handleRoleSwitch = () => {
    if (role === 'client') {
      if (professionalStatus === 'approved') {
        switchRole();
      } else {
        navigation.navigate('ProfessionalValidation');
      }
    } else {
      switchRole();
    }
  };

  const getRoleLabel = () => {
      if (role === 'professional') return 'Modo Profesional';
      if (professionalStatus === 'pending') return 'Validación Pendiente';
      return 'Modo Cliente';
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
            <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
                style={styles.avatar} 
            />
            <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
            <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
            <View style={[styles.roleBadge, role === 'professional' ? styles.roleBadgeProfessional : styles.roleBadgeClient]}>
                <Text style={styles.roleBadgeText}>{role === 'professional' ? 'Profesional' : 'Cliente'}</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modo</Text>
            <View style={styles.menuContainer}>
                <MenuItem 
                    icon={role === 'client' ? User : Briefcase} 
                    title={role === 'client' ? "Cambiar a Profesional" : "Cambiar a Cliente"}
                    onPress={handleRoleSwitch}
                    rightElement={
                        <Switch 
                            value={role === 'professional'}
                            onValueChange={handleRoleSwitch}
                            trackColor={{ false: COLORS.light.border, true: COLORS.primary }}
                        />
                    }
                />
            </View>
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
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
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
    marginBottom: SPACING.m,
  },
  roleBadge: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.light.border,
  },
  roleBadgeProfessional: {
      backgroundColor: COLORS.primary,
  },
  roleBadgeClient: {
      backgroundColor: COLORS.light.border,
  },
  roleBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFF',
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
    borderBottomColor: COLORS.light.background,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.light.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light.card,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
  },
  logoutText: {
    marginLeft: SPACING.s,
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
  },
});
