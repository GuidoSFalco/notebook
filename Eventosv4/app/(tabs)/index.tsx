import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/EventCard';
import { ThemedText } from '@/components/themed-text';
import { MOCK_EVENTS } from '@/constants/events';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Discover</ThemedText>
        <ThemedText style={{ color: colors.icon, marginTop: 4 }}>Find your next experience</ThemedText>
      </View>
      <FlatList
        data={MOCK_EVENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => router.push(`/event/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.m,
    paddingTop: Spacing.s,
    paddingBottom: Spacing.m,
  },
  listContent: {
    padding: Spacing.m,
    paddingTop: 0,
    paddingBottom: 100, // Space for tab bar
  },
});
