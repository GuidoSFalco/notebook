import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native'; // Placeholder for Profile
import HomeScreen from '../screens/HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Placeholder</Text>
  </View>
);

// We will use a custom tab bar button for "Create" later or just navigate to stack
// But for now, let's keep it simple.

const TabNavigator = () => {
  const { colors: themeColors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: themeColors.background,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Create" 
        component={View} // Dummy component
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{
              backgroundColor: themeColors.primary,
              width: 48,
              height: 48,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 4,
              shadowColor: themeColors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <Ionicons name="add" size={32} color="#FFF" />
            </View>
          ),
          tabBarLabel: () => null, // Hide label
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('CreateEvent');
          },
        })}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
