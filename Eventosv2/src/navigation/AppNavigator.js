import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { View, Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : 10,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: COLORS.light.surface,
          borderRadius: 15,
          height: 60,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            android: {
              elevation: 5,
            },
          }),
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.light.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Create') {
            iconName = 'add-circle';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Special styling for Create button
          if (route.name === 'Create') {
             return (
               <View style={{
                 top: -20,
                 width: 60,
                 height: 60,
                 borderRadius: 30,
                 backgroundColor: COLORS.primary,
                 justifyContent: 'center',
                 alignItems: 'center',
                 shadowColor: COLORS.primary,
                 shadowOffset: { width: 0, height: 5 },
                 shadowOpacity: 0.3,
                 shadowRadius: 5,
                 elevation: 5,
               }}>
                 <Ionicons name="add" size={30} color="#FFF" />
               </View>
             );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={HomeScreen} />
      <Tab.Screen 
        name="Create" 
        component={CreateEventScreen} 
        options={{
          tabBarStyle: { display: 'none' } // Hide tab bar in creation wizard if needed
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={HomeTabs} />
        <Stack.Screen 
          name="EventDetails" 
          component={EventDetailsScreen}
          options={{ headerShown: true, title: '', headerTransparent: true, headerTintColor: '#fff' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
