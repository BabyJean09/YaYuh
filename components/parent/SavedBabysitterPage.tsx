import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const SavedBabysittersPage = ({ route, navigation }: {route: any, navigation: any}) => {
  const { 
    savedBabysitters = [
      {} 
    ] } = route.params || {}; // Fetch saved babysitters data

  const renderBabysitter = ({ item }: {item: any}) => (
    <TouchableOpacity
      style={styles.babysitterCard}
      onPress={() => navigation.navigate('Profile', { profile: item })}
    >
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.babysitterImage} />
      <View style={styles.babysitterDetails}>
        <Text style={styles.babysitterName}>{item.name || 'Unknown'}</Text>
        <Text style={styles.babysitterRate}>₱{item.price}/hr</Text>
        <Text style={styles.babysitterRating}>Rating: {item.rating} ★</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Babysitters</Text>
      {savedBabysitters.length > 0 ? (
        <FlatList
          data={savedBabysitters}
          renderItem={renderBabysitter}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.emptyText}>You haven't saved any babysitters yet.</Text>
      )}
    </View>
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
    textAlign: 'center',
    color: '#000'
  },
  babysitterCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#C8D8E8',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    alignItems: 'center',
  },
  babysitterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  babysitterDetails: {
    flex: 1,
  },
  babysitterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  babysitterRate: {
    fontSize: 16,
    color: '#1E90FF',
    marginVertical: 5,
  },
  babysitterRating: {
    fontSize: 14,
    color: '#ff7700',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    color: '#888',
  },
});

export default SavedBabysittersPage;
