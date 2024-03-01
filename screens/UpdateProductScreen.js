import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';

const UpdateProductScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

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

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
      setSelectedProduct(null);
    } else {
      const matchedProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(matchedProducts);
      if (matchedProducts.length === 1) {
        setSelectedProduct(matchedProducts[0]);
      }
    }
  }, [searchQuery, products]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setPrice(product.price.replace(' MAD', ''));
  };

  const handleUpdateProduct = () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Error', 'Please enter a valid name and price.');
      return;
    }

    const productRef = ref(database, `products/${selectedProduct.id}`);
    update(productRef, { name, price: `${price} MAD` })
      .then(() => Alert.alert('Success', 'Product updated successfully.'))
      .catch((error) => Alert.alert('Error', 'There was an error updating the product.'));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter product name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelectProduct(item)}>
            <Text style={styles.itemText}>{item.name} - {item.price}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedProduct && (
        <View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price:</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <Text style={styles.currency}>MAD</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
            <Text style={styles.buttonText}>Edit Product</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginVertical: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6b8af', // Border color from the image
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#ffffff', // Input background color
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  itemText: {
    color: '#333',
  },
  currency: {
    color: '#333',
  },
  button: {
    backgroundColor: '#e6b8af', // Button color from the image
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateProductScreen;