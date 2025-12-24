import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography } from '../constants/theme';

const CreateEventScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    location: '',
    price: '',
    description: '',
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Submit
      alert('Event Created!');
      navigation.goBack();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={[
          styles.stepDot, 
          { backgroundColor: s <= step ? colors.primary : colors.border }
        ]} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevStep} style={styles.backButton}>
          <Ionicons name={step === 1 ? "close" : "arrow-back"} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {step === 1 ? 'Event Basics' : step === 2 ? 'Date & Location' : 'Final Details'}
        </Text>
        <View style={{ width: 24 }} /> 
      </View>
      
      {renderStepIndicator()}

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {step === 1 && (
            <View>
              <Text style={[styles.label, { color: colors.text }]}>What is the name of your event?</Text>
              <TextInput 
                style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground }]}
                placeholder="e.g. Jazz Night"
                placeholderTextColor={colors.textSecondary}
                value={formData.title}
                onChangeText={(t) => updateForm('title', t)}
                autoFocus
              />

              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <View style={styles.chipContainer}>
                {['Music', 'Art', 'Tech', 'Food'].map(cat => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[
                      styles.chip, 
                      { 
                        backgroundColor: formData.category === cat ? colors.primary : colors.inputBackground,
                        borderColor: formData.category === cat ? colors.primary : colors.border
                      }
                    ]}
                    onPress={() => updateForm('category', cat)}
                  >
                    <Text style={[
                      styles.chipText, 
                      { color: formData.category === cat ? '#FFF' : colors.text }
                    ]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={[styles.label, { color: colors.text }]}>When is it happening?</Text>
              <TextInput 
                style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground }]}
                placeholder="Date & Time"
                placeholderTextColor={colors.textSecondary}
                value={formData.date}
                onChangeText={(t) => updateForm('date', t)}
              />

              <Text style={[styles.label, { color: colors.text }]}>Where is it?</Text>
              <TextInput 
                style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground }]}
                placeholder="Location"
                placeholderTextColor={colors.textSecondary}
                value={formData.location}
                onChangeText={(t) => updateForm('location', t)}
              />

               <Text style={[styles.label, { color: colors.text }]}>Price</Text>
              <TextInput 
                style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground }]}
                placeholder="Price (or Free)"
                placeholderTextColor={colors.textSecondary}
                value={formData.price}
                onChangeText={(t) => updateForm('price', t)}
              />
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput 
                style={[styles.textArea, { color: colors.text, backgroundColor: colors.inputBackground }]}
                placeholder="Tell people what to expect..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={formData.description}
                onChangeText={(t) => updateForm('description', t)}
                textAlignVertical="top"
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={nextStep}
        >
          <Text style={styles.buttonText}>{step === 3 ? 'Publish Event' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.l,
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: spacing.l,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.s,
    marginTop: spacing.m,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: spacing.m,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    borderRadius: 12,
    padding: spacing.m,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: '500',
  },
  footer: {
    padding: spacing.l,
    borderTopWidth: 1,
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateEventScreen;
