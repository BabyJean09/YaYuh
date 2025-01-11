import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './pages_parents/HomePage';
import JobRequestPage from './pages_parents/JobRequestPage';
import InboxPage from './pages_parents/InboxPage';
import ProfilePage from './pages/SideBarPage';
import Ionicons from '@react-native-vector-icons/ionicons';

const TabArr = [
  { route: 'Home', label: 'Our Sitters', type: Ionicons, activeIcon: 'home'}
];

const Tab = createBottomTabNavigator();

// Tab Navigator (with only Tab.Screen as children)
function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Job" component={JobRequestPage} />
      <Tab.Screen name="Inbox" component={InboxPage} />
      {/* Optionally add a Profile page as a tab */}
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default MyTabs;
