import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const UploadReceipt: React.FC<any> = ({ route }) => {
  const [receiptUri, setReceiptUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { info, babysiter_id, amount } = route.params || '';
  const selectImage = async () => {
    const options = {
      mediaType: 'photo',
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('Image selection cancelled');
    } else if (result.errorMessage) {
      console.error('ImagePicker Error:', result.errorMessage);
      Alert.alert('Error', 'Failed to open gallery');
    } else if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setReceiptUri(selectedImage.uri);
    }
  };

  const handleUpload = async () => {
    if (!receiptUri) {
      Alert.alert('Error', 'Please select a receipt first.');
      return;
    }
  
    try {
      setUploading(true);
  
      const formData = new FormData();
      formData.append('receipt', {
        uri: receiptUri,
        type: 'image/jpeg', // Adjust based on file type
        name: 'receipt.jpg',
      });
      formData.append('payment_method', info.pref_method); // Add additional fields
      formData.append('status', 'completed');
      formData.append('babysitter_id', babysiter_id);
      formData.append('parent_id', info.parent_id);
      formData.append('pay_pref', info.pay_pref);
      formData.append('amount', amount);
  
      const response = await axios.post('http://192.168.1.157:3000/api/upload-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Alert.alert('Upload Successful', 'Receipt uploaded successfully!');
      console.log('Upload Response:', response.data);
    } catch (error) {
      console.error('Upload Error:', error.response?.data || error.message);
      Alert.alert('Upload Failed', 'Failed to upload the receipt.');
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Receipt</Text>
      {receiptUri && <Image source={{ uri: receiptUri }} style={styles.imagePreview} />}
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Receipt</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: uploading ? '#ccc' : '#4CAF50' }]}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Upload Receipt'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default UploadReceipt;
