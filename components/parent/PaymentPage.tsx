import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Linking, Platform } from 'react-native';

const PaymentCheckoutPage: React.FC<any> = ({ route }) => {
  const role = useSelector((state: RootState) => state.auth.role); // Role from Redux
  const userEmail = useSelector((state: RootState) => state.auth.email); // Email from Redux
  const navigation = useNavigation();
  const { babysitter_id } = route.params || '';

  const [worklog, setWorklog] = useState<number>(0);
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProfile();
    fetchWorklog();
  }, [userEmail]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      let response;
      if (role === 'babysitter') {
        response = await axios.get(`http://192.168.1.157:3000/api/payment-preference/info/${userEmail}`);
      } else if (role === 'parent') {
        response = await axios.get(`http://192.168.1.157:3000/api/payment-preference/info-parent-side/${babysitter_id}/${userEmail}`);
      }
      setInfo(response.data);
      console.log(info);
    } catch (error) {
      console.error('Error fetching payment information:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch payment information.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorklog = async () => {
    try {
      setLoading(true);
      let response;
      if (role === 'babysitter') {
      response = await axios.get(`http://localhost:3000/api/worklog-payment/${userEmail}`);
    } else if (role === 'parent') {
      response = await axios.get(`http://localhost:3000/api/worklog-payment/${babysitter_id}/${userEmail}`);
    }
      setWorklog(response.data);
    } catch (error) {
      console.error('Error fetching worklog:', error.response?.data || error.message);
    }
  };

  
  const totalAmount = info?.amt_perhr * worklog.hours_worked;

  const amount = parseFloat(totalAmount.toFixed(2));
  

  const handleEWalletPayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/pay', {
        reference_id: `order-${Date.now()}`,
        amount: amount,
        currency: 'PHP',
        checkout_method: 'ONE_TIME_PAYMENT',
        channel_code: 'PH_GCASH',
        channel_properties: {
          success_redirect_url: 'https://redirect.me/payment',
          failure_redirect_url: 'https://redirect.me/failure',
        },
        metadata: {
          userEmail,
          babysitterId: babysitter_id,
        },
      });
  
      const { redirect_url, actions, is_redirect_required } = response.data;
  
      if (is_redirect_required) {
        handleRedirection(actions);
        navigation.navigate('UploadReceipt', { info, babysitter_id,  });
      } 
  
      // Disbursement logic (post-payment) can be modularized into a function
      await handleDisbursement(totalAmount, info);
  
      Alert.alert(
        'Payment Successful',
        `Payment of ₱${amount} was processed, and the babysitter has been paid.`
      );
    } catch (error) {
      console.error('Payment Error:', error.response?.data || error.message);
      Alert.alert('Payment Failed', 'Unable to process the payment.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRedirection = (actions) => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      if (actions.mobile_deeplink_checkout_url) {
        Linking.openURL(actions.mobile_deeplink_checkout_url).catch(() => {
          Alert.alert('Error', 'Unable to open the payment app.');
        });
      } else if (actions.mobile_web_checkout_url) {
        Linking.openURL(actions.mobile_web_checkout_url).catch(() => {
          Alert.alert('Error', 'Unable to open the web checkout page.');
        });
      }
    } else {
      if (actions.desktop_web_checkout_url) {
        Linking.openURL(actions.desktop_web_checkout_url).catch(() => {
          Alert.alert('Error', 'Unable to open the desktop checkout page.');
        });
      }
    }
  
    if (actions.qr_checkout_string) {
      console.log('QR Checkout String:', actions.qr_checkout_string);
    }
  };
  
  const handleDisbursement = async () => {
    try {
      await axios.post('http://localhost:3000/api/disbursement', {
        reference: `disb-${Date.now()}`,
        disbursements: [
          {
            external_id: babysitter_id.toString(),
            bank_code: "PH_GCASH", // Use the correct bank code
            bank_account_name: info?.account_name,
            bank_account_number: info?.account_num,
            description: "Payment for babysitting",
            amount: amount// Total amount in PHP (no conversion to centavos in frontend, handle it on the backend)
          }
        ]
      });
    } catch (error) {
      console.error('Disbursement Error:', error.response?.data || error.message);
      Alert.alert('Disbursement Failed', 'Unable to transfer funds to the babysitter.');
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Checkout</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{info?.account_name || 'Fetching...'}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Rate per Hour:</Text>
        <Text style={styles.value}>₱{info?.amt_perhr}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Hours Worked:</Text>
        <Text style={styles.value}>{worklog.hours_worked}</Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalValue}>₱{amount}</Text>
      </View>
      {role === 'parent' && (
        <TouchableOpacity style={styles.button} onPress={handleEWalletPayment}>
          <Text style={styles.buttonText}>Pay with GCash</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  label: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default PaymentCheckoutPage;
