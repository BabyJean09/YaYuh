import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const PaymentHistoryPage = () => {
  const [paymentHistory, setPaymentHistory] = useState([
    { id: '1', date: 'Sept 10, 2024', amount: '₱1,200', method: 'E-Wallet', status: 'Completed' },
    { id: '2', date: 'Sept 8, 2024', amount: '₱900', method: 'Cash', status: 'Completed' },
    { id: '3', date: 'Sept 5, 2024', amount: '₱1,500', method: 'E-Wallet', status: 'Pending' },
    { id: '4', date: 'Sept 1, 2024', amount: '₱2,000', method: 'Cash', status: 'Completed' },
  ]);

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentDate}>{item.date}</Text>
        <Text style={styles.paymentAmount}>{item.amount}</Text>
      </View>
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentMethod}>Method: {item.method}</Text>
        <Text style={[{color: item.status === 'Completed' ? '#4CAF50' : '#FF5722'}, styles.paymentStatus]}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment History</Text>
      
      <FlatList
        data={paymentHistory}
        renderItem={renderPaymentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000'
  },
  listContainer: {
    paddingBottom: 20,
  },
  paymentItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  paymentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    
  },
});

export default PaymentHistoryPage;