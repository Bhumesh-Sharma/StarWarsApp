import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegistrationScreen from "./screens/RegistrationScreen";
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import AddGroupScreen from './screens/AddGroupScreen';
import React, { useEffect, useState }from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import ProfileScreen from './screens/ProfileScreen';
import GroupListScreen from './screens/GroupListScreen';
import GroupDetailsScreen from './screens/GroupDetailsScreen';
import NotificationScreen from './screens/NotificationScreen';

const Stack = createNativeStackNavigator()

export default function App () {

  return (
    <MenuProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen}/>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Registration" component={RegistrationScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Profile" component={ProfileScreen}/>
        <Stack.Screen name="GroupList" component={GroupListScreen}/>
        <Stack.Screen name="AddGroup" component={AddGroupScreen}/>
        <Stack.Screen name="GroupDetails" component={GroupDetailsScreen}/>
        <Stack.Screen name="Notification" component={NotificationScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
    </MenuProvider>
  );
}