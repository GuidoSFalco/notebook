import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateScreen() {
  const [step, setStep] = useState(1);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    location: '',
    description: '',
    price: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log(formData);
    alert('Event Created! (Mock)');
    setStep(1);
    setFormData({
        title: '',
        category: '',
        date: '',
        location: '',
        description: '',
        price: '',
    });
  };

  const renderStep1 = () => (
    <View>
      <ThemedText type="subtitle" style={styles.label}>What&apos;s the name of your event?</ThemedText>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="e.g. Summer Jazz Festival"
        placeholderTextColor={colors.placeholder}
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
      />
      
      <ThemedText type="subtitle" style={styles.label}>Category</ThemedText>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="e.g. Music, Art, Tech"
        placeholderTextColor={colors.placeholder}
        value={formData.category}
        onChangeText={(text) => setFormData({ ...formData, category: text })}
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <ThemedText type="subtitle" style={styles.label}>When is it happening?</ThemedText>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.placeholder}
        value={formData.date}
        onChangeText={(text) => setFormData({ ...formData, date: text })}
      />
      
      <ThemedText type="subtitle" style={styles.label}>Where is it?</ThemedText>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Location or Online URL"
        placeholderTextColor={colors.placeholder}
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
      />
    </View>
  );

  const renderStep3 = () => (
    <View>
      <ThemedText type="subtitle" style={styles.label}>Description</ThemedText>
      <TextInput
        style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border }]}
        placeholder="Tell people what this event is about..."
        placeholderTextColor={colors.placeholder}
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
      />
      
      <ThemedText type="subtitle" style={styles.label}>Price</ThemedText>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="e.g. Free, $25"
        placeholderTextColor={colors.placeholder}
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
            <ThemedText type="title">Create Event</ThemedText>
            <ThemedText style={{ color: colors.icon }}>Step {step} of 3</ThemedText>
        </View>

        <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%`, backgroundColor: colors.tint }]} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            {step > 1 && (
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ThemedText>Back</ThemedText>
                </TouchableOpacity>
            )}
            
            <TouchableOpacity 
                onPress={step === 3 ? handleSubmit : handleNext} 
                style={[styles.nextButton, { backgroundColor: colors.tint, marginLeft: step === 1 ? 'auto' : 0 }]}
            >
                <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>
                    {step === 3 ? 'Publish' : 'Next'}
                </ThemedText>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    padding: Spacing.l,
  },
  label: {
    marginBottom: Spacing.s,
    marginTop: Spacing.m,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    fontSize: 16,
    marginBottom: Spacing.s,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: Spacing.m,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.m,
  },
  nextButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.l,
  },
});
