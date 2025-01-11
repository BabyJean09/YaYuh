import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutAppPage = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>About Babysitter App</Text>

      <Text style={styles.text}>
        The objective of this app is to help parents find reliable babysitters that fit their
        preferences, while providing babysitters an opportunity to earn extra income.
      </Text>

      <Text style={styles.text}>
        With this platform, parents can hire babysitters to take care of their children, and
        babysitters can accept or reject extended work hours and additional non-babysitting tasks.
      </Text>

      <Text style={styles.text}>
        Key Features of the app include:
      </Text>
      <Text style={styles.text}>
        1. Parents can hire babysitters to take care of their child.{'\n'}
        2. Babysitters can be booked to provide services.{'\n'}
        3. Payments are managed within the app.{'\n'}
        4. Accurate time logging and monitoring are provided.{'\n'}
        5. Referrals between parents and babysitters are enabled.{'\n'}
        6. Android platform compatibility.{'\n'}
        7. Notifications are sent via SMS.{'\n'}
        8. Phone calls can be made using third-party apps.
      </Text>

      <Text style={styles.text}>
        The app's initial study was conducted in Cebu City, but the platform has been designed to be 
        applicable throughout the Philippines.
      </Text>
    </ScrollView>
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
    color: '#000'
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    color: '#000'
  },
});

export default AboutAppPage;