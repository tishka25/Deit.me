import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  navigationRef,
  RootStackParamList,
  RootTabParamList,
} from './src/rootNavigation';
import Register from './src/screens/Register';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Tabs from './src/components/Tabs';
import { LogBox } from 'react-native';
import Login from './src/screens/Login';

export const Stack = createNativeStackNavigator<RootStackParamList>();
export const Tab = createBottomTabNavigator<RootTabParamList>();

const Screens = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainScreen" component={Tabs} />
    </Stack.Navigator>
  );
};

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <NavigationContainer ref={navigationRef}>
      <Screens />
    </NavigationContainer>
  );
};

export default App;
