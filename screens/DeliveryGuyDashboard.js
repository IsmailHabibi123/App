import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { ColorApp } from '../services/ColorApp';

export default function OrderDelivery() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const loadedOrders = [];
      for (const key in data) {
        if (data[key].orderStatus === 'ready') {
          loadedOrders.push({
            id: key,
            client: data[key].customerName || 'Unknown',
            orderInfo: data[key].orderItems.map(item => `${item.name} x ${item.quantity}`).join(', '),
            cost: `${data[key].totalPrice} MAD`,
            status: data[key].orderStatus,
          });
        }
      }
      setOrders(loadedOrders);
    });
  }, []);

  const handleDeliver = (orderId) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, { orderStatus: "being delivered" })
      .then(() => console.log(`Order ${orderId} is now being delivered.`))
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
          style={styles.deliverButton}
          onPress={() => handleDeliver(item.id)}
        >
          <Text style={styles.buttonText}>Deliver</Text>
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
    marginTop: 0, // Adjust as needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3, // for shadow
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#cccccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#000000',
  },
  deliverButton: {
      backgroundColor: 'orange',
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
