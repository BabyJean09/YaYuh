import React, { useState } from 'react';
import { View, Button, Text, Image, PermissionsAndroid, ScrollView, FlatList, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';

const IDCapturePage: React.FC<any> = ({ route }) => {
  const navigation = useNavigation();
  const user_id = useSelector((state: RootState) => state.auth.user_id);
  const { id } = route.params || '';
  const [imageUri, setImageUri] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [outputImages, setOutputImages] = useState(null);
  const [decision, setDecision] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadToIDAnalyzer = async (imageUri) => {
    try {
      const filePath = imageUri.replace('file://', '');
      const base64Image = await RNFS.readFile(filePath, 'base64');

      const options = {
        method: 'POST',
        url: 'https://api2.idanalyzer.com/scan',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API-KEY': 'lyaL6nyttfFJ2ynTOgqxD7SgDX109xMl',
        },
        data: {
          document: base64Image,
          documentType: 'ID',
          outputmode: 'json',
        },
      };

      const response = await axios.request(options);
      console.log('IDAnalyzer Response:', response.data);

      setExtractedData(response.data.data); // Store extracted data
      setDecision(response.data);
      setOutputImages(response.data.outputImage); // Store output images
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Failed', 'Could not process the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (decision?.decision === 'accept') {
      try {
        const response = await axios.post(`http://192.168.1.157:3000/api/verification`, {
          documentType: id,
          documentNumber: extractedData?.documentNumber[0].value,
          user_id
        });

        console.log('Data saved:', response.data);
        Alert.alert('Success', 'Data saved successfully.');
      } catch (error) {
        console.error('Error saving to database:', error);
        Alert.alert('Error', 'Could not save data to the database.');
      }
    } else {
      Alert.alert('Validation Failed', 'The document was not accepted.');
    }
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        const photo = response.assets[0];
        setImageUri(photo.uri); // Update image URI in state
        uploadToIDAnalyzer(photo.uri);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        const photo = response.assets[0];
        setImageUri(photo.uri); // Update image URI in state
        uploadToIDAnalyzer(photo.uri);
      }
    });
  };

  const handleAccept = () => {
    saveToDatabase();
    navigation.navigate('Verification', { extractedData, selectedId: id });  // Navigate to VerificationForm2 with data
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Take Photo" onPress={openCamera} />
      <Button title="Choose from Gallery" onPress={openGallery} />
      {imageUri && <Image source={{uri: imageUri}} style={{width: 200, height: 200}} />}
      {extractedData && decision && (
        <View style={styles.details}>
          <Text style={styles.text}>First Name: {extractedData?.firstName[0].value}</Text>
          <Text style={styles.text}>Last Name: {extractedData?.lastName[0].value}</Text>
          <Text style={styles.text}>Address: {extractedData?.address2[0].value}</Text>
          <Text style={styles.text}>Date of Birth: {extractedData?.dob[0].value}</Text>
          <Text style={styles.text}>Document Type: {id}</Text>
          <Text style={styles.text}>Document Number: {extractedData?.documentNumber[0].value}</Text>
          <Text style={styles.text}>Decision: {decision?.decision}</Text>
        </View>
      )}
      {outputImages && (
        <View>
          <Text>Face Image:</Text>
          <Image source={{uri: outputImages.face}} style={{width: 100, height: 100}} />
          <Text>Front Image:</Text>
          <Image source={{uri: outputImages.front}} style={{width: 200, height: 100}} />
        </View>
      )}

      <Button title="Accept" onPress={handleAccept} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  imageSmall: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  details: {
    alignItems: 'center',
    marginVertical: 20,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
});

export default IDCapturePage;
