import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';

const AccountInformationPage = ({navigation}: {navigation: any}) => {
  const userEmail = useSelector((state: RootState) => state.auth.email);
  const [userData, setUserData] = useState(null); // To store user data
  const [loading, setLoading] = useState(true);  // To manage loading state
  const [error, setError] = useState('');      // To manage error state
  
  useEffect(() => {
    axios
      .get(`http://192.168.1.157:3000/api/user/email/${userEmail}`)
      .then(response => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
        setLoading(false);
      });
  }, [userEmail]); // Runs whenever userEmail changes
  
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
  

  if (!userData) {
    return <Text>No data available</Text>; // Handle cases where no data is available
  }

  // Destructure userData for easier access
  const { role, profile, children } = userData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Parent Information */}
      <Text style={styles.sectionTitle}>Parent Information</Text>
      <Text style={styles.infoText}>Name: {profile.fullname  || 'N/A'}</Text>
      <Text style={styles.infoText}>Email: {userData.email || 'N/A'}</Text>
      <Text style={styles.infoText}>Phone: {profile.phone_num || 'N/A'}</Text>
      <Text style={styles.infoText}>Address: {profile.address || 'N/A'}</Text>

      {/* Children Information - Only for parents */}
      {role === 'parent' && (
        <View style={styles.childrenContainer}>
          <Text style={styles.sectionTitle}>Children Information</Text>
          {children && children.length > 0 ? (
            children.map((child, index) => (
              <View key={index} style={styles.childContainer}>
                <Text style={styles.infoText}>Child {index + 1}: {child.childname || 'N/A'}</Text>
                <Text style={styles.infoText}>Gender: {child.gender || 'N/A'}</Text>
                <Text style={styles.infoText}>Age: {child.age || 'N/A'}</Text>
                <Text style={styles.infoText}>Special Needs/Allergies: {child.specialNeeds || 'N/A'}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.infoText}>No children information available.</Text>
          )}
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Verification' as never)} style={styles.updateButton}>
        <Text style={styles.buttonText}>Update Account Information</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000'
  },
  infoText: {
    color: '#000',
    fontSize: 16,
    marginBottom: 5,
  },
  childContainer: {
    marginBottom: 15,
    backgroundColor: '#C8D8E8',
    padding: 10,
    borderRadius: 10,
  },
  updateButton: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
  },
});

export default AccountInformationPage;
