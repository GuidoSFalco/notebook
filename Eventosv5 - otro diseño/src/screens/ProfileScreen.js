
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { Settings, LogOut, Ticket, Heart, Calendar } from 'lucide-react-native';

const MENU_ITEMS = [
  { icon: Ticket, label: 'Mis Tickets', badge: 2 },
  { icon: Heart, label: 'Guardados', badge: 5, route: 'SavedEvents' },
  { icon: Calendar, label: 'Mis Eventos', badge: 1, route: 'MyEvents' },
  { icon: Settings, label: 'Configuración', route: 'Settings' },
  { icon: LogOut, label: 'Cerrar Sesión', color: COLORS.error },
];

export default function ProfileScreen({ navigation }) {
  const handleNavigation = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
    } else {
      Alert.alert("Próximamente", "Esta funcionalidad estará disponible pronto.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }} 
              style={styles.avatar} 
            />
            <View style={styles.onlineBadge} />
          </View>
          <Text style={styles.name}>Guido</Text>
          <Text style={styles.bio}>Amante de la música y el arte 🎨🎵</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Eventos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>48</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Seguidos</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => handleNavigation(item)}
            >
              <View style={[styles.menuIconBox, item.color && { backgroundColor: 'rgba(227, 52, 47, 0.1)' }]}>
                <item.icon size={24} color={item.color || COLORS.primary} />
              </View>
              <Text style={[styles.menuLabel, item.color && { color: item.color }]}>
                {item.label}
              </Text>
              {item.badge && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
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
    padding: SIZES.l,
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.m,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.surface,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 4,
  },
  bio: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.l,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.m,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.cardRadius,
    ...SHADOWS.medium,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.l,
  },
  menuContainer: {
    paddingHorizontal: SIZES.l,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.m,
    ...SHADOWS.small,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  menuLabel: {
    flex: 1,
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  menuBadgeText: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 12,
  },
});
