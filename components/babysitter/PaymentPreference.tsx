import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';

const PaymentPreference = ({ route }: { route: any }) => {
    const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
    const navigation = useNavigation();
    const { name, number } = route.params; // Retrieve the name parameter
    const [paymentMethod, setPaymentMethod] = useState<string>('Cash'); // Default payment method
    const [phoneNum, setPhoneNum] = useState(number || '');
    const ratePerHour = 250; // Example fixed rate per hour for 
    const [error, setError] = useState<string>(''); // Error for validation

  // Handle payment method selection
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    if (method !== 'GCash') {
        setPhoneNum(''); // Clear phone number if switching away from GCash
        setError(''); // Clear any error
      } else {
        setPhoneNum(number || ''); // Restore the passed GCash number when switching back
    }
  };

  // Validate phone number
  const validatePhoneNumber = () => {
    const isValid = /^[0-9]{10,11}$/.test(phoneNum); // Validates 10-11 digit numbers
    if (!isValid) {
      setError('Please enter a valid 11 digit phone number.');
    } else {
      setError('');
    }
  };

  const phone_num = async () => {
    setPhoneNum(number);
  }

  const handleSave = async () => {
    if (paymentMethod === 'Cash') {
      const data = {
        pref_method: paymentMethod,
        account_name: name,
        account_num: null,
      };
  
      try {
        const response = await axios.post(`http://192.168.1.157:3000/api/payment-preference/${userEmail}`, data);
        Alert.alert('Success', response.data.message);
      } catch (error) {
        console.error('Error saving payment preference:', error.response?.data?.message || error.message);
        Alert.alert('Error', 'Failed to save payment preference.');
      }
      return;
    } else {
      const data = {
        pref_method: paymentMethod,
        account_name: name,
        account_num: phoneNum,
      };
    
      try {
        const response = await axios.post(`http://192.168.1.157:3000/api/payment-preference/${userEmail}`, data);
        Alert.alert('Success', response.data.message);
      } catch (error) {
        console.error('Error saving payment preference:', error.response?.data?.message || error.message);
        Alert.alert('Error', 'Failed to save payment preference.');
      }
    }
  };
  

  useEffect(() => {
    phone_num();
  }, [number])

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Setup your preferred payment method</Text>
      
      <View style={styles.paymentMethodContainer}>
        <Text style={styles.label}>Preferred Payment Method:</Text>
        
        {/* Payment Method Buttons (Cash or GCash) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, paymentMethod === 'Cash' && styles.selectedButton]}
            onPress={() => handlePaymentMethodChange('Cash')}
          >
            <Text style={styles.buttonText}>Cash</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, paymentMethod === 'GCash' && styles.selectedButton]}
            onPress={() => handlePaymentMethodChange('GCash')}
          >
            <Text style={styles.buttonText}>GCash</Text>
          </TouchableOpacity>
        </View>
      </View>

      {paymentMethod === 'GCash' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>GCash Details:</Text>
          <TextInput style={styles.input}
            value={name}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your GCash number"
            keyboardType="number-pad"
            value={phoneNum}
            onChangeText={setPhoneNum}
            onBlur={validatePhoneNumber}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}


      <View style={styles.paymentDetails}>
        <Text style={styles.label}>Rate per Hour:</Text>
        <Text style={styles.value}>₱{ratePerHour}</Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Payment Method</Text>
      </TouchableOpacity>

      {/* Display confirmation of selected payment method */}
      <Text style={styles.selectedMethod}>Selected Payment Method: {paymentMethod}</Text>
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#000'
  },
  paymentMethodContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50', // Highlight selected option
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 5
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  paymentDetails: {
    marginVertical: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  paymentHistoryButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  paymentHistoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  selectedMethod: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 150
  },
});

export default PaymentPreference;