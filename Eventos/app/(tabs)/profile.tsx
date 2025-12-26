import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import Button from '@/components/Button';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatarPlaceholder} />
      <Text style={styles.name}>Guest User</Text>
      <Text style={styles.bio}>Love exploring new events!</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statVal}>0</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <Button 
        title="Sign In / Sign Up" 
        onPress={() => {}} 
        variant="primary"
        style={{ marginTop: 40, width: 200 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E1E1E1',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
});
