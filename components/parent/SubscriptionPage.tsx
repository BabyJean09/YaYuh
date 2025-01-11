import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Plan {
  id: number;
  name: string;
  price: number;
  features: string[];
}

const plans: Plan[] = [
  {
    id: 1,
    name: 'Basic Plan',
    price: 500,
    features: ['CCTV Monitoring', '7-day Cloud Storage'],
  },
  {
    id: 2,
    name: 'Standard Plan',
    price: 800,
    features: ['CCTV Monitoring', '30-day Cloud Storage'],
  },
  {
    id: 3,
    name: 'Premium Plan',
    price: 1200,
    features: ['CCTV Monitoring', '90-day Cloud Storage', 'High-Definition Video'],
  },
];

const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    if (selectedPlan) {
      // Simulate the subscription logic (e.g., call API)
      console.log(`Subscribed to: ${selectedPlan.name}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Child Monitoring Plans</Text>
      <Text style={styles.description}>
        Choose a plan to avail CCTV monitoring and cloud storage for your child’s safety.
      </Text>

      <View style={styles.planList}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan?.id === plan.id && styles.selectedPlanCard,
            ]}
            onPress={() => handlePlanSelect(plan)}
          >
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>₱{plan.price}</Text>
            <View style={styles.featuresList}>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.feature}>
                  • {feature}
                </Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedPlan && (
        <View style={styles.selectedPlanContainer}>
          <Text style={styles.selectedPlanText}>
            You selected: {selectedPlan.name} - ₱{selectedPlan.price}
          </Text>
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  planList: {
    marginBottom: 20,
  },
  planCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
  },
  selectedPlanCard: {
    borderColor: '#1E90FF',
    borderWidth: 2,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 16,
    color: '#1E90FF',
    marginBottom: 10,
  },
  featuresList: {
    marginTop: 10,
  },
  feature: {
    fontSize: 14,
    color: '#666',
  },
  selectedPlanContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedPlanText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubscriptionPage;