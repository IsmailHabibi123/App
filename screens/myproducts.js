import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MyProductsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Products:</Text>

      {/* This button navigates to the On-Display Products screen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OnDisplayProducts')}>
        <Text style={styles.buttonText}>Choose On-Display Products</Text>
      </TouchableOpacity>

      {/* This button navigates to the Add New Product screen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddProduct')}>
        <Text style={styles.buttonText}>Add New Product</Text>
      </TouchableOpacity>

      {/* This button navigates to the Update Product screen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UpdateProduct')}>
        <Text style={styles.buttonText}>Update Product</Text>
      </TouchableOpacity>

      {/* This button navigates to the Delete Product screen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DeleteProduct')}>
        <Text style={styles.buttonText}>Delete Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e6b8af', // The color from the image
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20, // Space between buttons
    minWidth: '60%', // Minimum width for each button
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MyProductsScreen;
