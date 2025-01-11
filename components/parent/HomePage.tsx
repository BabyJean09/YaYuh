import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal, Button, RefreshControl, ActivityIndicator } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const HomePage = () => {
  const navigation = useNavigation();
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
  const [loading, setLoading] = useState(true);  // To manage loading state
  const [error, setError] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [addressFilter, setAddressFilter] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State to handle refreshing

  useEffect(() => {
    onRefresh();
  }, [userEmail]); 

  const fetchProfiles = async () => {
    try {
      const response = await axios.get('http://192.168.1.157:3000/api/babysitter/profiles');
      console.log(response.data); // Log the data here
      const babysitters = response.data;
      setProfiles(babysitters);
      setFilteredProfiles(babysitters);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching babysitters:', err);
      setError('Failed to fetch babysitters.');
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = profiles;

    if (addressFilter) {
      filtered = filtered.filter(profile => profile.address === addressFilter);
    }

    if (sortOption) {
      if (sortOption === 'experience') {
        filtered = filtered.sort((a, b) => b.experience - a.experience);
      } else if (sortOption === 'price') {
        filtered = filtered.sort((a, b) => a.price - b.price);
      }
    }

    setFilteredProfiles(filtered);
    setFilterVisible(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request or fetch the data again
    setTimeout(() => {
      fetchProfiles(); // Re-fetch profiles or reset data
      setRefreshing(false); // End refreshing
    }, 1000); // Wait for 1 second to simulate the refresh
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

  const renderProfileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.profileContainer}
      onPress={() => navigation.navigate('Profile', { profile: item })}>
      <Image 
      source={{ uri: item.image || 'https://www.newsnationnow.com/wp-content/uploads/sites/108/2022/07/Cat.jpg?w=960&h=540&crop=1' }} 
      style={styles.profileImage} 
      />
      <Text style={styles.profileName}>{item.first_name + ' ' + item.last_name}</Text>
      <Text style={styles.profileExperience}>{item.experience}</Text>
      <Text style={styles.profilePrice}>₱65/hr</Text>
      <Text style={styles.profileRating}>Rating: 4.7 ★</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter/Sort Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Ionicon name="filter" size={24} color="white" />
          <Text style={styles.buttonText}>Filter/Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Filter and Sort */}
      <Modal
        visible={filterVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter/Sort Profiles</Text>

            {/* Filter by Address */}
            <Text>Filter by Address:</Text>
            <Button title="City A" onPress={() => setAddressFilter('City A')} />
            <Button title="City B" onPress={() => setAddressFilter('City B')} />

            {/* Sort Options */}
            <Text>Sort by:</Text>
            <Button title="Years of Experience" onPress={() => setSortOption('experience')} />
            <Button title="Price" onPress={() => setSortOption('price')} />

            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setFilterVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Grid */}
      <FlatList
        data={filteredProfiles}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderProfileItem}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.profileList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
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
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8D8E8',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#C8D8E8',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  profileExperience: {
    fontSize: 14,
    color: 'black'
  },
  profilePrice: {
    fontSize: 14,
    color: 'black'
  },
  profileRating: {
    fontSize: 14,
    color: '#ff7700',
  },
  row: {
    justifyContent: 'space-between',
  },
  profileList: {
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  applyButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default HomePage;
