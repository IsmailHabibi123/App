import React from 'react';
import { createDrawerNavigator, DrawerItemList, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import OrderHistory from '../screens/OrderHistory';
import PendingOrders from '../screens/CurrentOrdersAdmin';
import ChooseOnDisplayProductsScreen from '../screens/ChooseOnDisplayProductsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import UpdateProductScreen from '../screens/UpdateProductScreen';
import DeleteProductScreen from '../screens/DeleteProductScreen';

const Drawer = createDrawerNavigator();

export default function AdminDrawerNavigator({ navigation }) {
    const logout = () => {
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
        <Drawer.Navigator initialRouteName="Current Orders" drawerContent={CustomDrawerContent}>
            <Drawer.Screen name="Current Orders" component={PendingOrders} />
            <Drawer.Screen name="Orders in preparation" component={OrderHistory} />
            <Drawer.Screen name="Product Availability" component={ChooseOnDisplayProductsScreen} />
            <Drawer.Screen name="Add New Product" component={AddProductScreen} />
            <Drawer.Screen name="Update Product" component={UpdateProductScreen} />
            <Drawer.Screen name="Delete Product" component={DeleteProductScreen} />
            {/* Add more screens as needed */}
        </Drawer.Navigator>
    );
}
