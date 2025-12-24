import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { EVENTS } from '../constants/mockData';
import EventCard from '../components/EventCard';
import { spacing, typography } from '../constants/theme';
import { useTheme } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const renderItem = ({ item }) => (
    <EventCard 
      event={item} 
      onPress={() => navigation.navigate('EventDetails', { event: item })} 
    />
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.greeting, { color: colors.text }]}>Discover</Text>
      <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>Find amazing events near you</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={useColorScheme() === 'dark' ? 'light-content' : 'dark-content'} />
      <FlatList
        data={EVENTS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.m,
  },
  header: {
    marginTop: spacing.m,
    marginBottom: spacing.l,
  },
  greeting: {
    ...typography.header,
  },
  subGreeting: {
    ...typography.body,
    marginTop: spacing.xs,
  },
});

export default HomeScreen;
