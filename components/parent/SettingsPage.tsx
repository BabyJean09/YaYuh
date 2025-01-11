import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const SettingsPage: React.FC<any> = ({navigation}) => {
  const role = useSelector((state: RootState) => state.auth.role);

  const navigateToAccountInfo = () => {
    navigation.navigate('AccInfo') // Replace with your actual navigation name
    
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
    backgroundColor: '#ffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000'
  },
  button: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});

export default SettingsPage;
