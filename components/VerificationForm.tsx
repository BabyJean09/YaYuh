import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Platform, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const VerificationForm: React.FC<any> = ({navigation}) => {
  const role = useSelector((state: RootState) => state.auth.role);
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFilipino, setIsFilipino] = useState<string | null>(null);
  const [selectedID, setSelectedID] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

    // Function to handle the date change and validate age
    const handleDateChange = (event: any, selectedDate?: Date) => {
      if (event.type === 'dismissed') {
        // Dismiss the date picker if the user cancels
        setShowDatePicker(false);
        return;
      }
    
      const currentDate = selectedDate || birthday;
      setShowDatePicker(false);
    
      // Prevent today's and future dates (including tomorrow)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for comparison
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
    
      // Check if the selected date is in the future (today or tomorrow)
      if (currentDate >= today) {
        alert("You cannot select today's date or any future date.");
        return;
      }
    
      // Validate if the user is 18 years old or older
      const age = today.getFullYear() - currentDate.getFullYear();
      const m = today.getMonth() - currentDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < currentDate.getDate())) {
        age--;
      }
    
      if (age < 18) {
        alert('You must be at least 18 years old to select this date.');
        return;
      }
    
      // Set the valid birthdate, setting the time to midnight
      const normalizedDate = new Date(currentDate);
      normalizedDate.setHours(0, 0, 0, 0); // Normalize to midnight
      setBirthday(normalizedDate);
    };

  const nextPage = () => {if (
    !birthday) {
    alert("Please select your birthday.");
    return;
  }

  const birthdayString = birthday ? birthday.toISOString().split('T')[0] : null;
  navigation.navigate('ParentChild', { birthday: birthdayString });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tell us about yourself.{'\n'}Please complete the information below.</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Birthday</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          <Text style={styles.dateText}>{birthday
        ? birthday.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'Select your birthday'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={birthday || new Date()}
            mode="date"
            display={Platform.OS === 'android' ? 'calendar' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* <View style={styles.radioContainer}>
        <Text style={styles.title}>Are you Filipino?</Text>
        <View style={styles.radioButtons}>
          {['yes', 'no'].map(value => (
            <TouchableOpacity
              key={value}
              style={styles.radioOption}
              onPress={() => setIsFilipino(value)}
            >
              <View style={[styles.radioCircle, isFilipino === value && styles.selectedRadio]} />
              <Text style={styles.radioLabel}>{value.charAt(0).toUpperCase() + value.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View> */}

      <View style={styles.buttonContainer}>
        <Text style={styles.title}>List of IDs</Text>
        <Text style={styles.label}>Primary IDs</Text>
        <View style={styles.column}>
          {['National ID', 'Driver\'s License', 'PRC ID', 'SSS ID'].map(id => (
            <Button 
              key={id}
              title={id}
              onPress={() => navigation.navigate('IDCapture', {id})}
              color={selectedID === id ? 'blue' : '#C8D8E8'}
            />
          ))}
        </View>
      </View>
      
      {/* <View style={styles.buttonContainer}>
        <Text style={styles.label}>Additional Documents</Text>
        <View style={styles.column}>
          {['Proof of Billing', 'Vaccination Card'].map(proof => (
            <Button
              key={proof}
              title={proof}
              onPress={() => setSelectedProof(proof)}
              color={selectedProof === proof ? 'blue' : '#C8D8E8'}
            />
          ))}
        </View>
      </View> */}
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity onPress={nextPage} style={styles.nextButton}><Text style={styles.buttonText}>Next</Text></TouchableOpacity>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    marginBottom: 16,
    color: '#000'
  },
  inputContainer: {
    marginBottom: 16,
  },
  title:{
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000'
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000'
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#C8D8E8',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  selectedRadio: {
    backgroundColor: 'blue',
  },
  radioLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  column: {
    flexDirection: 'column',
  },
  nextButton: {
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
});

export default VerificationForm;