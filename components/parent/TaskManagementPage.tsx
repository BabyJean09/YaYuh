import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const DEFAULT_TASKS = [
  'Feeding the children',
  'Changing diapers',
  'Putting children to bed',
  'Supervising playtime',
  'Helping with homework',
  'Bathing the children',
  'Preparing meals/snacks',
  'Reading stories',
  'Light cleaning related to the children',
  'Monitoring nap time',
];

const TaskManagementPage = () => {
  const userEmail = useSelector((state: RootState) => state.auth.email); // Access email from Redux store 
  const [taskList, setTaskList] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://192.168.1.157:3000/api/task/${userEmail}`);
      setTaskList(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Could not fetch tasks. Please try again.');
    }
  };

  const addManualTask = async () => {
    if (!taskTitle.trim() || !timeRange) {
      Alert.alert('Error', 'Task title and time range cannot be empty.');
      return;
    }
  
    // Check if the new task_details already exists in the task list
    const isTaskExists = taskList.some(
      (task) => task.task_details.toLowerCase() === taskTitle.toLowerCase()
    );
  
    if (isTaskExists) {
      Alert.alert('Error', 'A task with the same details already exists.');
      return; // Prevent adding a task with the same details
    }
  
    // Add task to local state
    setTaskList((prev) => [
      ...prev,
      {
        task_id: taskList.length + 1,  // Assuming auto-increment for task_id
        task_details: taskTitle,
        time_range: timeRange,
        status: 'pending',
      },
    ]);
  
    try {
      // Send new task to the backend
      await axios.post(`http://192.168.1.157:3000/api/tasks/${userEmail}`, {
        tasks: [
          {
            task_details: taskTitle,
            time_range: timeRange,
            status: 'pending',  // You can change this based on your status logic
          },
        ],
      });
  
      Alert.alert('Success', 'Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task. Please try again.');
    }
  
    // Reset the form after adding task
    setTaskTitle('');
    setTimeRange('');
  };
  

  const updateTask = async () => {
    if (!taskTitle.trim() || !timeRange) {
      Alert.alert('Error', 'Task title and time range cannot be empty.');
      return;
    }
    // Update task in local state
    setTaskList((prev) =>
      prev.map((task) =>
        task.task_id === taskBeingEdited  // Ensure you're updating the correct task
          ? { ...task, task_details: taskTitle, time_range: timeRange }  // Update task details and time range
          : task
      )
    );
  
    try {
      // Send updated task to the backend
      await axios.post(`http://192.168.1.157:3000/api/tasks/${userEmail}`, {
        tasks: [
          {
            task_id: taskBeingEdited,  // Use the task_id for the update request
            task_details: taskTitle,
            time_range: timeRange,
            status: 'pending',  // Status can be customized as needed
          },
        ],
      });
  
      Alert.alert('Success', 'Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  
    // Reset the form after updating
    setTaskBeingEdited(null);
    setTaskTitle('');
    setTimeRange('');
  };
  

  const toggleTaskSelection = (task) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks((prev) => prev.filter((t) => t !== task));
    } else {
      setSelectedTasks((prev) => [...prev, task]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTasks.length === DEFAULT_TASKS.length) {
      setSelectedTasks([]); // Deselect all tasks
    } else {
      setSelectedTasks(DEFAULT_TASKS); // Select all tasks
    }
  };

  const saveSelectedTasks = async () => {
    const newTasks = selectedTasks.map((task) => ({
      task_details: task,
      status: 'pending',
      time_range: timeRange,
      isManual: false,
    }));

    const tasksToAdd = newTasks.filter((newTask) => {
      return !taskList.some(
        (existingTask) => existingTask.task_details.toLowerCase() === newTask.task_details.toLowerCase()
      );
    });
  
    if (tasksToAdd.length === 0) {
      Alert.alert('No New Tasks', 'The tasks you selected already exist.');
      return; // No new tasks to add
    }
  
    try {
      // Send the new tasks to the backend for saving
      await axios.post(`http://192.168.1.157:3000/api/tasks/${userEmail}`, {
        tasks: tasksToAdd,
      });
      setTaskList((prev) => [...newTasks, ...prev]);
      setSelectedTasks([]); // Reset selected tasks
      setModalVisible(false); // Close the modal
      fetchTasks(); // Refresh task list after save
    } catch (error) {
      console.error('Error saving tasks:', error);
      Alert.alert('Error', 'Could not save tasks. Please try again.');
    }
  };

  const editTask = (id) => {
    const taskToEdit = taskList.find((task) => task.task_id === id);  // Adjusted to use task_id
  
    if (taskToEdit) {
      setTaskBeingEdited(id);  // Store the task ID being edited
      setTaskTitle(taskToEdit.task_details);  // Pre-fill the task details
      setTimeRange(taskToEdit.time_range || '');  // Pre-fill the time range
  
      if (taskToEdit.time_range) {
        const [start, end] = taskToEdit.time_range.split(' - ');
  
        // Ensure that both start and end times are valid
        const parsedStart = new Date(`1970-01-01T${start}`);
        const parsedEnd = new Date(`1970-01-01T${end}`);
  
        // Check if the time values are valid
        if (!isNaN(parsedStart.getTime()) && !isNaN(parsedEnd.getTime())) {
          setStartTime(parsedStart);  // Set start time
          setEndTime(parsedEnd);      // Set end time
        }
        //  else {
        //   Alert.alert('Error', 'Invalid time format in the task.');
        // }
      }
    }
  };  

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://192.168.1.157:3000/api/task/${id}`);
      setTaskList((prev) => prev.filter((task) => task.task_id !== id)); // Remove task from local state
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Could not delete task. Please try again.');
    }
  };
  

  const handleStartTimeChange = (event, selectedDate) => {
    setShowStartTimePicker(false);
    if (selectedDate) {
      setStartTime(selectedDate);
      setTimeRange(`${selectedDate.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`);
    }
  };

  const handleEndTimeChange = (event, selectedDate) => {
    setShowEndTimePicker(false);
    if (selectedDate) {
      setEndTime(selectedDate);
      setTimeRange(`${startTime.toLocaleTimeString()} - ${selectedDate.toLocaleTimeString()}`);
    }
  };

  const renderTask = ({ item, index }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>
        Task {index + 1}: {item.task_details}
      </Text>
      <Text style={styles.taskTime}>Time Range: {item.time_range || 'Not set'}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => editTask(item.task_id)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.task_id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.modalButtonText}>Choose Default Tasks</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter manual task title"
        placeholderTextColor="gray"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.timeButton}>
        <Text style={styles.timeText}>Start Time: {startTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.timeButton}>
        <Text style={styles.timeText}>End Time: {endTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {/* Start Time Picker Modal */}
      {showStartTimePicker && (
        <DateTimePicker
          mode="time"
          value={startTime}
          display="spinner"
          onChange={handleStartTimeChange}
        />
      )}

      {/* End Time Picker Modal */}
      {showEndTimePicker && (
        <DateTimePicker
          mode="time"
          value={endTime}
          display="spinner"
          onChange={handleEndTimeChange}
        />
      )}

      <TouchableOpacity
        style={taskBeingEdited ? styles.addButton : styles.addButton}
        onPress={taskBeingEdited ? updateTask : addManualTask}
      >
        <Text style={styles.addButtonText}>
          {taskBeingEdited ? 'Update Task' : 'Add Manual Task'}
        </Text>
      </TouchableOpacity>

      {taskBeingEdited && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setTaskBeingEdited(null);  // Reset editing state
            setTaskTitle('');
            setTimeRange('');
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={taskList}
        keyExtractor={(item) => item.task_id}  // Ensure the key is unique
        renderItem={renderTask}
        style={styles.taskList}
        ListEmptyComponent={<Text style={styles.noTaskText}>No tasks added yet.</Text>}
      />


      {/* <TouchableOpacity style={styles.saveButton} onPress={saveTasks}>
        <Text style={styles.saveButtonText}>Save Tasks</Text>
      </TouchableOpacity> */}

      {/* Modal for task selection */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Tasks</Text>

           {/* Select All Button */}
           <TouchableOpacity onPress={toggleSelectAll}>
            <Text style={styles.selectAllButtonText}>
              {selectedTasks.length === DEFAULT_TASKS.length ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>

          <FlatList
            data={DEFAULT_TASKS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleTaskSelection(item)}>
                <View
                  style={[
                    styles.defaultTaskButton,
                    selectedTasks.includes(item) && styles.selectedTaskButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.defaultTaskText,
                      selectedTasks.includes(item) && styles.selectedTaskText,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.saveModalButton}
            onPress={saveSelectedTasks}
          >
            <Text style={styles.saveModalButtonText}>Save Selected Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  taskContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  taskTime: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  buttonText: {
    color: '#007BFF',
    marginRight: 16,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    marginBottom: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    color: '#000'
  },
  timeButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 8,
  },
  timeText: {
    color: '#000',
    fontSize: 16,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#28a745',
    marginTop: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  selectAllButtonText: {
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#dc3545',
    marginTop: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  taskList: {
    marginTop: 20,
  },
  noTaskText: {
    textAlign: 'center',
    color: 'gray',
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    marginTop: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000'
  },
  defaultTaskButton: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedTaskButton: {
    backgroundColor: '#007BFF',
  },
  defaultTaskText: {
    fontSize: 16,
    color: '#000'
  },
  selectedTaskText: {
    color: '#fff',
  },
  checkmark: {
    position: 'absolute',
    right: 10,
    top: 10,
    fontSize: 20,
    color: '#28a745',
  },
  saveModalButton: {
    padding: 10,
    backgroundColor: '#28a745',
    marginTop: 20,
    borderRadius: 8,
  },
  saveModalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeModalButton: {
    padding: 10,
    backgroundColor: '#ccc',
    marginTop: 10,
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: '#000',
    textAlign: 'center',
  },
});

export default TaskManagementPage;
