
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

-------------------------------------------------------------------------
supongamos que en un evento, esta habilitado "Catering", "Tareas", "Gastos", "Galeria".
me gustaria que los usuarios que tengan acceso al evento pero no sean participantes, puedan, por ejemplo:
- ver las fotos "publicas" que se subieron los que participan en el evento y que son a modo de demostracion para que el resto de las personas las vean (habra fotos que seran subidas pero de manera privada para que solo las vean quienes participen en el evento)
- ver el Catering disponible que agregaron los parcitipantes del evento, es decir, por un lado los participantes administran todo el catering, y por otro lado, los demas usuarios podran ver lo disponible.
y asi con varias herramientas.
pensaba en agregar una pequeña seccion en la pantalla principal donde se puedan ver todas las cosas disponibles a ojos del publico, si tienes otra idea mejor planteala.


---------------------------------------------------------------------------


Diseñar e implementar un sistema de permisos diferenciado para usuarios con acceso al evento que no sean participantes, permitiéndoles visualizar contenido público específico de las herramientas habilitadas ("Catering", "Tareas", "Gastos", "Galería"). El sistema debe:

1. **Galería de fotos**: Crear un filtro que permita a los participantes marcar cada foto como "pública" o "privada" al subirla. Las fotos públicas deben ser visibles para todos los usuarios con acceso al evento, mientras que las privadas solo para participantes. Implementar indicadores visuales claros del estado de privacidad.

2. **Catering**: Desarrollar una vista de solo lectura para usuarios no participantes que muestre el menú completo, opciones disponibles, horarios y detalles del catering administrado por los participantes, sin permitir modificaciones. Incluir información sobre restricciones alimentarias y capacidad total.

3. **Tareas y Gastos**: Evaluar qué información de estas secciones puede ser relevante para usuarios no participantes (por ejemplo, tareas abiertas para colaboración o gastos totales del evento) y crear vistas filtradas que muestren solo datos apropiados.

4. **Panel público principal**: Implementar una sección "Vista Pública del Evento" en la pantalla principal que agregue todo el contenido accesible para usuarios no participantes. Esta sección debe incluir: carrusel de fotos públicas destacadas, resumen del catering disponible, próximas actividades públicas, y estadísticas generales del evento. Usar un diseño visual atractivo con tarjetas interactivas y filtros por categoría.

5. **Gestión de permisos**: Crear un sistema de roles que distinga entre "participante" (acceso completo) y "espectador" (acceso limitado), con la capacidad de que los organizadores puedan modificar estos permisos dinámicamente. Implementar verificaciones de permisos en backend y frontend.

6. **Testing y documentación**: Desarrollar pruebas unitarias y de integración para verificar que los usuarios no participantes solo acceden al contenido permitido. Documentar claramente qué puede ver cada tipo de usuario y crear guías de uso para los participantes sobre cómo marcar contenido como público.

----------------------------------------------------------------------------

Implementar una animación para que la imagen de cabecera se escale o se desvanezca suavemente al hacer scroll hacia abajo.



--------------------------------------------------------------


realiza las siguientes modificaciones en :
- agrega en la parte derecha de la pantalla un menu tipo indice donde se visualicen pequeños botones alineados verticalmente donde al presionar un boton envie al usuario a la parte especifica de la pantalla donde comienza esa seccion, para poder moverse rapido entre la informacion principal del evento, el menu, la galeria, etc.
- en los headers de cada seccion agrega opciones para expandir y contraer la seccion, para poder ver o ocultar la informacion de manera facil.

*/