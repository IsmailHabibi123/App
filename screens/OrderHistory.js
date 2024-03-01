import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { ColorApp } from '../services/ColorApp';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [showButtonsForItem, setShowButtonsForItem] = useState({});

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const loadedOrders = [];
      for (const key in data) {
      if(!(data[key].orderStatus == 'in preparation')) {
        continue;
      }
        loadedOrders.push({
          id: key,
          client: data[key].customerName || 'Unknown', // You would replace 'Unknown' with the actual client name from your data
          orderInfo: data[key].orderItems.map(item => `${item.name} x ${item.quantity}`).join(', '),
          cost: `${data[key].totalPrice} MAD`,
          status: data[key].orderStatus || 'pending', // Assuming you have orderStatus in your order object
        });
      }
      setOrders(loadedOrders);
    });
  }, []);
  const handleReadyForDelivery = (orderId) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, { orderStatus: "ready" })
      .then(() => console.log(`Order ${orderId} is ready for delivery.`))
      .catch((error) => console.error("Error updating status: ", error));
  };


  const renderItem = ({ item }) => {
    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderText}>Client: {item.client}</Text>
        <Text style={styles.orderText}>Order Information: {item.orderInfo}</Text>
        <Text style={styles.orderText}>Cost: {item.cost}</Text>
        <Text style={styles.orderText}>Status: {item.status}</Text>
        <TouchableOpacity
          style={styles.readyButton}
          onPress={() => handleReadyForDelivery(item.id)}
        >
          <Text style={styles.buttonText}>Ready for Delivery</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ColorApp(),
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 40,
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
  readyButton: {
    backgroundColor: 'blue', // Choose a color that suits your app theme
    padding: 10,
    borderRadius: 35,
    marginTop: 10,
    alignSelf: 'center',
    width: '60%', // Adjust the width as needed
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
