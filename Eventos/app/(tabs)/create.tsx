import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useThemeColor } from '@/components/Themed';
import Input from '@/components/Input';
import Button from '@/components/Button';
import EventCard from '@/components/EventCard';
import { router } from 'expo-router';
import { Event } from '@/constants/types';

export default function CreateEventScreen() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState<Partial<Event>>({
    title: '',
    description: '',
    category: '',
    location: '',
    price: 0,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', // Default placeholder
    date: new Date().toISOString(),
  });

  const updateForm = (key: keyof Event, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.title || !form.description || !form.category) {
        Alert.alert('Missing Fields', 'Please fill in all fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.location) {
        Alert.alert('Missing Fields', 'Please enter a location.');
        return;
      }
      setStep(3);
    } else {
      // Submit
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'Event created successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's the event?</Text>
      <Input 
        label="Event Title" 
        placeholder="e.g. Summer Music Festival" 
        value={form.title}
        onChangeText={(t) => updateForm('title', t)}
      />
      <Input 
        label="Description" 
        placeholder="Tell us about the event..." 
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: 'top' }}
        value={form.description}
        onChangeText={(t) => updateForm('description', t)}
      />
      <Input 
        label="Category" 
        placeholder="e.g. Music, Art, Tech" 
        value={form.category}
        onChangeText={(t) => updateForm('category', t)}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>When & Where?</Text>
      <Input 
        label="Location" 
        placeholder="e.g. Central Park, NY" 
        value={form.location}
        onChangeText={(t) => updateForm('location', t)}
      />
      <Input 
        label="Price ($)" 
        placeholder="0" 
        keyboardType="numeric"
        value={form.price?.toString()}
        onChangeText={(t) => updateForm('price', Number(t))}
      />
      <Input 
        label="Date (ISO String for demo)" 
        placeholder="YYYY-MM-DD" 
        value={form.date}
        onChangeText={(t) => updateForm('date', t)}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Preview</Text>
      <Text style={styles.previewText}>This is how your event will look.</Text>
      
      <View style={{ pointerEvents: 'none' }}>
        <EventCard event={form as Event} />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <View style={styles.buttonRow}>
          {step > 1 && (
            <Button 
              title="Back" 
              onPress={handleBack} 
              variant="outline" 
              style={{ flex: 1, marginRight: 10 }} 
            />
          )}
          <Button 
            title={step === 3 ? "Publish Event" : "Next"} 
            onPress={handleNext} 
            loading={loading}
            style={{ flex: 1 }} 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF385C',
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  previewText: {
    marginBottom: 20,
    opacity: 0.6,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
