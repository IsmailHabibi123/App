import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, set, push } from 'firebase/database';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ProductDropdown = ({ onSelect, products }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownListItem}
      onPress={() => {
        onSelect(item);
        setIsOpen(false);
      }}
    >
      <Text style={styles.dropdownListItemText}>{item.name}</Text>
      <Text style={styles.dropdownListItemText}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.dropdownHeaderText}>Add to order</Text>
        <Text style={styles.dropdownHeaderText}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <FlatList
          data={products}
          renderItem={renderDropdownItem}
          keyExtractor={(item) => item.id}
          style={styles.dropdownListContainer}
        />
      )}
    </View>
  );
};
const firestore = getFirestore(); // Initialize Firestore
const auth = getAuth(); // Initialize Firebase Auth

export default function NewOrderPage() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    // Subscribe to the user's authentication status
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        getDoc(userDocRef).then((userDocSnap) => {
          if (userDocSnap.exists()) {
            setUserDetails(userDocSnap.data());
          } else {
            console.log('User details not found in Firestore.');
          }
        }).catch((error) => {
          console.error('Error fetching user details:', error);
        });
      }
    });

    // Fetch products from the Realtime Database
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
      const availableProducts = snapshot.val() ? Object.entries(snapshot.val()).map(([key, value]) => {
        return { ...value, id: key };
      }).filter(product => product.available) : [];
      setProducts(availableProducts);
    });

    // Clean up the subscription on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);
  const handleSelectProduct = (product) => {
    setOrder((currentOrder) => {
      const productIndex = currentOrder.findIndex((p) => p.id === product.id);
      if (productIndex > -1) {
        const newOrder = [...currentOrder];
        const existingProduct = newOrder[productIndex];
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        return newOrder;
      } else {
        return [...currentOrder, { ...product, quantity: 1 }];
      }
    });
  };
  const saveOrderToFirebase = () => {
      const orderRef = ref(database, 'orders');
      const newOrderRef = push(orderRef); // This push generates a unique order ID
      set(newOrderRef, {
        customerName: `${userDetails.firstName} ${userDetails.lastName}`, // Use template literals for clarity
        orderStatus: "pending", // Default status when an order is first saved
        orderItems: order,
        totalPrice: calculateTotal(),
        orderTime: new Date().toISOString(),
        // The key from the newOrderRef is the unique ID for the full order
        orderId: newOrderRef.key
      }).then(() => {
        console.log('Order saved successfully with ID:', newOrderRef.key);
        // Clear the cart (order list) after successful save
        setOrder([]);
        // Additional logic on successful save
      }).catch((error) => {
        console.error('Error saving order: ', error);
      });
    };
  const removeFromOrder = (productId) => {
      setOrder(currentOrder => currentOrder.filter(item => item.id !== productId));
    };

  const calculateTotal = () => {
    return order.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };

  const renderOrderItem = ({ item }) => (
      <View style={styles.orderItem}>
        <View style={styles.orderItemDetails}>
          <Text style={styles.orderText}>{item.name} x {item.quantity}</Text>
          <Text style={styles.orderText}>{item.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeItemButton}
          onPress={() => removeFromOrder(item.id)}
        >
          <Text style={styles.removeItemButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );

return (
    <SafeAreaView style={styles.container}>
      <ProductDropdown onSelect={handleSelectProduct} products={products} />

      <View style={styles.orderListContainer}>
        <FlatList
          data={order}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          extraData={order}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>Total Price: {calculateTotal()} MAD</Text>
        </View>
        <TouchableOpacity style={styles.orderButton} onPress={saveOrderToFirebase}>
          <Text style={styles.orderButtonText}>Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffe4e1', // Pink background as per the screenshot
  },
  orderListContainer: {
      flex: 1, // This ensures that the FlatList takes up the available space
    },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
//    marginBottom: 10,
//    marginTop: 20
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 180,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
  dropdownHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownListContainer: {
    backgroundColor: '#f0f0f0',
  },
  dropdownListItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownListItemText: {
    fontSize: 18,
  },
  orderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 5,
      marginVertical: 8,
      marginBottom: 10,
    },
    orderItemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
      },
      removeItemButton: {
          marginLeft: 10, // Add some space between the button and the product details
          backgroundColor: 'red', // Use any color that fits your design
          padding: 5,
          borderRadius: 5,
        },
        removeItemButtonText: {
          color: 'white', // Choose a text color that stands out against the button background
        },
  orderText: {
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0, // Align to left
    right: 0, // Align to right
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  totalPriceContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ff7f50',
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 50,

  },
  totalPriceText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  orderButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#000080',
    borderRadius: 30,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 3, width: 0 },
    marginBottom: 50
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
