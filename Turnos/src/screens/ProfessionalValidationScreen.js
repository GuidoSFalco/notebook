import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function ProfessionalValidationScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { requestProfessionalValidation, professionalStatus, mockApproveValidation } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await requestProfessionalValidation({});
      Alert.alert('Solicitud enviada', 'Tu solicitud está en revisión. Te notificaremos cuando sea aprobada.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockApprove = () => {
      mockApproveValidation();
      Alert.alert('Demo', 'Validación aprobada automáticamente para demo.');
      navigation.goBack();
  };

  const renderContent = () => {
    if (professionalStatus === 'pending') {
      return (
        <View style={styles.statusContainer}>
          <Clock size={64} color={COLORS.warning} />
          <Text style={styles.statusTitle}>Validación Pendiente</Text>
          <Text style={styles.statusText}>
            Estamos revisando tu documentación. Este proceso puede demorar hasta 48 horas hábiles.
          </Text>
          <Button title="Volver" onPress={() => navigation.goBack()} variant="outline" style={styles.button} />
          
          {/* Backdoor for demo */}
          <Button title="[Demo] Aprobar ahora" onPress={handleMockApprove} style={[styles.button, { marginTop: SPACING.xl }]} />
        </View>
      );
    }

    if (professionalStatus === 'rejected') {
        return (
          <View style={styles.statusContainer}>
            <AlertCircle size={64} color={COLORS.error} />
            <Text style={styles.statusTitle}>Solicitud Rechazada</Text>
            <Text style={styles.statusText}>
              Lamentablemente no pudimos validar tu perfil. Por favor contacta a soporte.
            </Text>
            <Button title="Volver" onPress={() => navigation.goBack()} variant="outline" style={styles.button} />
          </View>
        );
      }

    return (
      <>
        <Text style={styles.description}>
          Para operar como profesional en Turnos, necesitamos validar tu identidad y credenciales.
          Por favor, sube la documentación requerida.
        </Text>

        <View style={styles.uploadSection}>
          <View style={styles.uploadCard}>
            <Upload size={32} color={COLORS.primary} />
            <Text style={styles.uploadText}>Subir DNI / Identificación</Text>
          </View>
          
          <View style={styles.uploadCard}>
            <Upload size={32} color={COLORS.primary} />
            <Text style={styles.uploadText}>Subir Matrícula / Certificado</Text>
          </View>
        </View>

        <Button 
          title="Enviar Solicitud" 
          onPress={handleSubmit} 
          loading={loading}
          style={styles.button}
        />
      </>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Validación Profesional</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.light.text,
    textAlign: 'center',
  },
  content: {
    padding: SPACING.l,
  },
  description: {
    fontSize: 16,
    color: COLORS.light.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  uploadSection: {
    marginBottom: SPACING.xl,
  },
  uploadCard: {
    backgroundColor: COLORS.light.card,
    borderRadius: RADIUS.m,
    padding: SPACING.l,
    alignItems: 'center',
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: SPACING.s,
    color: COLORS.primary,
    fontWeight: '600',
  },
  button: {
    marginTop: SPACING.m,
  },
  statusContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.light.text,
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  statusText: {
    fontSize: 16,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});
