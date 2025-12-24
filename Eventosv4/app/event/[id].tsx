
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { StyleSheet, Image, ScrollView, View, TouchableOpacity, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_EVENTS } from '@/constants/events';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const event = MOCK_EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Event not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: event.image }} style={styles.image} />
                <TouchableOpacity 
                    style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                    onPress={() => router.back()}
                >
                     <IconSymbol name="chevron.left" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={[styles.content, { backgroundColor: colors.background }]}>
                <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>{event.category}</ThemedText>
                </View>
                
                <ThemedText type="title" style={styles.title}>{event.title}</ThemedText>
                
                <View style={styles.organizerRow}>
                    <View style={[styles.organizerAvatar, { backgroundColor: colors.border }]} />
                    <View>
                        <ThemedText style={{ fontSize: 12, color: colors.icon }}>Organized by</ThemedText>
                        <ThemedText type="defaultSemiBold">{event.organizer}</ThemedText>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.infoRow}>
                        <View style={[styles.iconBox, { backgroundColor: colors.border }]}>
                             <IconSymbol name="calendar" size={20} color={colors.text} />
                        </View>
                        <View>
                             <ThemedText type="defaultSemiBold">{new Date(event.date).toDateString()}</ThemedText>
                             <ThemedText style={{ color: colors.icon }}>{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</ThemedText>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={[styles.iconBox, { backgroundColor: colors.border }]}>
                             <IconSymbol name="mappin.and.ellipse" size={20} color={colors.text} />
                        </View>
                        <View>
                             <ThemedText type="defaultSemiBold">{event.location}</ThemedText>
                             <ThemedText style={{ color: colors.icon }}>View on map</ThemedText>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={{ marginBottom: Spacing.s }}>About</ThemedText>
                    <ThemedText style={{ lineHeight: 24, color: colors.icon }}>{event.description}</ThemedText>
                </View>
            </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <View>
                <ThemedText style={{ color: colors.icon, fontSize: 12 }}>Price</ThemedText>
                <ThemedText type="title" style={{ color: colors.tint }}>{event.price}</ThemedText>
            </View>
            <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.tint }]}>
                <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Get Ticket</ThemedText>
            </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    padding: Spacing.l,
    marginTop: -30,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.xl,
  },
  badge: {
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: BorderRadius.s,
    marginBottom: Spacing.m,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    marginBottom: Spacing.m,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.l,
    gap: Spacing.m,
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
    gap: Spacing.m,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.l,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  bookButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.l,
  },
});
