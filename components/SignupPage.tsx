import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Toast from 'react-native-toast-message'

const SignUpPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params; // Get the userType passed from ChoosePage
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const handleSignUp = async () => {
    // Make a POST request to your API
    axios.post('http://192.168.1.157:3000/api/user', {
      username,
      password,
      email,
      role, // or whatever role you want to set
    })
      .then((response) => {
          console.log('User created successfully:', response.data);

        Toast.show({
          type: 'success',
          text1: 'Signup Successful',
          text2: 'Please check your email to verify your account.',
          visibilityTime: 1000, // Toast will be visible for 2000 milliseconds (4 seconds)
          autoHide: true, // Toast will automatically hide after the visibility time
        });
        setTimeout(() => {
          navigation.navigate('Login' as never);
        }, 1000); // Adjust the time to match the visibilityTime
        })
        .catch (error => {
          if (error.response) {
            console.error('Error response:', error.response.data);
            alert('Signup failed.');
          } else if (error.request) {
            console.error('Error request:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
        });
  };

  // Validation for password (At least 1 capital letter, 1 special character, 1 digit, minimum 8 characters)
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.*\d)(?=.{8,})/;
    return passwordRegex.test(password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign Up</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login' as never)}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor= 'gray'
        value={username}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor= 'gray'
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.inputPass}
          placeholder="Password"
          placeholderTextColor= 'gray'
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordValid(validatePassword(text));
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicon name={showPassword ? 'eye-outline' : 'eye-off-outline'} style={styles.showPasswordIcon}/>
        </TouchableOpacity>
      </View>
      
        <Text style={{ color: passwordValid ? 'green' : 'red'}}>
          {passwordValid ? 'Password is valid' : 'Password does not meet criteria'}
        </Text>

      <View>
        <Text style={styles.passwordCriteria}>
            Password must have:
            {"\n"}- At least one uppercase letter
            {"\n"}- At least one special character (!@#$%^&*)
            {"\n"}- At least one digit
            {"\n"}- Minimum of 8 characters
          </Text>
      </View>

      <TouchableOpacity
        style={[styles.signUpButton, { backgroundColor: passwordValid ? '#C8D8E8' : 'gray' }]} 
        onPress={handleSignUp} 
        disabled={!passwordValid}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    left: 25,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  loginButton: {
    left: 65
  },
  loginButtonText: {
    textDecorationLine: 'underline',
    fontSize: 18,
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
  passwordCriteria: {
    fontSize: 16,
    color: 'gray',
    top: 20,
    textAlign: 'left',
    width: '100%',
  },
  signUpButton: {
    padding: 15,
    borderRadius: 30,
    width: 300,
    marginTop: 150,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
});

export default SignUpPage;

function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
