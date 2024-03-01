import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import DrawerNavigator from './components/TabNavigator';
import AdminDrawerNavigator from './components/AdminDrawerNavigator';
import DeliveryGuyDrawerNavigator from './components/DeliveryGuyDrawerNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  //screenOptions={{headerShown : false}}
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="login" screenOptions={{headerShown : false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="CustomerHome" component={DrawerNavigator} />
        <Stack.Screen name="AdminHome" component={AdminDrawerNavigator} />
        <Stack.Screen name="DeliveryGuyHome" component={DeliveryGuyDrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;