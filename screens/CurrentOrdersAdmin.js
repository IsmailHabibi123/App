import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { ColorApp } from '../services/ColorApp';

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [showButtonsForItem, setShowButtonsForItem] = useState({});

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const loadedOrders = [];
      for (const key in data) {
      if(!(data[key].orderStatus == 'pending')) {
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

  const handleAccept = (orderId) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, { orderStatus: "in preparation" })
      .then(() => console.log(`Order ${orderId} accepted and status updated to in preparation.`))
      .catch((error) => console.error("Error updating status: ", error));
  };

  const handleReject = (orderId) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, { orderStatus: "rejected" })
      .then(() => console.log(`Order ${orderId} rejected and status updated to rejected.`))
      .catch((error) => console.error("Error updating status: ", error));
  };

  const renderItem = ({ item }) => {
      const showButtons = showButtonsForItem[item.id] || false;

      const toggleButtons = () => {
        setShowButtonsForItem({
          ...showButtonsForItem,
          [item.id]: !showButtons,
        });
        }

    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderText}>Client: {item.client}</Text>
        <Text style={styles.orderText}>Order Information: {item.orderInfo}</Text>
        <Text style={styles.orderText}>Cost: {item.cost}</Text>
        <Text style={styles.orderText}>Status: {item.status}</Text>
        <TouchableOpacity onPress={toggleButtons} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>{showButtons ? 'Hide Options' : 'Handle Order'}</Text>
          </TouchableOpacity>
        {showButtons && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
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
  toggleButton: {
    padding:10,
    backgroundColor: '#e0e0e0',
    borderRadius: 35,
    marginTop: 10,
    flex: 1,
    alignSelf: 'center'
  },
  toggleButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
//    justifyContent: 'space-between', // Adjusted for better control of space
    marginTop: 10,
    width: '100%', // Ensure the container takes full width
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 35,
    flex: 1, // Makes the button flexible in the container
    marginHorizontal: 5, // Adds horizontal margin for spacing
  },

  rejectButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 35,
    flex: 1, // Makes the button flexible in the container
    marginHorizontal: 5, // Adds horizontal margin for spacing
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
