import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';
import ProfilePage from './ProfilePage';

const BabysitterProfilePage = ({ route }: { route: any }) => {
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
  const navigation = useNavigation();
  const [profile, setProfile] = useState([]);
  const REFRESH_INTERVAL = 60000; // Auto-refresh interval in milliseconds (e.g., 5000ms = 5 seconds)
  
  useEffect(() => {
    fetchProfile(); 
    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchProfile();
    }, REFRESH_INTERVAL);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [userEmail]);

  const fetchProfile = async () => {
    axios.get(`http://192.168.1.157:3000/api/babysitter/profiles/${userEmail}`)
    .then(response => {
      console.log(response.data);
      setProfile(response.data || '')
    })
    .catch(error => {
      console.error("Error fetching babysitter's profile", error, error.response.data);
      setError("Failed to fetch babysitter's profile");
      });
  }

  return (
    <View style={styles.container}>
      {profile.status != 'accepted' ? (
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text style={styles.emptyText}>No babysitter information to be displayed.</Text>
        </View>
      ) : (
        <View>
          {/* Emergency Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('ManageEmergency' as never)} style={styles.emergencyButton}>
              <Ionicons name="alert-circle" size={30} color="white" />
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { profile: profile })} style={styles.profileSection}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{profile.fullname}</Text>
            <Text style={styles.profileRate}>₱65/hr</Text>
            <Text style={styles.profileAddress}>{profile.address}</Text>

            {/* Star Rating */}
            <Text style={styles.starRating}>Rating: N/A ★</Text>

            {/* About Me Section */}
            <View style={styles.aboutMeSection}>
              <Text style={styles.aboutMeTitle}>About Me</Text>
              <Text style={styles.aboutMeText}>
                {profile.about_me}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('Worklog', {parent_id: profile.parent_id})} style={styles.actionButton}>
              <Ionicons name="document-text" size={25} color="white" />
              <Text style={styles.actionButtonText}>Work Log</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Payment', {babysitter_id: profile.babysitter_id})} style={styles.actionButton}>
              <Ionicons name="card" size={25} color="white" />
              <Text style={styles.actionButtonText}>Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
              <Ionicons name="eye" size={25} color="white" />
              <Text style={styles.actionButtonText}>Monitor</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
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
  profileSection: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#C8D8E8',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  profileRate: {
    fontSize: 18,
    color: 'black',
    marginTop: 5,
  },
  profileAddress: {
    fontSize: 16,
    color: 'black',
    marginTop: 5,
  },
  starRating: {
    flexDirection: 'row',
    marginTop: 10,
    color: '#ff7700'
  },
  aboutMeSection: {
    marginTop: 20,
  },
  aboutMeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  aboutMeText: {
    marginTop: 5,
    fontSize: 16,
    color: 'black',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  actionButton: {
    backgroundColor: '#C8D8E8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionButtonText: {
    color: 'black',
    marginTop: 5,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default BabysitterProfilePage;
