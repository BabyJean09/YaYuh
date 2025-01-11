import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChoosePage = () => {
  const navigation = useNavigation();
  const [role, setUserType] = useState('');

  const handleNavigation = (type) => {
    setUserType(type);
    navigation.navigate('Signup', { role: type === 'parent' ? 'parent' : 'babysitter' }); // Pass userType to the SignUp page
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle} />

      {/* Title and subtitle */}
      <View style={styles.content}>
        <Text style={styles.title}>YaYuh!</Text>
        <Text style={styles.subtitle}>Babysitting made easy.</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.buttonParent} onPress={() => handleNavigation('parent')}>
        <Text style={styles.buttonText}>I am a Parent</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBbySitter} onPress={() => handleNavigation('pabysitter')}>
        <Text style={styles.buttonText}>I am a Babysitter</Text>
      </TouchableOpacity>
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
  circle: {
    position: 'absolute',
    top:-100,
    left: -400,
    width: 600,
    height: 600,
    borderRadius: 500,
    backgroundColor: '#C8D8E8',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    color: '#000',
  },
  buttonParent: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    width: 300,
    borderRadius: 30,
    top: '20%',
    alignItems: 'center',
  },
  buttonBbySitter: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    width: 300,
    borderRadius: 30,
    top: '23%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ChoosePage;