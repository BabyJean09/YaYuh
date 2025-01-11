import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';

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

const YourProfilePage: React.FC = () => {
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store
  const userId = useSelector((state: RootState) => state.auth.user_id); // Get userId from Redux store
  const [amtPerHr, setAmtPerHr] = useState<number | null>(null);
  const [userData, setUserData] = useState(null); // To store user data
  const [loading, setLoading] = useState(true);  // To manage loading state
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const [ud_profile, setUD_Profile] = useState({
    descript: '',
    babysitter_preferences: '',
    about_me: '',
    experience: '',
    skills: '',
    education: '',
    hobbies: ''
  }); // To manage profile state

  const initializeAvailability = (): Availability => {
    const initialAvailability: Availability = {};
    days.forEach((day) => {
      initialAvailability[day] = false; // Default to false (not available)
    });
    return initialAvailability;
  };

  const [user_id, setUserID] = useState('');
  
  const [availability, setAvailability] = useState<Availability>(initializeAvailability);

  const [isModalVisible, setModalVisible] = useState(false); // Manage modal visibility

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    // axios.get(`http://192.168.1.157:3000/api/babysitter-rate/${userId}`)
    // .then(response => {
    //     setAmtPerHr(response.data.amt_perhr);
    //   })
    //   .catch (err => {
    //     setError('Failed to fetch babysitter rate');
    //     console.error('Error fetching babysitter rate:', err);
    //   });
    
    axios
      .get(`http://192.168.1.157:3000/api/user/email/${userEmail}`)
      .then(response => {
        console.log(response.data);
        setUserData(response.data);
        setUserID(response.data.user_id); // Set user_id after fetching user data
        setUD_Profile({
          descript: response.data.profile.descript || 'No description available.',
          babysitter_preferences: response.data.profile.babysitter_preferences || 'No preferences provided.',
          about_me: response.data.profile.about_me || 'No information available.',
          experience: response.data.profile.experience || 'No experience available.',
          skills: response.data.profile.skills || 'No skills available.',
          education: response.data.profile.skills || 'No education available.',
          hobbies: response.data.profile.hobbies || 'No hobbies available'
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
        setLoading(false);
      });

      console.log('Sending request with user_id:', user_id); // Log user_id
  
    if (user_id) {
      axios
        .get(`http://192.168.1.157:3000/api/availability/${user_id}`)
        .then((response) => {
          const data = response.data;
          // Ensure bitmask exists before decoding
          if (data.bitmask) {
            const decodedAvailability = decodeBitmask(data.bitmask);
            console.log('Decoded Availability:', decodedAvailability); // Log decoded availability
            setAvailability((prev) => ({
              ...initializeAvailability(), // Use default structure
              ...decodedAvailability,     // Merge with API data
            })); // Set decoded availability state
          }
        })
        .catch((err) => {
          console.error('Error fetching availability:', err.response?.data || err.message);
          setError('Failed to fetch availability.'); // Set an error message
        });
    }
  }, [userEmail, user_id]); // Runs only when userEmail changes

  const handleSubmit = () => {
    console.log('Updating profile for user email:', userEmail);
    axios
      .put(`http://192.168.1.157:3000/api/your_profile/${userEmail}`, ud_profile) // Assuming the API endpoint updates profile by email
      .then((response) => {
        console.log('Profile updated successfully', response.data);
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating profile:', error.response ? error.response.data : error.message);
        alert('Error updating profile');
      });
  };

  const handleChange = (field: string, value: string) => {
    setUD_Profile(prevProfile => ({
      ...prevProfile,
      [field]: value,
    }));
  };

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
      <View style={styles.availabilityRow}>
        {days.map((day) => (
          <TouchableOpacity key={day} onPress={() => toggleAvailability(day)}>
            <Ionicon
              name={availability[day] ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={availability[day] ? 'green' : 'red'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  

  const toggleAvailability = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: !prev[day], // Toggle availability for the selected day
    }));
  };
  

  const saveAvailability = () => {
    const bitmask = availabilityToBitmask(availability);
    axios
      .post(`http://192.168.1.157:3000/api/availability`, {
        user_id,
        role,
        availability: bitmask,
      })
      .then(response => {
        console.log('Availability updated successfully:', response.data);
        alert('Availability updated successfully!');
      })
      .catch(error => {
        console.error('Error saving availability:', error.response ? error.response.data : error.message);
        alert('Error saving availability');
      });
  };

  const availabilityToBitmask = (availability: Availability) => {
    let bitmask = "";
    days.forEach((day) => {
      bitmask += availability[day] ? "1" : "0"; // Only one bit per day now
    });
    return bitmask;
  };

  const decodeBitmask = (bitmask: string): Availability => {
    const availability: Availability = {};
    let index = 0;
    days.forEach((day) => {
      availability[day] = bitmask[index] === "1";
      index++;
    });
    return availability;
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

  const {profile, children, role} = userData;

  return (
    <FlatList
      data={[]}  // Provide an empty array as data
      renderItem={() => null}  // Since there's no data, renderItem returns null
      contentContainerStyle={styles.container}
      ListHeaderComponent={
      <>
      {role === 'parent' ? (
        <View>
          {/* Emergency Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ManageEmergency' as never)} style={styles.emergencyButton}>
          <Ionicons name="alert-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>
          <Image 
            source={{ uri: 'https://static.scientificamerican.com/sciam/cache/file/2AE14CDD-1265-470C-9B15F49024186C10_source.jpg?w=1200' }} // Placeholder profile picture
            style={styles.profileImage} 
          />
        <TextInput 
        style={styles.profileName}
        value={profile.fullname}
        editable={false} />

        <TextInput
          style={styles.input}
          value={profile.address} // Address is now non-editable
          editable={false} // Make address field non-editable
        />
        
        <Text style={styles.ratingText}>Rating: {'N/A'} ★</Text>
        
        <Text style={styles.sectionTitle}>About Our Family</Text>
        <TextInput
          style={styles.input}
          value={ud_profile.descript}
          onChangeText={text => handleChange('descript', text)}
          placeholder="Enter description about your family"
          placeholderTextColor={'gray'}
          onSubmitEditing={handleSubmit} // Trigger update on "Enter" key press
          returnKeyType="done" // Changes keyboard button to "Done"
        />

        <TouchableOpacity onPress={toggleModal} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.sectionTitle}>Number of Children</Text>
          <View style={{flex: 1, top: 23, left: 5}}><Ionicon name='chevron-forward-circle' color='#000' size={20}/></View>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={profile.num_of_children}
          editable={false}
        />

        <Text style={styles.sectionTitle}>Age of Children</Text>
        <TextInput
          style={styles.input}
          value={profile.age}
          editable={false}
        />
  
        {/* Modal Implementation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Children Information</Text>
              <Text style={styles.modalText}>You have {profile.num_of_children} children in your profile.</Text>
              <View style={styles.childrenContainer}>
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
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.sectionTitle}>Babysitter Preferences</Text>
        <TextInput
          style={styles.input}
          value={ud_profile.babysitter_preferences}
          onChangeText={text => handleChange('babysitter_preferences', text)}
          placeholder="Enter babysitter preferences"
          onSubmitEditing={handleSubmit} // Trigger update on "Enter" key press
          returnKeyType="done" // Changes keyboard button to "Done"
        />

        <View style={{ elevation: 1, padding: 10, marginTop: 10, borderColor: '#000'}}>
          {renderAvailability()}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.taskButton} onPress={() => saveAvailability()}>
              <Text style={styles.buttonText}>Save Availability</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.taskButton} onPress={() => navigation.navigate('TaskManage' as never)}>
            <Text style={styles.buttonText}>Task Management</Text>
          </TouchableOpacity>
        </View>
        </View>
        ) : (

          //Babysitter Profile

        <View>
        {/* Emergency Button */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('ManageEmergency' as never)} style={styles.emergencyButton}>
        <Ionicons name="alert-circle" size={30} color="white" />
      </TouchableOpacity>
    </View>
    <Image 
        source={{ uri: 'https://www.newsnationnow.com/wp-content/uploads/sites/108/2022/07/Cat.jpg?w=960&h=540&crop=1' }}
        style={styles.profileImage} 
       />
      <TextInput 
      style={styles.profileName}
      value={profile.fullname}
      editable={false} />

      <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Unavailable</Text>
            <Text style={styles.priceText}>₱{amtPerHr}</Text>
          </View>

      <TextInput
        style={styles.input}
        value={profile.address} // Address is now non-editable
        editable={false} // Make address field non-editable
      />
      
      <Text style={styles.ratingText}>Rating: {'N/A'} ★</Text>
      
      <Text style={styles.sectionTitle}>About Me</Text>
      <TextInput
        style={styles.input}
        value={ud_profile.about_me}
        onChangeText={text => handleChange('about_me', text)}
        placeholder="Enter description about yourself"
        placeholderTextColor={'gray'}
        onSubmitEditing={handleSubmit} // Trigger update on "Enter" key press
        returnKeyType="done" // Changes keyboard button to "Done"
      />
      <Text style={styles.sectionTitle}>Experience</Text>
      <TextInput
        style={styles.input}
        value={ud_profile.experience}
        onChangeText={text => handleChange('experience', text)}
        placeholder="Enter description about your experience"
        placeholderTextColor={'gray'}
        onSubmitEditing={handleSubmit} // Trigger update on "Enter" key press
        returnKeyType="done" // Changes keyboard button to "Done"
      />
      <Text style={styles.sectionTitle}>Skills</Text>
      <TextInput
        style={styles.input}
        value={ud_profile.skills}
        onChangeText={text => handleChange('skills', text)}
        placeholder="Enter description about your skills"
        placeholderTextColor={'gray'}
        onSubmitEditing={handleSubmit} // Trigger update on "Enter" key press
        returnKeyType="done" // Changes keyboard button to "Done"
      />
      <Text style={styles.sectionTitle}>Education</Text>
      <TextInput
        style={styles.input}
        value={ud_profile.education}
        onChangeText={text => handleChange('education', text)}
        placeholder="Enter description about your experience"
        placeholderTextColor={'gray'}
        onSubmitEditing={handleSubmit} // Trigger update on "Enter" key press
        returnKeyType="done" // Changes keyboard button to "Done"
      />
      <Text style={styles.sectionTitle}>Hobbies</Text>
      <TextInput
        style={styles.input}
        value={ud_profile.hobbies}
        onChangeText={text => handleChange('hobbies', text)}
        placeholder="Enter description about your hobbies"
        placeholderTextColor={'gray'}
        onSubmitEditing={handleSubmit} // Trigger update on "Enter" key press
        returnKeyType="done" // Changes keyboard button to "Done"
      />

      <View style={{ elevation: 1, padding: 10, marginTop: 10, borderColor: '#000'}}>
        {renderAvailability()}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.taskButton} onPress={() => saveAvailability()}>
            <Text style={styles.buttonText}>Save Availability</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
        )}
      </>
      }
      ListFooterComponent={
      <>
        <Text style={styles.sectionTitle}>Reviews</Text>
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
        {role === 'babysitter'  ? (
          <View>
            <Text style={styles.sectionTitle}>References</Text>
          <FlatList
            data={profile.references || ['No references provided.']}
            renderItem={({ item }) => <Text style={styles.sectionContent}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
          </View>
        ) : (null)
        }
      </>
      }
    />
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  emergencyButton: {
    backgroundColor: '#FF0000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  emergencyText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000'
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
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
    marginTop: 20,
  },
  dayHeader: {
    fontWeight: 'bold',
    right: 55,
    width: 47,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  taskButton: {
    width: '100%',
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reviewContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    elevation: 1,
  },
  reviewText: {
    fontWeight: 'bold',
    color: '#000'
  },
  comment: {
    color: '#000',
  },
  reviewList: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
  sectionContent: {
    fontSize: 16,
    marginVertical: 5,
    color: '#000'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#C8D8E8',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default YourProfilePage;
