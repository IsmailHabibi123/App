import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, push } from 'firebase/database';

const AddProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAddProduct = () => {
    // Validate input
    if (!name.trim() || !price.trim()) {
      Alert.alert('Error', 'Please enter a valid name and price.');
      return;
    }

    // Concatenate the price with the currency
    const priceWithCurrency = `${price} MAD`;

    const newProductRef = ref(database, 'products');
    // Add the product with 'available' set to false by default
    push(newProductRef, { name, price: priceWithCurrency, available: false })
      .then(() => {
        Alert.alert('Success', 'Product added successfully.');
        setName(''); // Clear the state
        setPrice('');
      })
      .catch((error) => {
        console.error("Error saving data: ", error);
        Alert.alert('Error', 'Could not add the product.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name..."
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Price..."
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <Text style={styles.currency}>MAD</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fde8df', // Background color from the image
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6b8af', // Border color from the image
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff', // Input background color
    flex: 1,
    marginRight: 10,
  },
  currency: {
    color: '#333',
  },
  button: {
    backgroundColor: '#e6b8af', // Button color from the image
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default AddProductScreen;
