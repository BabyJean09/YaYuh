import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';

const EmergencyContactListPage = () => {
  // Sample Emergency Contact List
  const emergencyContacts = [
    { id: '1', name: 'Police', phone: '911' },
    { id: '2', name: 'Fire Department', phone: '912' },
    { id: '3', name: 'Ambulance', phone: '913' },
    { id: '4', name: 'Local Hospital', phone: '+639123456789' },
  ];

  // Function to handle making a call
  const makePhoneCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open the phone app.');
        }
      })
      .catch(err => console.log(err));
  };

  // Render each contact in the list
  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => makePhoneCall(item.phone)}
    >
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactPhone}>{item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emergency Contacts</Text>
      <FlatList
        data={emergencyContacts}
        renderItem={renderContactItem}
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  contactItem: {
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
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 5,
  },
});

export default EmergencyContactListPage;