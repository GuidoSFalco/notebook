
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Event } from '@/constants/events';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: event.image }} style={styles.image} />
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
          {event.title}
        </ThemedText>
        <View style={styles.row}>
            <IconSymbol name="calendar" size={16} color={colors.icon} />
            <ThemedText style={[styles.infoText, { color: colors.icon }]}>
                {new Date(event.date).toLocaleDateString()}
            </ThemedText>
        </View>
        <View style={styles.row}>
            <IconSymbol name="mappin.and.ellipse" size={16} color={colors.icon} />
             <ThemedText style={[styles.infoText, { color: colors.icon }]} numberOfLines={1}>
                {event.location}
             </ThemedText>
        </View>
        <View style={styles.footer}>
             <ThemedText type="defaultSemiBold" style={{ color: colors.tint }}>
                {event.price}
             </ThemedText>
             <ThemedText style={{ fontSize: 12, color: colors.icon }}>
                {event.category}
             </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.l,
    overflow: 'hidden',
    marginBottom: Spacing.m,
    borderWidth: 1,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: Spacing.m,
  },
  title: {
    fontSize: 18,
    marginBottom: Spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.s,
  },
  infoText: {
    fontSize: 14,
  },
  footer: {
      marginTop: Spacing.s,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  }
});
