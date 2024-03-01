import React from 'react';
import { createDrawerNavigator, DrawerItemList, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import OrderHistory from '../screens/OrderHistory';
import PendingOrders from '../screens/CurrentOrdersAdmin';
import CustomerOrders from '../screens/CustomerOrderPage';
import NewOrderPage from '../screens/NewOrderPage';
import DeliveryGuyDashboard from '../screens/DeliveryGuyDashboard';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ navigation }) {
  const logout = () => {
    // Implement your logout logic here
    // For example, clearing local storage, redux store, etc.

    // Navigate to the Login screen
    navigation.navigate('Login');
  };

  // Custom drawer content component
  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ marginTop: 40 }}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={() => logout()}
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator initialRouteName="Order" drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="New Order" component={NewOrderPage} />
      <Drawer.Screen name="Order History" component={CustomerOrders} />
      {/* Add other screens here */}
    </Drawer.Navigator>
  );
}
