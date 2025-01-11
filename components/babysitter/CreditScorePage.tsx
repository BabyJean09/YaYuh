import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../../redux/store';

const CreditScorePage: React.FC = () => {
  const username = useSelector((state: RootState) => state.auth.username); // Access role from Redux store
  const userId = useSelector((state: RootState) => state.auth.user_id); // Assuming you store userId in Redux

  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCreditScore = async () => {
      try {
        const response = await axios.get(`http://192.168.1.157:3000/api/credit-score/${userId}`);
        setCurrentScore(response.data.current_score);
        // Optionally, you can also fetch history data here
      } catch (error) {
        console.error('Error fetching credit score:', error);
      }
    };

    fetchCreditScore();
  }, [userId]);

  const renderHistoryItem = ({ item }: { item: { id: number; date: string; score: number } }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyDate}>{item.date}</Text>
      <Text style={styles.historyScore}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Name section */}
      <Text style={styles.name}>{username}</Text>

      {/* Display current credit score */}
      <Text style={styles.scoreTitle}>Current Credit Score</Text>
      {currentScore !== null ? (
        <Text style={styles.scoreValue}>{currentScore}</Text>
      ) : (
        <Text style={styles.scoreValue}>Loading...</Text>
      )}

      {/* Credit Score History */}
      <Text style={styles.historyTitle}>Credit Score History</Text>
      {historyData.length > 0 ? (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHistoryItem}
          style={styles.historyList}
        />
      ) : (
        <Text style={styles.noHistoryText}>No history yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000'
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000'
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#000'
  },
  historyList: {
    marginTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyDate: {
    fontSize: 16,
    color: '#000'
  },
  historyScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  noHistoryText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
});

export default CreditScorePage;
