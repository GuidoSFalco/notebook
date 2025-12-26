import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { SeatSelectionScreen } from '../screens/SeatSelectionScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { TicketScreen } from '../screens/TicketScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { colors } from '../theme/colors';
import { Home, Ticket, User } from 'lucide-react-native';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder Profile Screen
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
    <Text>Perfil de Usuario</Text>
  </View>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Mis Viajes" 
        component={HistoryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ticket color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerTintColor: colors.primary,
          headerBackTitleVisible: false,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen 
          name="HomeTab" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen} 
          options={{ title: 'Resultados de Búsqueda' }}
        />
        <Stack.Screen 
          name="SeatSelection" 
          component={SeatSelectionScreen} 
          options={{ title: 'Selección de Asientos' }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen} 
          options={{ title: 'Pago' }}
        />
        <Stack.Screen 
          name="Ticket" 
          component={TicketScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
