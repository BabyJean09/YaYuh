import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
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

const ProfilePage = ({ route }: {route: any}) => {
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);  // To manage loading state
  const [reviews, setReviews] = useState([]);
  const [references, setReferences] = useState([]);

  const { profile } = route.params || {};

  useEffect(() => {
    if (profile) {
      console.log(profile.address);
      //fetchDetails();
    } else {
      setLoading(false);
    }
  }, [profile]);

  // const fetchDetails = async () => {
  //   try {
  //     // Assuming backend APIs for fetching reviews and references
  //     const reviewsResponse = await axios.get(`http://192.168.1.157:3000/api/reviews/${profile.id}`);
  //     const referencesResponse = await axios.get(`http://192.168.1.157:3000/api/references/${profile.id}`);

  //     setReviews(reviewsResponse.data || []);
  //     setReferences(referencesResponse.data || []);
  //   } catch (err) {
  //     setError('Failed to load reviews or references.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSendJobRequest = async () => {
    if (!userEmail || !profile.user_id) {
      Alert.alert('Error', 'Please provide both parent email and babysitter user ID.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.157:3000/api/job-request', {
        status: 'pending',
        parentEmail: userEmail,
        babysitterUserId: profile.user_id
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Job request created successfully!');
      }
    } catch (error) {
      console.error('Error creating job request:', error);
      Alert.alert('Error', 'There was a problem creating the job request. Please try again.');
    }
  };
  
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

  // if (loading) {
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

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

  return (
    <FlatList
      data={[]}  // Provide an empty array as data
      renderItem={() => null}  // Since there's no data, renderItem returns null
      contentContainerStyle={styles.container}
      ListHeaderComponent={
      <>
        <Text style={styles.profileName}>{profile.first_name + ' ' + profile.last_name}</Text>
        <Image 
        source={{ uri: profile.image || 'https://www.newsnationnow.com/wp-content/uploads/sites/108/2022/07/Cat.jpg?w=960&h=540&crop=1' }}
        style={styles.profileImage} 
       />

          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Available</Text>
            <Text style={styles.priceText}>₱65/hr</Text>
          </View>

          <Text style={styles.addressText}>
            <Ionicon name="location" size={16} /> {profile.address}
          </Text>
          <Text style={styles.ratingText}>Rating: ★</Text>

          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.sectionContent}>{profile.about_me}</Text>

          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.sectionContent}>{profile.experience}</Text>

          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.sectionContent}>{profile.skills}</Text>

          <Text style={styles.sectionTitle}>Education</Text>
          <Text style={styles.sectionContent}>{profile.education}</Text>

          <Text style={styles.sectionTitle}>Hobbies</Text>
          <Text style={styles.sectionContent}>{profile.hobbies}</Text>

          {renderAvailability()}
      </>
      }
      ListFooterComponent={
      <>
        {/* <Text style={styles.sectionTitle}>Reviews</Text>
        <FlatList
          data={profile.reviews || ['']}
          renderItem={({ item }) => (
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>
                <Ionicon name="person-circle" size={20} /> {item.reviewer || 'Anonymous'}
              </Text>
              <Text style={styles.comment}>{item.comment || 'No comment provided.'}</Text>
              <Text style={{color: '#ff7700'}}>Rating: {item.rating || 'N/A'} ★</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.reviewList}
        />
        <View>
            <Text style={styles.sectionTitle}>References</Text>
          <FlatList
            data={profile.references || ['No references provided.']}
            renderItem={({ item }) => <Text style={styles.sectionContent}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
          </View> */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.jobButton} onPress={handleSendJobRequest}>
            <Text style={styles.buttonText}>Send Job Request</Text>
          </TouchableOpacity>
        </View>
      </>
      }
    />
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
    backgroundColor: '#fff',
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
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  addressText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  ratingText: {
    fontSize: 16,
    color: '#ff7700',
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
    color: '#000'
  },
  reviewList: {
    marginBottom: 10,
  },
  comment: {
    color: '#000'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  jobButton: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfilePage;
