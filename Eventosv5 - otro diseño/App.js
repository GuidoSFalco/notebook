
import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <AppNavigator />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}


/* 
  TODO:
  - Implementar la lógica de autenticación y registro de usuarios.
  - Crear la pantalla de perfil del usuario.
  - Implementar la funcionalidad de edición de perfil.
  - Integrar la API de eventos para crear, editar y eliminar eventos.
  - Implementar la funcionalidad de búsqueda de eventos.
  - Crear la pantalla de detalles del evento.
  - Implementar la funcionalidad de compartir eventos.
  - Integrar la API de gastos para registrar y dividir gastos.
  - Crear la pantalla de lista de gastos.
  - Implementar la funcionalidad de agregar gastos.
  - Integrar la API de tareas para crear y asignar tareas.
  - Crear la pantalla de lista de tareas.
  - Implementar la funcionalidad de marcar tareas como completadas.
  - Integrar la API de galería para subir y mostrar imágenes.
  - Crear la pantalla de galería de eventos.
  - Implementar la funcionalidad de subir imágenes a la galería.

  
  dentro de la seccion de "Balances":
cada tarjeta deberia indicar cuanto le debe el usuario logueado a cada persona y cuanto le debe cada persona al usuario logueado.

al seleccionar una tarjeta se muestran los detalles, dentro de la pantalla de los detalles:
- Nombre de la persona
- Monto que debe
- Monto que recibe

 */