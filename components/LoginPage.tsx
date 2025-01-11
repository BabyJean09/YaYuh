import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons'
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux'; // Import useDispatch from Redux
import { setRole, setUsername, setEmail, setId } from '../redux/authsSlice';
import { AppDispatch } from '../redux/store';


const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  //const dispatch = useDispatch(); // Initialize the dispatch function

  const handleLogin = () => {
    axios.post('http://192.168.1.157:3000/api/login', { 
      email, 
      password 
    })
      .then(response => {
        const userRole = response.data.user.role; // Assuming role is returned in the response
        const username = response.data.user.username; 
        const userID = response.data.user.user_id;
  
        console.log('Login successful:', response.data);
        console.log(username);
        console.log(email);
        console.log(userID);
  
        // Dispatch the role, username, email, id to the Redux store
        dispatch(setRole(userRole));
        dispatch(setUsername(username));
        dispatch(setId(userID));
        dispatch(setEmail(email));
        
        Toast.show({
          type: 'success',
          text1: 'Login successfully!',
          text2: 'You will be directed to home.',
          visibilityTime: 1000,
          autoHide: true,
        })
        setTimeout(() => {
          navigation.navigate('Home' as never);
        }, 1000);
        
      })
      .catch(error => {
        if (error.response) {
          Toast.show({
            type: 'error',
            text1: 'Login failed!',
            text2: 'Invalid email and password.',
            visibilityTime: 1000,
            autoHide: true,
          });
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log In</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor= 'gray'
        value={email}
        onChangeText={setUserEmail}
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.inputPass}
          placeholder="Password"
          placeholderTextColor= 'gray'
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.showPasswordIcon}>
            <Ionicon name={showPassword ? 'eye-outline' : 'eye-off-outline'} style={styles.showPasswordIcon} />
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logInButton} onPress={handleLogin}>
        <Text style={styles.logInButtonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPassButton} onPress={() => navigation.navigate('ForgotPass' as never)}>
          <Text style={styles.forgotPassText}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createAccButton} onPress={() => navigation.navigate('Choose' as never)}>
          <Text style={styles.createAccText}>Click here to create an Account</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 18,
    color: 'black'
  },
  inputPass: {
    width: 240,
    paddingHorizontal: 10,
    fontSize: 18,
    color: 'black'
  },
  passwordInputContainer: {
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPasswordIcon: {
    left: 15,
    fontSize: 25,
    color: 'gray',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    marginLeft: 5,
  },
  logInButton: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 30,
    width: 300,
    marginTop: 250,
  },
  logInButtonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  forgotPassButton: {
    top: 15,
  },
  forgotPassText: {
    textDecorationLine: 'underline',
    fontSize: 18,
    color: '#000',
  },
  createAccButton: {
    top: 20,
  },
  createAccText: {
    textDecorationLine: 'underline',
    fontSize: 18,
    color: '#000',
  }
});

export default LoginPage;

function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
