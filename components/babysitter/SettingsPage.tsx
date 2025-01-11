import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SettingsPage: React.FC<any> = ({navigation}) => {

  const navigateToAccountInfo = () => {
    navigation.navigate('AccInfoB'); // Replace with your actual navigation name
  };

  const navigateToChangePassword = () => {
    navigation.navigate('NewPass'); // Replace with your actual navigation name
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <TouchableOpacity style={styles.button} onPress={navigateToAccountInfo}>
        <Text style={styles.buttonText}>Account Information</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={navigateToChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SettingsPage;
