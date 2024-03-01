import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Switch, Alert } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';

const ChooseOnDisplayProductsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedProducts = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      setProducts(loadedProducts);
    });
  }, []);

  const toggleAvailability = (product) => {
    const productRef = ref(database, `products/${product.id}`);
    update(productRef, { available: !product.available })
      .then(() => Alert.alert('Success', `Product availability updated.`))
      .catch((error) => Alert.alert('Error', 'There was an error updating the product.'));
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={item.available ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => toggleAvailability(item)}
        value={item.available}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter product name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fde8df', // Background color from the image
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6b8af', // Border color from the image
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#ffffff', // Input background color
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  productName: {
    color: '#333',
  },
});

export default ChooseOnDisplayProductsScreen;
