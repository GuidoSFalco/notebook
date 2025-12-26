import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ProfessionalDetailScreen from '../screens/ProfessionalDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.light.background },
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="ProfessionalDetail" 
          component={ProfessionalDetailScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: COLORS.light.text,
          }} 
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen} 
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Reservar Turno',
            headerBackTitle: 'Cerrar',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
