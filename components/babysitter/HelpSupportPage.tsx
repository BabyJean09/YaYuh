import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, TextInput, Alert } from 'react-native';

const HelpSupportPage = () => {
  const [ticketDescription, setTicketDescription] = useState('');

  const handleSubmitTicket = () => {
    if (ticketDescription.trim()) {
      // Simulate sending the ticket (in a real app, you'd make an API call here)
      Alert.alert('Ticket Submitted', 'Your ticket has been successfully submitted. We will get back to you shortly.');
      setTicketDescription(''); // Clear the description field
    } else {
      Alert.alert('Error', 'Please enter a description of your issue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Help & Support</Text>
      <Text style={styles.subHeader}>How can we assist you?</Text>

      <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL('mailto:support@babysitterapp.com')}>
        <Text style={styles.linkText}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL('https://www.babysitterapp.com/faq')}>
        <Text style={styles.linkText}>Frequently Asked Questions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL('https://www.babysitterapp.com/terms')}>
        <Text style={styles.linkText}>Terms & Conditions</Text>
      </TouchableOpacity>

      <View style={styles.ticketContainer}>
        <Text style={styles.ticketHeader}>Submit a Ticket</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Describe your issue"
          value={ticketDescription}
          onChangeText={setTicketDescription}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitTicket}>
          <Text style={styles.submitButtonText}>Submit Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 30,
  },
  linkButton: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#E8F0FF',
    borderRadius: 5,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
  },
  ticketContainer: {
    marginTop: 40,
  },
  ticketHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top', // Aligns the text input to the top when multiline
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default HelpSupportPage;