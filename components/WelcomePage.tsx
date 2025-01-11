import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomePage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Circle design */}
      <View style={styles.circle} />

      {/* Title and subtitle */}
      <View style={styles.content}>
        <Text style={styles.title}>YaYuh!</Text>
        <Text style={styles.subtitle}>Babysitting made easy.</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Choose' as never)}>
        <Text style={styles.buttonText}>Get Started</Text>
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
    color: '#000'
  },
  subtitle: {
    fontSize: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 10,
    top: '35%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default WelcomePage;