import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const JobRequestPage = () => {
  const userEmail = useSelector((state: RootState) => state.auth.email);
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState('upcoming');
  const [upcomingJobs, setUpcomingJobs] = useState<any[]>([]);
  const [pastJobs, setPastJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    const unsubscribe = navigation.addListener('focus', fetchJobs);
    return unsubscribe;
  }, [navigation]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://192.168.1.157:3000/api/job-request/${userEmail}`);
      const jobs = response.data;
  
      setUpcomingJobs(jobs.filter((job: any) => job.status === 'pending')); // Filter for upcoming jobs
      setPastJobs(jobs.filter((job: any) => job.status === 'completed')); // Filter for past jobs
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job offers:', error?.response?.data || error.message);
      setLoading(false);
    }
  };
  

  // Render each job item for upcoming jobs
  const renderJobUpcoming = ({ item } : { item: any }) => (
    <View><TouchableOpacity onPress={() => navigation.navigate('Profile', { profile: item })} style={styles.jobCard}>
        <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{item.first_name + ' ' + item.last_name || 'Unknown'}</Text>
            <Text style={styles.address}>
              <Ionicon name="location" size={16} /> {item.address || 'N/A'}
            </Text>
            <Text style={styles.rating}>Rating: {item.rating || '0'} ★</Text>
            <Text style={styles.timeDate}>{item.time || 'Unknown'} - {item.date || 'Unknown'}</Text>
            <Text style={styles.status}>Status: {item.status || 'Ongoing'}</Text>
          </View>
        </TouchableOpacity>
    </View>
  );

  // Render each job item for past jobs
  const renderJobPast= ({ item } : { item: any }) => (
    <View><TouchableOpacity onPress={() => navigation.navigate('ProfileB', { profile: item })} style={styles.jobCard}>
        <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{item.first_name + ' ' + item.last_name || 'Unknown'}</Text>
            <Text style={styles.address}>
              <Ionicon name="location" size={16} /> {item.address || 'N/A'}
            </Text>
            <Text style={styles.rating}>Rating: {item.rating || '0'} ★</Text>
            <Text style={styles.timeDate}>{item.time || 'Unknown'} - {item.date || 'Unknown'}</Text>
            <Text style={styles.status}>Status: {item.status || 'Ongoing'}</Text>
          </View>
        </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <Text style={styles.loadingText}>Loading job offers...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'upcoming' && styles.activeTab]}
          onPress={() => setCurrentTab('upcoming')}
        >
          <Text style={styles.tabText}>Upcoming Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'past' && styles.activeTab]}
          onPress={() => setCurrentTab('past')}
        >
          <Text style={styles.tabText}>Past Jobs</Text>
        </TouchableOpacity>
      </View>

      {currentTab === 'upcoming' ? (
        upcomingJobs.length > 0 ? (
        <FlatList
            data={upcomingJobs}
            renderItem={renderJobUpcoming}
            keyExtractor={(item) => item.job_request_id}
          />
        ) : (
          <Text style={styles.emptyText}>No upcoming jobs available.</Text>
        )
      ) : pastJobs.length > 0 ? (
        <FlatList
          data={pastJobs}
          renderItem={renderJobPast}
          keyExtractor={(item) => item.job_request_id}
        />
      ) : (
        <Text style={styles.emptyText}>No past jobs available.</Text>
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
  jobCard: {
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
    color: '#ffbf00',
  },
  timeDate: {
    fontSize: 12,
    color: '#888',
  },
  status: {
    fontSize: 14,
    color: 'green',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default JobRequestPage;