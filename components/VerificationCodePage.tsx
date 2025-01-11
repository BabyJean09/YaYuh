import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const VerificationPage = () => {
  const navigation = useNavigation();

  const [verificationCode, setVerificationCode] = useState('');

  const handleSendVerificationCode = () => {
    // Implement your logic to send a password reset email here
    console.log('Verification Code:', verificationCode);
    navigation.navigate('NewPass' as never);
  };

  const handleResendVerificationCode = () => {
    // Implement your logic to resend the verification code here
    console.log('Resending verification code...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter verification code</Text>
      <TextInput
          style={styles.verificationCodeInput}
          placeholder="1234"
          placeholderTextColor= 'gray'
          keyboardType="numeric"
          value={verificationCode}
          onChangeText={setVerificationCode}
          />

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>If you didn't receive a code,</Text>
          <TouchableOpacity style={styles.resendButton} onPress={handleResendVerificationCode}>
            <Text style={styles.resendButtonText}>Resend</Text>
          </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={handleSendVerificationCode}>
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
  verificationCodeInput: {
    width: 200,
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 30,
    marginBottom: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    top: 20,
  },
  resendText: {
    fontSize: 18,
    color: '#000',
  },
  resendButton: {
    left: 5
  },
  resendButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#C8D8E8',
    textShadowColor: 'gray',
    textShadowRadius: 0.1,
    textDecorationLine: 'underline'
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

export default VerificationPage;