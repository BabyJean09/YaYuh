import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const VerificationForm2: React.FC<any> = ({ route }) => {
  const navigation = useNavigation();
  const role = useSelector((state: RootState) => state.auth.role);
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
  const [userData, setUserData] = useState(null); // To store user data
  const [loading, setLoading] = useState(true);  // To manage loading state
  const [error, setError] = useState('');
  const { extractedData } = route.params || '';

  const minRatePerHour = '65';
  
  const { birthday } = route.params; // Access the birthday parameter

  const [children, setChildren] = useState([{ name: '', age: '', gender: '', specialNeeds: ''}]); // Array of children

  const [ud_profile, setUD_Profile] = useState({
    first_name: '',
    last_name: '',
    birthdate: '',
    phone_num: '',
    email: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_num: '',
    children: children
  }); // To manage profile state

  

  useEffect(() => {
    axios
      .get(`http://192.168.1.157:3000/api/user/email/${userEmail}`)
      .then(response => {
        console.log(response.data);
        setUserData(response.data);
        setUD_Profile({
          first_name: response.data.profile.first_name,
          last_name: response.data.profile.last_name,
          birthdate: birthday || '',
          phone_num: response.data.profile.phone_num,
          email: response.data.email,
          address: response.data.profile.address,
          emergency_contact_name: '',
          emergency_contact_num: '',
          children: children
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
        setLoading(false);
      });
  }, [userEmail]); // Runs whenever userEmail changes

  const handleSave = () => {
    // if (parentFirstName === '' || parentLastName === '' ||phoneNumber === '' || email === '' || address === '' ) {
    //   Alert.alert('Error', 'Please fill in all required fields.');
    //   return;
    // }
    axios.post(`http://192.168.1.157:3000/api/form/profile/${userEmail}`, ud_profile)
      .then((response) => {
          console.log('Profile saved successfully!:', response.data);

        Toast.show({
          type: 'success',
          text1: 'Information saved successfully!',
          visibilityTime: 1000, // Toast will be visible for 2000 milliseconds (4 seconds)
          autoHide: true, // Toast will automatically hide after the visibility time
        });
        setTimeout(() => {
          navigation.goBack(); // Navigate back or to a new screen
        }, 1000); // Adjust the time to match the visibilityTime
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
  };

  const handleChange = (field: string, value: string) => {
    setUD_Profile(prevProfile => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  const handleAddChild = () => {
    setChildren([...children, { name: '', age: '', gender: '', specialNeeds: ''}]);
  };

  // Remove a child entry
  const removeChild = (index: number) => {
    const newChildren = children.filter((_, i) => i !== index);
    setChildren(newChildren);
  };

  const handleChildChange = (index: number, field: string, value: string) => {
    const updatedChildren = [...children];
    updatedChildren[index][field] = value;
    setChildren(updatedChildren);
  };

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {role === 'babysitter' ? 
      (
        <View>
          <Text style={styles.header}>Babysitter's Information</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor={'gray'}
              value={extractedData?.firstName[0]}
              onChangeText={text => handleChange('first_name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor={'gray'}
              value={ud_profile.last_name}
              onChangeText={text => handleChange('last_name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Birthday (yyyy-mm-dd)"
              placeholderTextColor={'gray'}
              value={ud_profile.birthdate}
              onChangeText={text => handleChange('birthdate', text)}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={'gray'}
              keyboardType="phone-pad"
              value={ud_profile.phone_num}
              onChangeText={text => handleChange('phone_num', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={'gray'}
              keyboardType="email-address"
              value={ud_profile.email}
              onChangeText={text => handleChange('email', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Home Address"
              placeholderTextColor={'gray'}
              value={ud_profile.address}
              onChangeText={text => handleChange('address', text)}
            />
          </View>

          <Text style={styles.header}>Emergency Contact Information</Text>
            <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Emergency Contact Name"
              placeholderTextColor={'gray'}
              keyboardType="phone-pad"
              value={ud_profile.emergency_contact_name}
              onChangeText={text => handleChange('emergency_contact_name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Emergency Contact Number"
              placeholderTextColor={'gray'}
              keyboardType="phone-pad"
              value={ud_profile.emergency_contact_num}
              onChangeText={text => handleChange('emergency_contact_num', text)}
            />
            </View>

           <Text style={styles.header}>Rate Per Hour</Text>
           <Text style={{marginBottom: 10}}>Rate per hour is subjected to default minimum wage.
            {"\n"}Your rate will in increase according to your performance.</Text>
            <TextInput
              style={styles.input}
              placeholder="Rate"
              value={minRatePerHour}
              editable={false}
              //onChangeText={false}
            />
        </View>
        
        ) : (
          <View>
            <Text style={styles.header}>Parent's Information</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor={'gray'}
                value={ud_profile.first_name}
                onChangeText={text => handleChange('first_name', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor={'gray'}
                value={ud_profile.last_name}
                onChangeText={text => handleChange('last_name', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Birthday (yyyy-mm-dd)"
                placeholderTextColor={'gray'}
                value={ud_profile.birthdate}
                onChangeText={text => handleChange('birthdate', text)}
                editable={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={'gray'}
                keyboardType="phone-pad"
                value={ud_profile.phone_num}
                onChangeText={text => handleChange('phone_num', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={'gray'}
                keyboardType="email-address"
                value={ud_profile.email}
                onChangeText={text => handleChange('email', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Home Address"
                placeholderTextColor={'gray'}
                value={ud_profile.address}
                onChangeText={text => handleChange('address', text)}
              />
            </View>
            
            <Text style={styles.header}>Emergency Contact Information</Text>
            <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Emergency Contact Name"
              placeholderTextColor={'gray'}
              keyboardType="phone-pad"
              value={ud_profile.emergency_contact_name}
              onChangeText={text => handleChange('emergency_contact_name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Emergency Contact Number"
              placeholderTextColor={'gray'}
              keyboardType="phone-pad"
              value={ud_profile.emergency_contact_num}
              onChangeText={text => handleChange('emergency_contact_num', text)}
            />
            </View>

            <Text style={styles.header}>Children's Information</Text>
            <View style={styles.childContainer}>
            {children.map((child, index) => (
              <View key={index} style={styles.inputContainer}>
                <Text>{`Child ${index + 1}`}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Child's First Name"
                  placeholderTextColor={'gray'}
                  value={ud_profile.children}
                  onChangeText={(text) => handleChildChange(index, 'first_name', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Child's Last Name"
                  placeholderTextColor={'gray'}
                  value={child.last_name}
                  onChangeText={(text) => handleChildChange(index, 'last_name', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Child's Age"
                  placeholderTextColor={'gray'}
                  keyboardType="number-pad"
                  value={child.age}
                  onChangeText={(text) => handleChildChange(index, 'age', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Child's Gender (M/F)"
                  placeholderTextColor={'gray'}
                  value={child.gender}
                  onChangeText={(text) => handleChildChange(index, 'gender', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Special Needs or Allergies (Optional)"
                  placeholderTextColor={'gray'}
                  value={child.specialNeeds}
                  onChangeText={(text) => handleChildChange(index, 'specialNeeds', text)}
                />
                <TouchableOpacity onPress={() => removeChild(index)} style={styles.removeButton}>
                  <Text style={styles.buttonText}>Remove Child</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={handleAddChild}>
              <Text style={styles.buttonText}>Add Another Child</Text>
            </TouchableOpacity>
            </View>
          </View>
        )}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
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
  },
  header: {
    fontSize: 20,
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
    color: '#000',
  },
  inputContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#C8D8E8',
    padding: 10,
    borderRadius: 10,
  },
  childContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8D8E8',
    padding: 10,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  removeButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
  },
});

export default VerificationForm2;