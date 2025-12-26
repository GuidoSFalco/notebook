import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export const Marker = () => null;

const MapView = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    animateCamera: () => {},
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        El mapa interactivo está optimizado para la aplicación móvil (iOS/Android).
      </Text>
      <Text style={styles.subtext}>
        En la versión web, utiliza el listado para buscar profesionales.
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  text: {
    fontSize: 16,
    color: COLORS.light.text,
    textAlign: 'center',
    marginBottom: SPACING.m,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 14,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
  },
});

export default MapView;
