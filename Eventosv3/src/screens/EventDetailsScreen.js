import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography } from '../constants/theme';

const { width } = Dimensions.get('window');

const EventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.image} />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
          
          <View style={styles.organizerRow}>
            <Image source={{ uri: event.organizer.avatar }} style={styles.avatar} />
            <View>
              <Text style={[styles.hostedBy, { color: colors.textSecondary }]}>Hosted by</Text>
              <Text style={[styles.organizerName, { color: colors.text }]}>{event.organizer.name}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.inputBackground }]}>
                <Ionicons name="calendar-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>{event.date}</Text>
                <Text style={[styles.infoSub, { color: colors.textSecondary }]}>Add to calendar</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.inputBackground }]}>
                <Ionicons name="location-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>{event.location}</Text>
                <Text style={[styles.infoSub, { color: colors.textSecondary }]}>View on map</Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>About Event</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{event.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Price</Text>
          <Text style={[styles.priceValue, { color: colors.text }]}>{event.price}</Text>
        </View>
        <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.bookButtonText}>Get Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
  },
  shareButton: {
    position: 'absolute',
    top: 50,
    right: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: spacing.l,
    marginTop: -20,
    backgroundColor: 'transparent', // Let background color of container show? No, want rounded corners.
    // Actually, usually sheets pull up.
    // Let's just padding top normally.
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    ...typography.header,
    marginBottom: spacing.m,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.s,
  },
  hostedBy: {
    fontSize: 12,
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: spacing.l,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoSub: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: spacing.l,
  },
  sectionTitle: {
    ...typography.subheader,
    marginBottom: spacing.s,
  },
  description: {
    ...typography.body,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.l,
    paddingBottom: 40, // for safe area
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
  },
  priceLabel: {
    fontSize: 12,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  bookButton: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailsScreen;
