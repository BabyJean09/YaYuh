import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux'; // Import useSelector to access the Redux store
import { RootState } from '../../redux/store'; // Import RootState for TypeScript typing
import axios from 'axios';

const SideBarPage = ({navigation}: { navigation: any }) => {
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access role from Redux store
  const [username, setUsername] = useState(null);
  const [userData, setUserData] = useState(null); // To store user data
  const [loading, setLoading] = useState(true);  // To manage loading state
  const [error, setError] = useState('');      // To manage error state

  useEffect(() => {
    axios
      .get(`http://192.168.1.157:3000/api/user/email/${userEmail}`)
      .then(response => {
        setUserData(response.data);
        setUsername(response.data.username);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
        setLoading(false);
      });
  }, [userEmail]); // Runs whenever userEmail changes
  
  if (loading) {
    return <Text>Loading...</Text>; // Show a loading message while data is being fetched
  }

  if (error) {
    return <Text>Error: {error}</Text>; // Show error message if an error occurs
  }

  if (!userData) {
    return <Text>No data available</Text>; // Handle cases where no data is available
  }

  // Destructure userData for easier access
  const { role, profile} = userData;

  return (
    <View style={styles.container}>
      {role === 'parent' ? (
        // Parent Fixed Profile Section */}
        
        <View style={styles.profileSection}>
          {/* Temporary Profile Image */}
          <Image 
            source={{ uri: 'https://static.scientificamerican.com/sciam/cache/file/2AE14CDD-1265-470C-9B15F49024186C10_source.jpg?w=1200' }} // Placeholder profile picture
            style={styles.profileImage} 
          />
          <Text style={styles.profileName}>{profile.fullname}</Text>
          <Text style={styles.profileLabel}>@{username}</Text>
        </View>

      ) : (
        // Babysitter Fixed Profile Section */}

        <View style={styles.profileSection}>
          {/* Temporary Profile Image */}
          <Image 
            source={{ uri: profile.image || 'https://www.newsnationnow.com/wp-content/uploads/sites/108/2022/07/Cat.jpg?w=960&h=540&crop=1' }}
            style={styles.profileImage} 
          />
          <Text style={styles.profileName}>{profile.fullname}</Text>
          <Text style={styles.profileLabel}>{role}</Text>
        </View>

      )}
      
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Main Buttons List */}

        {role === 'parent' ? (
          // Buttons for parent

          <View style={styles.buttonList}>
          <TouchableOpacity  onPress={() => navigation.navigate('YourProfile')} style={styles.button}>
            {/* Icon and Text */}
            <MaterialIcon name="person" style={styles.icon} />
            <Text style={styles.buttonText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Babysitter')} style={styles.button}>
            <MaterialIcon name="child-care" style={styles.icon} />
            <Text style={styles.buttonText}>Hired Babysitter</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('JobRequest', {activeTab: 'past'})} style={styles.button}>
            <MaterialIcon name="work-history" style={styles.icon} />
            <Text style={styles.buttonText}>Job Request History</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SavedBabysitter')} style={styles.button}>
            <MaterialIcon name="favorite" style={styles.icon} />
            <Text style={styles.buttonText}>Saved Babysitter</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('PaymentHistory')} style={styles.button}>
            <MaterialIcon name="payments" style={styles.icon} />
            <Text style={styles.buttonText}>Payment History</Text>
          </TouchableOpacity>
        </View>

        ) : (
          // Buttons for babysitter
          
         <View style={styles.buttonList}>
          <TouchableOpacity  onPress={() => navigation.navigate('YourProfile')} style={styles.button}>
            {/* Icon and Text */}
            <MaterialIcon name="person" style={styles.icon} />
            <Text style={styles.buttonText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ParentsProfile')} style={styles.button}>
            <MaterialIcon name="diversity-1" style={styles.icon} />
            <Text style={styles.buttonText}>Applied Family</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('JobOffer', {activeTab: 'past'})} style={styles.button}>
            <MaterialIcon name="work-history" style={styles.icon} />
            <Text style={styles.buttonText}>Job Offers History</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('PaymentPrefer', {name: profile.fullname, number: profile.phone_num})} style={styles.button}>
            <MaterialIcon name="payments" style={styles.icon} />
            <Text style={styles.buttonText}>Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('CreditScore')} style={styles.button}>
            <MaterialIcon name="credit-score" style={styles.icon} />
            <Text style={styles.buttonText}>Credit Score</Text>
          </TouchableOpacity>
        </View>

      )}
        

        {/* Separate Container for "Log Out," "Help & Support," and "About App" */}
        <View style={styles.secondaryButtonList}>
          <TouchableOpacity onPress={() => navigation.navigate('Choose')} style={styles.button}>
            <MaterialIcon name="logout" style={styles.icon} />
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('HelpSupport')} style={styles.button}>
            <MaterialIcon name="help-outline" style={styles.icon} />
            <Text style={styles.buttonText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AboutApp')} style={styles.button}>
            <MaterialIcon name="info-outline" style={styles.icon} />
            <Text style={styles.buttonText}>About App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 200, // Prevent content from overlapping the fixed profile section
    paddingBottom: 80, // Padding to prevent overlap with bottom navigation
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    position: 'absolute', // Keeps the profile fixed
    top: 0, // Positioned at the top
    left: 0,
    right: 0,
    zIndex: 1, // Ensures it stays on top of scrollable content
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileLabel: {
    fontSize: 18,
    color: '#000'
  },
  buttonList: {
    marginTop: 35,
    paddingHorizontal: 20,
  },
  secondaryButtonList: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 40,  // To prevent overlap with the bottom navigation
  },
  button: {
    backgroundColor: '#C8D8E8',
    flexDirection: 'row',  // Align icon and text horizontally
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    width: 300,
  },
  icon: {
    color: '#fff',
    fontSize: 30, 
    marginRight: 10, 
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomButtonText: {
    fontSize: 20,
  },
});

export default SideBarPage;

function setUserData(data: any) {
  throw new Error('Function not implemented.');
}


function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}


function setError(arg0: string) {
  throw new Error('Function not implemented.');
}
