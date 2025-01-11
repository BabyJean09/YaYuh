import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ForgotPasswordPage = () => {
  
  const navigation = useNavigation();

  const [email, setEmail] = useState('');

  const handleSendPasswordResetEmail = () => {
    // Implement your logic to send a password reset email here
    console.log('Email:', email);
    navigation.navigate('VerifyCode' as never);

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your email address</Text>

      <TextInput
        style={styles.input}
        placeholder="example@gmail.com"
        placeholderTextColor= 'gray'
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => {navigation.navigate('Login' as never)}}>
        <Text style={styles.backButtonText}>Back to Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sendButton} onPress={handleSendPasswordResetEmail}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>Do you have an account?</Text>
      <TouchableOpacity style={styles.signUpButton} onPress={() => {navigation.navigate('Signup' as never)}}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
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
    marginBottom: 20,
    color: '#000',
  },
  input: {
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  backButton: {
    marginBottom: 10,
    top: 20,
  },
  backButtonText: {
    fontSize: 18,
    textDecorationLine: 'underline',
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 30,
    width: 300,
    marginBottom: 200,
    top: 30,
  },
  sendButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  signUpText: {
    marginBottom: 10,
    fontSize: 18,
    color: '#000',
  },
  signUpButton: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    borderRadius: 30,
    width: 300,
  },
  signUpButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
});

export default ForgotPasswordPage;