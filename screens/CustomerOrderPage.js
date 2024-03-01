import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Import Firestore functions
import { ColorApp } from '../services/ColorApp';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const firestore = getFirestore(); // Initialize Firestore

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        getDoc(userDocRef).then((userDocSnap) => {
          if (userDocSnap.exists()) {
            const userDetails = userDocSnap.data();
            const fullName = `${userDetails.firstName} ${userDetails.lastName}`;
            const ordersRef = ref(database, 'orders');
            onValue(ordersRef, (snapshot) => {
              const data = snapshot.val();
              const loadedOrders = [];
              for (const key in data) {
                 if (data[key].customerName === fullName && data[key].orderStatus !== "deleted") {
                  loadedOrders.push({
                    id: key,
                    orderInfo: data[key].orderItems.map(item => `${item.name} x ${item.quantity}`).join(', '),
                    cost: `${data[key].totalPrice} MAD`,
                    status: data[key].orderStatus,
                  });
                }
              }
              setOrders(loadedOrders);
            });
          } else {
            console.log('No user details available.');
          }
        }).catch((error) => {
          console.error('Error fetching user details:', error);
        });
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleConfirmDelivery = (orderId) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, { orderStatus: "delivered" })
      .then(() => console.log(`Order ${orderId} delivery confirmed.`))
      .catch((error) => console.error("Error updating status: ", error));
  };

  const handleDeleteOrder = (orderId) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, { orderStatus: "deleted" })
      .then(() => console.log(`Order ${orderId} deleted.`))
      .catch((error) => console.error("Error deleting order: ", error));
  };

  const renderItem = ({ item }) => {
    const isDeliverable = item.status === 'ready' || item.status === 'being delivered';

    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderText}>Order Information: {item.orderInfo}</Text>
        <Text style={styles.orderText}>Cost: {item.cost}</Text>
        <Text style={styles.orderText}>Status: {item.status}</Text>
        {isDeliverable && (
          <TouchableOpacity
            style={styles.confirmDeliveryButton}
            onPress={() => handleConfirmDelivery(item.id)}
          >
            <Text style={styles.buttonText}>Confirm Delivery</Text>
          </TouchableOpacity>
        )}
        {item.status === 'delivered' && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteOrder(item.id)}
          >
            <Text style={styles.buttonText}>Delete Order</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        nestedScrollEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    marginBottom: 0,
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    alignItems: 'flex-start',
  },
  orderText: {
    fontSize: 18,
    marginBottom: 5,
  },
  confirmDeliveryButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 35,
    marginTop: 10,
    alignSelf: 'center',
    width: '60%',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 35,
    marginTop: 10,
    alignSelf: 'center',
    width: '60%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
