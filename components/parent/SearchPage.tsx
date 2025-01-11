import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Modal, Button, RefreshControl,} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

// Dummy data for profiles
interface Profile {
  id: number;
  name: string;
  image: string;
  address: string;
  rating: number;
  priceRate: number;
  experience: number;
}

const profiles: Profile[] = [
  {
    id: 1,
    name: 'Jane Doe',
    image: 'https://via.placeholder.com/100',
    address: 'Cebu City',
    rating: 4.8,
    priceRate: 350,
    experience: 5,
  },
  {
    id: 2,
    name: 'John Smith',
    image: 'https://via.placeholder.com/100',
    address: 'Mandaue City',
    rating: 4.5,
    priceRate: 300,
    experience: 3,
  },
  {
    id: 3,
    name: 'Mary Johnson',
    image: 'https://via.placeholder.com/100',
    address: 'Lapu-Lapu City',
    rating: 4.9,
    priceRate: 400,
    experience: 6,
  },
  // More profiles can be added
];

const SearchPage = ({navigation}: {navigation: any}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>(profiles);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('name'); // Default sort by name
  const [filterOption, setFilterOption] = useState<string>(''); // Default filter (none)
  const [refreshing, setRefreshing] = useState(false); // State to handle refreshing
  // Filter profiles based on the search keyword
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    const filtered = profiles.filter((profile) =>
      profile.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProfiles(filtered);
  };

  // Apply filter and sort profiles based on the selected option
  const applyFilterSort = () => {
    let sortedProfiles = [...filteredProfiles];

    // Apply filter if any
    if (filterOption) {
      sortedProfiles = sortedProfiles.filter((profile) => {
        if (filterOption === 'highRating') return profile.rating >= 4.5;
        if (filterOption === 'lowPrice') return profile.priceRate <= 350;
        return true;
      });
    }

    // Sort profiles based on the selected option
    sortedProfiles.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'rating') {
        return b.rating - a.rating;
      } else if (sortOption === 'price') {
        return a.priceRate - b.priceRate;
      } else if (sortOption === 'experience') {
        return b.experience - a.experience;
      }
      return 0;
    });

    setFilteredProfiles(sortedProfiles);
    setModalVisible(false); // Close the modal
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request or fetch the data again
    setTimeout(() => {
      // Reset search keyword and filtered profiles to original state
      setSearchKeyword('');
      setFilteredProfiles(profiles); // Reset to original profiles
      setRefreshing(false); // End refreshing
    }, 1000); // Wait for 1 second to simulate the refresh
  };

  // Render a profile item
  const renderProfile = ({ item }: { item: Profile }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Profile', { profile: item })} style={styles.profileCard}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{item.name}</Text>
        <Text style={styles.profileAddress}>
          <Ionicon name="location" size={16} /> {item.address}
        </Text>
        <Text style={styles.profileRating}>Rating: {item.rating} ★</Text>
        <Text style={styles.profileRate}>₱{item.priceRate}/hr</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by keyword..."
        placeholderTextColor={'gray'}
        value={searchKeyword}
        onChangeText={handleSearch}
      />

      {/* Filter & Sort Button */}
      <TouchableOpacity style={styles.filterSortButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.filterSortButtonText}>Filter & Sort</Text>
      </TouchableOpacity>

      {/* Suggested Profiles */}
      <Text style={styles.sectionTitle}>Suggested Profiles</Text>
      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProfile}
        contentContainerStyle={styles.profileList}
        refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
      />

      {/* Filter and Sort Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter & Sort Options</Text>
            
            {/* Filter Options */}
            <Text style={styles.optionTitle}>Filter By:</Text>
            <TouchableOpacity onPress={() => setFilterOption('highRating')}>
              <Text style={styles.optionText}>High Rating (4.5 ★ and above)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilterOption('lowPrice')}>
              <Text style={styles.optionText}>Low Price (₱350 and below)</Text>
            </TouchableOpacity>

            {/* Sort Options */}
            <Text style={styles.optionTitle}>Sort By:</Text>
            <TouchableOpacity onPress={() => setSortOption('name')}>
              <Text style={styles.optionText}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortOption('rating')}>
              <Text style={styles.optionText}>Rating</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortOption('price')}>
              <Text style={styles.optionText}>Price</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortOption('experience')}>
              <Text style={styles.optionText}>Experience</Text>
            </TouchableOpacity>

            <Button title="Apply" onPress={applyFilterSort} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    color: '#000'
  },
  filterSortButton: {
    backgroundColor: '#C8D8E8',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  filterSortButtonText: {
    color: '#000',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000'
  },
  profileList: {
    paddingBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  profileAddress: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  profileRating: {
    fontSize: 14,
    color: '#ff7700',
  },
  profileRate: {
    fontSize: 14,
    color: '#007bff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000'
  },
  optionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000'
  },
  optionText: {
    marginVertical: 5,
    color: '#007bff',
  },
});

export default SearchPage;