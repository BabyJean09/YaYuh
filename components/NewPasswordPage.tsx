import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const NewPasswordPage = () => {
  const navigation = useNavigation();
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendNewPassword = () => {
    const payload = {
      email: userEmail, // Replace with the user's email
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    axios.post(`http://192.168.1.157:3000/api/change-password`, payload)
      .then((response) => {
          console.log('Profile saved successfully!:', response.data);

          if (response.status === 200) {
            alert(response.data.message); // Success message from the backend
            navigation.navigate('Login' as never);
          }
        })
        .catch (error => {
          if (error.response) {
            console.error('Error response:', error.response.data);
          } else if (error.request) {
            console.error('Error request:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
        });

    // Implement your logic to send the new password here
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
    navigation.navigate('Login' as never)
  };

  // Validation for password (At least 1 capital letter, 1 special character, 1 digit, minimum 8 characters)
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)(?=.{8,})/;
    return passwordRegex.test(password);
  };

  return (
    <View style={styles.container}>

    <View style={{justifyContent:'center'}}>
      <Text style={styles.title}>Enter New Password</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
            style={styles.inputNew}
            placeholder="New Password"
            placeholderTextColor= 'gray'
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setPasswordMatch(text === confirmPassword);
              setPasswordValid(validatePassword(text));
            }}
          />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showPasswordIcon}>
            <Ionicon name={showPassword ? 'eye-outline' : 'eye-off-outline'} style={styles.showPasswordIcon} />
          </Text>
        </TouchableOpacity>
      </View>

        <Text style={{ color: passwordValid ? 'green' : 'red', marginBottom: 20 }}>
          {passwordValid ? 'Password is valid' : 'Password does not meet criteria'}
        </Text>

        <Text style={styles.title}>Confirm Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor= 'gray'
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setPasswordMatch(text === newPassword);
          }}
        />

        <Text style={{ color: passwordMatch ? 'green' : 'red', marginBottom: 20 }}>
          {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
        </Text>

        <Text style={styles.passwordCriteria}>
          Password must have:
          {"\n"}- At least one uppercase letter
          {"\n"}- At least one special character (!@#$%^&*)
          {"\n"}- At least one digit
          {"\n"}- Minimum of 8 characters
        </Text>
    </View>
    

      <TouchableOpacity 
        style={[styles.sendButton, { backgroundColor: passwordMatch && passwordValid ? '#C8D8E8' : 'gray' }]} 
        onPress={handleSendNewPassword} 
        disabled={!passwordMatch || !passwordValid}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  inputNew: {
    width: 240,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#000'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 30,
    paddingHorizontal: 10,
    width: 300,
    fontSize: 18,
    color: '#000'
  },
  passwordInputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordCriteria: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
  },
  sendButton: {
    padding: 15,
    borderRadius: 30,
    width: 300,
    top: 50,
  },
  sendButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  showPasswordIcon: {
    left: 20,
    fontSize: 25,
    color: 'gray'
  },
});

export default NewPasswordPage;
