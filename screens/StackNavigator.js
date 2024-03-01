import { createStackNavigator } from '@react-navigation/stack';
import MyProductsScreen from './myproducts';
import AddProductScreen from './AddProductScreen'; // Import the AddProductScreen
// Import other screens here...

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MyProducts">
      <Stack.Screen
        name="MyProducts"
        component={AddProductScreen}
        options={{ title: 'My Products' }} // Optional: Customize the header title
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: 'Add New Product' }} // Optional: Customize the header title
        headerLeft: () => (
                    <HeaderBackButton onPress={() => navigation.goBack()} />
                  ),
      />
      {/* Define other screens and their components here */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
