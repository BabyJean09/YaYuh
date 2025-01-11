import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const BabysitterInfoForm: React.FC = () => {
  // Babysitter Information States
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState(''); // Handle image picker
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [certifications, setCertifications] = useState('');
  const [languages, setLanguages] = useState('');
  const [rate, setRate] = useState('');
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState('');
  const [ratings, setRatings] = useState(''); // Placeholder, usually set by user reviews

  const handleSave = () => {
    if (!name || !phoneNumber || !email || !address || !rate) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    Alert.alert('Success', 'Babysitter information saved!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Babysitter's Profile Information</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={'gray'}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor={'gray'}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={'gray'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Home Address"
        placeholderTextColor={'gray'}
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Years of Experience"
        placeholderTextColor={'gray'}
        keyboardType="number-pad"
        value={experience}
        onChangeText={setExperience}
      />
      <TextInput
        style={styles.input}
        placeholder="Certifications (Optional)"
        placeholderTextColor={'gray'}
        value={certifications}
        onChangeText={setCertifications}
      />
      <TextInput
        style={styles.input}
        placeholder="Languages Spoken"
        placeholderTextColor={'gray'}
        value={languages}
        onChangeText={setLanguages}
      />
      <TextInput
        style={styles.input}
        placeholder="Rate per Hour (₱)"
        placeholderTextColor={'gray'}
        keyboardType="number-pad"
        value={rate}
        onChangeText={setRate}
      />
      <TextInput
        style={styles.input}
        placeholder="Availability (e.g., Weekends, Weekdays)"
        placeholderTextColor={'gray'}
        value={availability}
        onChangeText={setAvailability}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Bio or Additional Information"
        placeholderTextColor={'gray'}
        multiline
        value={bio}
        onChangeText={setBio}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000'
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
  saveButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BabysitterInfoForm;
