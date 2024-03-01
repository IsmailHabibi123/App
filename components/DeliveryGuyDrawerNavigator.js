import React from 'react';
import { createDrawerNavigator, DrawerItemList, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import DeliveryGuyDashboard from '../screens/DeliveryGuyDashboard';

const Drawer = createDrawerNavigator();

export default function DeliveryGuyDrawerNavigator({ navigation }) {
  const logout = () => {
    // Implement your logout logic here
    // For example, clearing local storage, redux store, etc.

    // Navigate to the Login screen
    navigation.navigate('Login');
  };

  // Custom Drawer Content
  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 40 }}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={logout}
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="Current Orders" component={DeliveryGuyDashboard} />
      {/* Add other screens here */}
    </Drawer.Navigator>
  );
}
