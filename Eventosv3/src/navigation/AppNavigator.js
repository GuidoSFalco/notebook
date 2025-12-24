import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import TabNavigator from './TabNavigator';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import { colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const scheme = useColorScheme();
  const MyTheme = scheme === 'dark' ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...colors.dark,
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...colors.light,
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="EventDetails" 
          component={EventDetailsScreen} 
          options={{ presentation: 'modal' }} // or card, but modal is nice for details
        />
        <Stack.Screen 
          name="CreateEvent" 
          component={CreateEventScreen} 
          options={{ presentation: 'fullScreenModal' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
