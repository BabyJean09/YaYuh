import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity, Task, Alert, Modal, Image } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const TaskMonitoringPage: React.FC<any> = ({ route }) => {
  const navigation = useNavigation();
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
  const role = useSelector((state: RootState) => state.auth.role); // Access role from Redux store
  const [taskList, setTaskList] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskImage, setSelectedTaskImage] = useState<string | null>(null);
  const { parent_id } = route.params || {};

  // Fetch tasks from server
  useEffect(() => {
    fetchTasks();
  }, [userEmail]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://192.168.1.157:3000/api/worklog/${parent_id}`);
      setTaskList(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Could not fetch tasks. Please try again.');
    }
  };

  const renderTask = ({ item, index }) => (
    <View>
      <View style={styles.taskContainer2}>
        <View style={styles.taskContainer}>
          <Text style={styles.taskNumber}>{index + 1}.</Text>
          <Text style={[styles.taskTitle, item.status === 'completed' && styles.doneTask]}>{item.task_details}</Text>
        </View>
        <Text style={{fontSize: 12, left: 25, color: 'gray'}}>{item.time_range}</Text>
      </View>
    </View>
  );

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
    color: '#000'
  },
  taskList: {
    marginTop: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: -5
  },
  taskContainer2: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 5
  },
  taskNumber: {
    fontSize: 16,
    marginRight: 10,
    color: '#007bff', // Optional: Style for task number
  },
  taskTitle: {
    fontSize: 16,
    flex: 1,
    color: '#000'
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
});

export default TaskMonitoringPage;
