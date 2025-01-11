import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const WorklogPage: React.FC<any> = ({ route }) => {
  const navigation = useNavigation();
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
  const role = useSelector((state: RootState) => state.auth.role); // Access role from Redux store
  const [taskList, setTaskList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskImage, setSelectedTaskImage] = useState<string | null>(null);
  const [selectedTaskTimeUploaded, setSelectedTaskTimeUploaded] = useState<string | null>(null); // New state for time_uploaded
  const { parent_id } = route.params || {};

  // Fetch tasks from server
  useEffect(() => {
    fetchTasks();
    const unsubscribe = navigation.addListener('focus', fetchTasks);
    return unsubscribe;
  }, [navigation]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/worklog/${parent_id}`);
      setTaskList(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Could not fetch tasks. Please try again.');
    }
  };

  const formatTime = (time: string) => {
    const date = new Date(time); // Convert the time string to a Date object
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Use 12-hour format (AM/PM)
    };
    return new Intl.DateTimeFormat('en-US', options).format(date); // Format the date to hh:mm AM/PM
  };

  const renderTask = ({ item, index }) => {
    // Construct the image URL
    const imageUrl = item.image ? `http://localhost:3000/${item.image}` : null;
    console.log(imageUrl);
    return (
      <View>
        <View style={styles.taskContainer2}>
          <View style={styles.taskContainer}>
            <Text style={styles.taskNumber}>{index + 1}.</Text>
            <Text style={[styles.taskTitle, item.status === 'completed' && styles.doneTask]}>{item.task_details}</Text>

            {role === 'parent' ? (
              // If image exists, show the "View" button
              item.image ? (
                <TouchableOpacity
                  style={{ right: 15 }}
                  onPress={() => {
                    setSelectedTaskImage(imageUrl);  // Set the image URL for viewing
                    setSelectedTaskTimeUploaded(item.time_uploaded); // Set the time_uploaded
                    setModalVisible(true);  // Open the modal to show the image
                  }}
                >
                  <Ionicon name="image" color="#C8D8E8" size={30} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ right: 15 }}
                  onPress={() => 
                    setModalVisible(true)
                  }
                >
                  <Ionicon name="image" color="#C8D8E8" size={30} />
                </TouchableOpacity>
              )
            ) : (
              // If image exists, show the "View" button
              item.image ? (
                <TouchableOpacity
                  style={{ right: 15 }}
                  onPress={() => {
                    setSelectedTaskImage(imageUrl);  // Set the image URL for viewing
                    setSelectedTaskTimeUploaded(item.time_uploaded); // Set the time_uploaded
                    setModalVisible(true);  // Open the modal to show the image
                  }}
                >
                  <Ionicon name="image" color="#C8D8E8" size={30} />
                </TouchableOpacity>
              ) : (
                // If no image, show the "Take Photo" button
                <TouchableOpacity
                  style={{ right: 15 }}
                  onPress={() => navigation.navigate('TaskTakePhoto', { task_id: item.task_id })}
                >
                  <Ionicon name="camera" color="#C8D8E8" size={30} />
                </TouchableOpacity>
              )
            )}
          </View>
          <Text style={{ fontSize: 12, left: 25, color: 'gray' }}>{item.time_range}</Text>
        </View>
      </View>
    );
  };

  const handleFinishButton = () => {
    const taskData = taskList.map(task => ({
      time_range: task.time_range, // Example: '08:00 - 10:00'
    }));

    axios.post(`http://192.168.1.157:3000/api/update-worklog/${userEmail}`, {
      taskList: taskData,
    })
    .then((response) => {
      console.log('Worklog updated:', response.data);
      Alert.alert('Success', response.data.message);
    })
    .catch((error) => {
      console.error('Error updating worklog:', error);
      Alert.alert('Error', error.response ? error.response.data.message : 'Internal Server Error');
    });
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Tasks</Text>
      <FlatList
        data={taskList}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderTask}
        style={styles.taskList}
        ListEmptyComponent={
          <Text style={styles.noTaskText}>No tasks available.</Text>
        }
      />
      {/* Modal to show image */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTaskImage ? (
              <Image source={{ uri: selectedTaskImage }} style={styles.taskImage} resizeMode="contain" />
            ) : (
              <Text style={styles.pendingText}>Task is still pending.</Text>
            )}
            <Text style={styles.timeUploadedText}>
              Uploaded at: {selectedTaskTimeUploaded ? formatTime(selectedTaskTimeUploaded) : 'N/A'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Finished Button */}
      <TouchableOpacity style={styles.finishedButton} onPress={handleFinishButton}>
        <Text style={styles.finishedButtonText}>Finish Task</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  taskList: {
    marginTop: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: -10,
  },
  taskContainer2: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 5,
  },
  taskNumber: {
    fontSize: 16,
    marginRight: 10,
    color: '#007bff', // Optional: Style for task number
  },
  taskTitle: {
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  doneTask: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  statusText: {
    fontSize: 16,
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
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  taskImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  pendingText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  timeUploadedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#C8D8E8',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noTaskText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
  finishedButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  finishedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WorklogPage;