import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';

const DeleteProductScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      const productRef = ref(database, `products/${selectedProduct.id}`);
      remove(productRef)
        .then(() => {
          Alert.alert('Success', 'Product deleted successfully.');
          setSelectedProduct(null);
          setSearchQuery('');
        })
        .catch((error) => {
          Alert.alert('Error', 'There was an error deleting the product.');
          console.error("Error removing data: ", error);
        });
    }
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
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.info}>{selectedProduct.name}</Text>
          </View>
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.info}>{selectedProduct.price}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleDeleteProduct}>
            <Text style={styles.buttonText}>Delete Product</Text>
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
    textAlign: 'center',
    marginVertical: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6b8af', // Border color from the image
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#ffffff', // Input background color
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  info: {
    marginLeft: 10,
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

export default DeleteProductScreen;
