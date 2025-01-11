import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const HomePage = () => {
  const userEmail = useSelector((state: RootState) => state.auth.email);
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobOffers();
    fetchProfile();
  }, [userEmail]);

  const fetchJobOffers = async () => {
    try {
      const response = await axios.get(`http://192.168.1.157:3000/api/job-offer/${userEmail}`);
      setJobData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job offers:', error);
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://192.168.43.66:3000/api/parent/profiles/${userEmail}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching parent's profile", error);
      setError("Failed to fetch parent's profile");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Jobs</Text>
      {jobData.length > 0 ? (
        <FlatList
          data={jobData}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.profileSection} onPress={() => {/* Navigate to job details */}}>
              <Image
                source={{
                  uri: item.profile_image || 'https://via.placeholder.com/100',
                }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{item.name}</Text>
              <Text style={styles.profileRate}>$15/hr</Text>
              <Text style={styles.profileAddress}>{item.address}</Text>

              {/* Star Rating */}
              <View style={styles.starRating}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Ionicons name="star" size={20} color="#FFD700" />
                <Ionicons name="star" size={20} color="#FFD700" />
                <Ionicons name="star" size={20} color="#FFD700" />
                <Ionicons name="star-outline" size={20} color="#FFD700" />
              </View>

              {/* About Me Section */}
              <View style={styles.aboutMeSection}>
                <Text style={styles.aboutMeTitle}>About the Job</Text>
                <Text style={styles.aboutMeText}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.job_request_id.toString()}
        />
      ) : (
        <Text>No current jobs available.</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomePage;
