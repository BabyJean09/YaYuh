import React, {useEffect, useState} from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Availability = {
  [day: string]: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
};

const days = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun'];
const timeSlots = ['morning', 'afternoon', 'evening', 'night'];

const ProfilePage: React.FC<any> = ({ route }) => {
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);  // To manage loading state
  const { profile } = route.params || {}; // Safely access the profile object
  const [jobRequestStatus, setJobRequestStatus] = useState<string>('pending');

  console.log(profile);

  // Provide default values for missing properties
  // const {
  //   reviews = [],
  //   references = [],
  // } = profile;

  useEffect(() => {
    if (profile) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
  }, []);

  // const fetchTasks = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3000/api/task-todo/${profile.parent_id}`);
  //     setTaskList(response.data);
  //   } catch (error) {
  //     console.error('Error fetching tasks:', error, error.response.data);
  //     Alert.alert('Error', 'Could not fetch tasks. Please try again.');
  //   }
  // };

  const [availability, setAvailability] = useState<Availability>({});

  useEffect(() => {
    if (profile.user_id) {
      axios
        .get(`http://192.168.1.157:3000/api/availability/${profile.user_id}`)
        .then((response) => {
          const data = response.data;
  
          // Ensure bitmask exists before decoding
          if (data.bitmask) {
            const decodedAvailability = decodeBitmask(data.bitmask);
            console.log('Decoded Availability:', decodedAvailability); // Log decoded availability
            setAvailability(decodedAvailability); // Set decoded availability state
          }
        })
        .catch((err) => {
          console.error('Error fetching availability:', err.response?.data || err.message);
          setError('Failed to fetch availability.'); // Set an error message
        });
    }
  }, [userEmail]);

  const renderAvailability = () => (
    <View style={styles.availabilityTable}>
      <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>Availability</Text>
      <View style={styles.availabilityHeader}>
        <Text style={styles.dayHeader}></Text>
        {days.map((day) => (
          <Text key={day} style={styles.dayHeader}>
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Text>
        ))}
      </View>
      {timeSlots.map((slot) => (
        <View key={slot} style={styles.availabilityRow}>
          <Text style={styles.slotHeader}>
            {slot.charAt(0).toUpperCase() + slot.slice(1)}
          </Text>
          {days.map((day) => (<Ionicon
                name={availability[day]?.[slot] ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={availability[day]?.[slot] ? 'green' : 'red'}
              />
          ))}
        </View>
      ))}
    </View>
  );

  const decodeBitmask = (bitmask: string): Availability => {
    const availability: Availability = {};
    let index = 0;
    days.forEach((day) => {
      availability[day] = {};
      timeSlots.forEach((slot) => {
        availability[day][slot] = bitmask[index] === "1";
        index++;
      });
    });
    return availability;
  };

  const acceptJobRequest = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/job-requests/accept/${profile.job_request_id}`,
        { status: 'accepted' }
      );
      setJobRequestStatus('accepted'); // Update the UI status
      Alert.alert('Job request accepted!');
      navigation.goBack();
    } catch (error) {
      console.error('Error accepting job request:', error);
      Alert.alert('Failed to accept job request.');
    }
  };

  const declineJobRequest = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/job-requests/decline/${profile.job_request_id}`,
        { status: 'declined' }
      );
      setJobRequestStatus('declined'); // Update the UI status
      Alert.alert('Job request declined!');
      navigation.goBack();
    } catch (error) {
      console.error('Error declining job request:', error);
      Alert.alert('Failed to decline job request.');
    }
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
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No profile data available.</Text>
      </View>
    );
  }
  
  // <FlatList
  //       data={reviews}
  //       renderItem={({ item }) => (
  //         <View style={styles.reviewContainer}>
  //           <Text style={styles.reviewText}>
  //             <Ionicon name="person-circle" size={20} /> {item.reviewer || 'Anonymous'}
  //           </Text>
  //           <Text>{item.comment || 'No comment provided.'}</Text>
  //           <Text>Rating: {item.rating || 'N/A'} ★</Text>
  //         </View>
  //       )}
  //       keyExtractor={(item, index) => index.toString()}
  //       style={styles.reviewList}
  //     />

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.profileName}>{profile.first_name + ' ' + profile.last_name}</Text>
      <Image source={{ uri: profile.avatar || 'https://static.scientificamerican.com/sciam/cache/file/2AE14CDD-1265-470C-9B15F49024186C10_source.jpg?w=1200' }} style={styles.profileImage} />

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{profile.status}</Text>
      </View>

      <Text style={styles.addressText}>
        <Ionicon name="location" size={16} /> {profile.address}
      </Text>
      <Text style={styles.ratingText}>Rating: ★</Text>

      <Text style={styles.sectionTitle}>About Our Family</Text>
      <Text style={styles.sectionContent}>{profile.descript}</Text>

      <Text style={styles.sectionTitle}>Number of Children</Text>
      <TextInput
        style={styles.sectionContent}
        value={profile.num_of_children.toString()}
        editable={false}
      />

      <Text style={styles.sectionTitle}>Age of Children</Text>
      <TextInput
        style={styles.sectionContent}
        value={profile.children_age.toString()}
        editable={false}
      />

      <Text style={styles.sectionTitle}>Babysitter Preference</Text>
      <Text style={styles.sectionContent}>{profile.babysitter_preferences}</Text>

      {renderAvailability()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.taskButton} onPress={() => navigation.navigate('TaskMonitor', { parent_id: profile.parent_id })}>
          <Text style={styles.buttonText}>Task Management</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Reviews</Text>

      <Text style={styles.sectionTitle}>References</Text>

      {/* {references.length ? (
        references.map((reference, index) => (
          <Text key={index} style={styles.sectionContent}>{reference}</Text>
        ))
      ) : (
        <Text style={styles.sectionContent}>No references provided.</Text>
      )} */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.jobButton} onPress={declineJobRequest}>
          <Text style={styles.buttonText}>Decline Job Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={acceptJobRequest}>
          <Text style={styles.buttonText}>Accept Job Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000'
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#C8D8E8',
    padding: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 18,
    color: 'green',
  },
  addressText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  ratingText: {
    fontSize: 16,
    color: '#ffbf00',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000'
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000'
  },
  availabilityTable: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 1,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  dayHeader: {
    left: 20,
    fontWeight: 'bold',
    flex: 1,
    width: 60,
    textAlign: 'center',
    color: '#000'
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  slotHeader: {
    fontWeight: 'bold',
    width: 65,
    color: '#000'
  },
  reviewContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  reviewText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  taskButton: {
    width: '100%',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
  },
  jobButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfilePage;
