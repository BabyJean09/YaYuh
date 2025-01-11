import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const InboxPage = ({ route }: { route: any }) => {
  const navigation = useNavigation();
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access role from Redux store
  const userRole = useSelector((state: RootState) => state.auth.role); // Access role from Redux store
  const [activeTab, setActiveTab] = useState('referral'); // Manage the selected tab
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://192.168.1.157:3000/api/notifications/${userEmail}`)
      .then((response) => {
        setNotifications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      });
  }, [userEmail]);

  // Render each referral item
  const renderReferralItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Profile', { profileId: item.id })} style={styles.referralCard}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.name}>{item.name || 'Unknown'}</Text>
        <Text style={styles.address}>
          <Ionicon name="location" size={16} /> {item.address || 'N/A'}
        </Text>
        <Text style={styles.rating}>Rating: {item.rating || '0'} ★</Text>
        <Text style={styles.price}>₱{item.price}/hr</Text>
        <Text style={styles.timeDate}>{item.time || 'Unknown'} - {item.date || 'Unknown'}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render each notification item
  const renderNotificationItem = ({ item }: { item: any }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.title || 'No Title'}</Text>
      <Text style={styles.notificationMessage}>{item.message ||  'No message available.'}</Text>
      <Text style={styles.timeDate}>{item.time || 'Unknown'} - {item.date || 'Unknown'}</Text>
    </View>
  );

  // Empty state rendering
  const renderEmptyState = (message: string) => (
    <Text style={styles.emptyText}>{message}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'referral' && styles.activeTab]}
          onPress={() => setActiveTab('referral')}
        >
          <Text style={styles.tabText}>Referrals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={styles.tabText}>Notifications</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : activeTab === 'referral' ? (
        <FlatList
          data={[]}
          renderItem={renderReferralItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.notification_Id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#C8D8E8',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  referralCard: {
    flexDirection: 'row',
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  address: {
    fontSize: 14,
    color: '#888',
  },
  rating: {
    fontSize: 14,
    color: '#ff7700',
  },
  price: {
    fontSize: 16,
    color: '#1E90FF',
    marginVertical: 5,
  },
  timeDate: {
    fontSize: 12,
    color: '#888',
  },
  notificationCard: {
    backgroundColor: '#C8D8E8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  notificationMessage: {
    fontSize: 14,
    marginVertical: 5,
    color: '#000'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default InboxPage;
