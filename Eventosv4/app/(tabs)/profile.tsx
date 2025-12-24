import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
            <ThemedText type="title">Profile</ThemedText>
            <TouchableOpacity>
                <IconSymbol name="gearshape" size={24} color={colors.icon} /> 
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.profileHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.border }]} />
                <ThemedText type="subtitle" style={styles.name}>Alex Johnson</ThemedText>
                <ThemedText style={{ color: colors.icon }}>alex.johnson@example.com</ThemedText>
            </View>

            <View style={[styles.statsRow, { borderColor: colors.border }]}>
                <View style={styles.statItem}>
                    <ThemedText type="title">12</ThemedText>
                    <ThemedText style={{ color: colors.icon, fontSize: 12 }}>Events</ThemedText>
                </View>
                <View style={styles.statItem}>
                    <ThemedText type="title">5</ThemedText>
                    <ThemedText style={{ color: colors.icon, fontSize: 12 }}>Organized</ThemedText>
                </View>
                <View style={styles.statItem}>
                    <ThemedText type="title">142</ThemedText>
                    <ThemedText style={{ color: colors.icon, fontSize: 12 }}>Following</ThemedText>
                </View>
            </View>

            <View style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Account</ThemedText>
                
                <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]}>
                    <IconSymbol name="person" size={20} color={colors.text} />
                    <ThemedText style={styles.menuText}>Personal Information</ThemedText>
                    <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]}>
                    <IconSymbol name="creditcard" size={20} color={colors.text} />
                    <ThemedText style={styles.menuText}>Payments</ThemedText>
                    <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                </TouchableOpacity>
            </View>

             <View style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Settings</ThemedText>
                
                <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]}>
                    <IconSymbol name="bell" size={20} color={colors.text} />
                    <ThemedText style={styles.menuText}>Notifications</ThemedText>
                    <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.m,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.m,
  },
  name: {
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.m,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  section: {
    marginBottom: Spacing.l,
  },
  sectionTitle: {
    marginBottom: Spacing.s,
    marginLeft: Spacing.s,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.s,
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.m,
  },
});
