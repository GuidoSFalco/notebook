import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ProfessionalDetailScreen from '../screens/ProfessionalDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfessionalValidationScreen from '../screens/ProfessionalValidationScreen';
import RescheduleScreen from '../screens/RescheduleScreen';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, user } = useAuth();
  
  // We can add a loading state check here if AuthContext is checking storage
  // For now assuming it's instant or handled inside Context

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.light.background },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main Stack
          <>
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
            <Stack.Screen
                name="ProfessionalValidation"
                component={ProfessionalValidationScreen}
                options={{
                    headerShown: true,
                    title: 'Validación',
                    headerTintColor: COLORS.light.text,
                    headerStyle: { backgroundColor: COLORS.light.background },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen 
              name="Reschedule" 
              component={RescheduleScreen} 
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Cambiar Turno',
                headerBackTitle: 'Cerrar',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
