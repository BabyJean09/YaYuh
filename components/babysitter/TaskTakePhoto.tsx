import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Ionicon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const TaskTakePhoto: React.FC<any> = ({ route }) => {
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);
    const [uploadedImagePath, setUploadedImagePath] = useState(null);
    const { task_id } = route.params || {};

    const openCamera = () => {
        launchCamera({ mediaType: 'photo' }, (response) => {
            if (response.assets) {
                const photo = response.assets[0];
                setImageUri(photo.uri); // Save image URI locally
            }
        });
    };

    const uploadImage = async () => {
        if (!imageUri) {
            Alert.alert('Error', 'No image to upload.');
            return;
        }
    
        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg', // Adjust based on your image type
            name: 'photo.jpg', // Assign a name to the file
        });
    
        try {
            // Pass taskId dynamically here
            const response = await axios.post(
                `http://192.168.1.157:3000/api/worklog/upload-photo/${task_id}`, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            const { imagePath } = response.data;
    
            // Display the uploaded image by updating state
            setUploadedImagePath(imagePath);
    
            Alert.alert('Success', 'Image uploaded successfully.');
            navigation.goBack();
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', 'Failed to upload the image.');
        }
    };
    

    return (
        <View style={styles.container}>
            {imageUri ? (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                    <TouchableOpacity onPress={uploadImage} style={styles.uploadButton}>
                        <Ionicon name="cloud-upload" color="#C8D8E8" size={50} />
                        <Text style={styles.text}>Upload Photo</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={openCamera} style={styles.cameraContainer}>
                    <Ionicon name="camera" color="#C8D8E8" size={100} />
                    <Text style={styles.text}>Take Photo</Text>
                </TouchableOpacity>
            )}

            {uploadedImagePath && (
                <View style={styles.uploadedImageContainer}>
                    <Text>Uploaded Image:</Text>
                    <Image
                        source={{ uri: `http://localhost:3000/${uploadedImagePath}` }} // Display image from server path
                        style={styles.uploadedImage}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    cameraContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadedImageContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    uploadedImage: {
        width: 300,
        height: 400,
        marginTop: 10,
        borderRadius: 10,
    },
    text: {
        color: '#C8D8E8',
        fontSize: 20,
        fontWeight: 'bold',
    },
    uploadButton: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retakeButton: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TaskTakePhoto;
