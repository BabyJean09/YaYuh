import * as React from 'react';
import HomePageP from './components/parent/HomePage';
import HomePageB from './components/babysitter/HomePage';
import { useSelector } from 'react-redux'; // Import useSelector to access the Redux store
import { RootState } from './redux/store'; // Import RootState for TypeScript typing
import { StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JobRequestPage from './components/parent/JobRequestPage';
import InboxPage from './components/parent//InboxPage';
import JobOfferPage from './components/babysitter/JobOfferPage';
import ParentsProfilePage from './components/babysitter/ParentsProfilePage';

const Tab = createBottomTabNavigator();
export default function BottomNav() {
    const role = useSelector((state: RootState) => state.auth.role); // Access role from Redux store

    const HomePage = role === 'parent' ? HomePageP : ParentsProfilePage;
    const JobPage = role === 'parent' ? JobRequestPage: JobOfferPage;
    
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    position: 'absolute',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    paddingTop: 10,
                    backgroundColor: '#C8D8E8'
                },
                tabBarShowLabel: false}}>
            <Tab.Screen name="Our Sitters" component={HomePage} options={{
                        tabBarIcon: ({focused}) => (
                            <Ionicon name={focused ? 'home' : 'home-outline'} color='white' size={30}/>
                        ),
                }}
            />
            <Tab.Screen name="Job Request" component={JobPage} options={{
                        tabBarIcon: ({focused}) => (
                            <MaterialIcon name={focused ? 'work' : 'work-outline'} color='white' size={30}/>
                        )
                }}
            />
            <Tab.Screen name="Notifications" component={InboxPage} options={{
                        tabBarIcon: ({focused}) => (
                            <Ionicon name={focused ? 'notifications' : 'notifications-outline'} color='white' size={30}/>
                        )
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})