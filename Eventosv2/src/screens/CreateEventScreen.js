import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { CATEGORIES } from '../data/mockData';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: 'text-outline' },
  { id: 2, title: 'Date & Time', icon: 'calendar-outline' },
  { id: 3, title: 'Location', icon: 'location-outline' },
  { id: 4, title: 'Details', icon: 'image-outline' },
];

export default function CreateEventScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    price: '',
    description: '',
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Publish
      Alert.alert("Success", "Event Published Successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Explore") }
      ]);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepContainer}>
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <View key={step.id} style={styles.stepWrapper}>
              <View style={[
                styles.stepCircle, 
                isActive && styles.stepActive,
                isCompleted && styles.stepCompleted
              ]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                ) : (
                  <Text style={[styles.stepNumber, isActive && { color: '#FFF' }]}>{step.id}</Text>
                )}
              </View>
              {index < STEPS.length - 1 && (
                <View style={[styles.stepLine, isCompleted && { backgroundColor: COLORS.primary }]} />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>What's the event?</Text>
            <Text style={styles.stepSubtitle}>Give it a catchy title and category.</Text>
            
            <Text style={styles.label}>Event Title</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Summer Jazz Festival"
              placeholderTextColor={COLORS.light.textSecondary}
              value={formData.title}
              onChangeText={(text) => updateForm('title', text)}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.slice(1).map(cat => (
                <TouchableOpacity 
                  key={cat.id} 
                  style={[
                    styles.categoryOption, 
                    formData.category === cat.id && styles.categoryOptionSelected
                  ]}
                  onPress={() => updateForm('category', cat.id)}
                >
                  <Ionicons 
                    name={cat.icon} 
                    size={24} 
                    color={formData.category === cat.id ? '#FFF' : COLORS.light.textSecondary} 
                  />
                  <Text style={[
                    styles.categoryOptionText,
                    formData.category === cat.id && { color: '#FFF' }
                  ]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>When is it happening?</Text>
            <Text style={styles.stepSubtitle}>Set the date and time.</Text>
            
            <Text style={styles.label}>Date</Text>
            <TextInput 
              style={styles.input} 
              placeholder="DD/MM/YYYY"
              placeholderTextColor={COLORS.light.textSecondary}
              value={formData.date}
              onChangeText={(text) => updateForm('date', text)}
            />

            <Text style={styles.label}>Time</Text>
            <TextInput 
              style={styles.input} 
              placeholder="HH:MM"
              placeholderTextColor={COLORS.light.textSecondary}
              value={formData.time}
              onChangeText={(text) => updateForm('time', text)}
            />
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Where is it?</Text>
            <Text style={styles.stepSubtitle}>Add a location so people can find it.</Text>
            
            <Text style={styles.label}>Location Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Central Park"
              placeholderTextColor={COLORS.light.textSecondary}
              value={formData.location}
              onChangeText={(text) => updateForm('location', text)}
            />

            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={40} color={COLORS.light.textSecondary} />
              <Text style={{ marginTop: 10, color: COLORS.light.textSecondary }}>Map Preview</Text>
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Final Details</Text>
            <Text style={styles.stepSubtitle}>Add a description and price.</Text>
            
            <Text style={styles.label}>Price</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. $25 or Free"
              placeholderTextColor={COLORS.light.textSecondary}
              value={formData.price}
              onChangeText={(text) => updateForm('price', text)}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Tell people what to expect..."
              placeholderTextColor={COLORS.light.textSecondary}
              multiline
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) => updateForm('description', text)}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={{ width: 24 }} />
        </View>

        {renderStepIndicator()}

        <ScrollView contentContainerStyle={styles.content}>
          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentStep === STEPS.length ? 'Publish Event' : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.light.text,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 40,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.light.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  stepActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepCompleted: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.light.textSecondary,
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: COLORS.light.border,
    marginHorizontal: 5,
  },
  content: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.light.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: COLORS.light.textSecondary,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.text,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.light.inputBg,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: COLORS.light.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    height: 120,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  categoryOption: {
    width: '48%',
    backgroundColor: COLORS.light.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    marginRight: '2%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  categoryOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryOptionText: {
    marginTop: 8,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: COLORS.light.inputBg,
    borderRadius: 12,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
    backgroundColor: COLORS.light.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
