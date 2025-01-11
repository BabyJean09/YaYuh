import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  TextInput,
  Modal,
  Button,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const EmergencyContactListPage = () => {
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 

  const [loading, setLoading] = useState(true);  // To manage loading state
  const [error, setError] = useState('');
  const [ecList, setECList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState({ contact_id: '', contact_name: '', contact_phone: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchEmergencyContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.1.157localhost:3000/api/emergency-contact/${userEmail}`);
      setECList(response.data);
    } catch (err) {
      console.error('Error fetching emergency contacts:', err);
      setError('Failed to fetch emergency contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyContacts();
  }, [userEmail]);

  // Handle making a phone call
  const makePhoneCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open the phone app.');
        }
      })
      .catch((err) => console.log(err));
  };

  // Add or edit contact
  const handleSaveContact = async () => {
    if (!currentContact.contact_name || !currentContact.contact_phone) {
      Alert.alert('Error', 'Please fill in both name and phone.');
      return;
    }

    try {
      const method = isEditing ? 'put' : 'post';
      const url = isEditing
        ? `http://192.168.1.157localhost:3000/api/emergency-contact/${currentContact.contact_id}`
        : `http://192.168.1.157:3000/api/emergency-contact/${userEmail}`;
      const payload = {
        contact_name: currentContact.contact_name,
        contact_phone: currentContact.contact_phone,
      };

      await axios[method](url, payload);
      Alert.alert('Success', `Contact ${isEditing ? 'updated' : 'added'} successfully.`);
      fetchEmergencyContacts(); // Refresh list
      resetModal();
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'Unable to save contact.');
    }
  };

  // Delete a contact
  const handleDeleteContact = (id) => {
    Alert.alert('Delete Contact', 'Are you sure you want to delete this contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://192.168.1.157:3000/api/emergency-contact/${id}`);
            Alert.alert('Success', 'Contact deleted successfully.');
            fetchEmergencyContacts();
          } catch (err) {
            console.error('Error deleting contact:', err);
            Alert.alert('Error', 'Unable to delete contact.');
          }
        },
      },
    ]);
  };

  // Reset modal form and close it
  const resetModal = () => {
    setCurrentContact({ contact_id: '', contact_name: '', contact_phone: '' });
    setModalVisible(false);
    setIsEditing(false);
  };

 // Open edit modal with the selected contact
  const openEditModal = (contact) => {
    setCurrentContact(contact);
    setIsEditing(true);
    setModalVisible(true);
  };

  // Render each contact
  const renderContactItem = ({ item }) => (
  <TouchableOpacity style={styles.contactItem} onPress={() => makePhoneCall(item.contact_phone)}>
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{item.contact_name}</Text>
      <Text style={styles.contactPhone}>{item.contact_phone}</Text>
    </View>
    <View style={styles.contactActions}>
      <TouchableOpacity onPress={() => openEditModal(item)}>
        <Text style={{ textDecorationLine: 'underline', color: '#1E90FF' }}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteContact(item.contact_id)}>
        <Text style={{ textDecorationLine: 'underline', color: 'red' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  

  if (!ecList) {
    return <Text>No data available</Text>; // Handle cases where no data is available
  }

const {} = ecList;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emergency Contacts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <FlatList
          data={ecList}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.contact_id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Contact</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>{isEditing ? 'Edit Contact' : 'Add Contact'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={'gray'}
            value={currentContact.contact_name}
            onChangeText={(text) => setCurrentContact({ ...currentContact, contact_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={'gray'}
            keyboardType="phone-pad"
            value={currentContact.contact_phone}
            onChangeText={(text) => setCurrentContact({ ...currentContact, contact_phone: text })}
          />
          <View style={styles.modalActions}>
            <Button title="Cancel" onPress={resetModal} />
            <Button title={isEditing ? 'Save Changes' : 'Add Contact'} onPress={handleSaveContact} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactActions: {
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  contactPhone: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    color: '#000'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default EmergencyContactListPage;
