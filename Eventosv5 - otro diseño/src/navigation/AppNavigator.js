
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import EventDetailScreen from '../screens/EventDetailScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import SavedEventsScreen from '../screens/SavedEventsScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import TasksScreen from '../screens/TasksScreen';
import GalleryScreen from '../screens/GalleryScreen';
import OrganogramScreen from '../screens/OrganogramScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen 
          name="EventDetail" 
          component={EventDetailScreen} 
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name="CreateEvent" 
          component={CreateEventScreen} 
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name="EditEvent" 
          component={CreateEventScreen} 
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="MyEvents" component={MyEventsScreen} />
        <Stack.Screen name="SavedEvents" component={SavedEventsScreen} />
        <Stack.Screen name="Expenses" component={ExpensesScreen} />
        <Stack.Screen name="Tasks" component={TasksScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Organogram" component={OrganogramScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
