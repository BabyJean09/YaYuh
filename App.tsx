import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicon from 'react-native-vector-icons/Ionicons'; 
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { Provider } from 'react-redux';
import store from './redux/store';

import WelcomePage from './components/WelcomePage';
import ChoosePage from './components/ChoosePage';
import SignUpPage from './components/SignupPage';
import VerificationForm from './components/VerificationForm';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import NewPasswordPage from './components/NewPasswordPage';
import VerificationPage from './components/VerificationCodePage';
import AboutAppPage from './components/AboutAppPage';
import Toast from 'react-native-toast-message';

//Parents Page
import BottomNav from './AppBottomNavigator';
import ProfilePage from './components/parent/ProfilePage';
import BabysitterProfilePage from './components/parent/BabysitterProfilePage';
import PaymentCheckoutPage from './components/parent/PaymentPage';
import PaymentHistoryPage from './components/parent/PaymentHistoryPage';
import EmergencyContactListPage from './components/parent/EmergencyContactListPage';
import ManageEmergencyContactListPage from './components/parent/ManageEmergencyContactListPage';
import HelpSupportPage from './components/parent/HelpSupportPage';
import SavedBabysittersPage from './components/parent/SavedBabysitterPage';
import JobRequestPage from './components/parent/JobRequestPage';
import SubscriptionPage from './components/parent/SubscriptionPage';
import SearchPage from './components/parent/SearchPage';
import TaskMonitoringPage from './components/parent/TaskMonitorPage';
import TaskManagementPage from './components/parent/TaskManagementPage';
import YourProfilePage from './components/parent/YourProfilePage';
import SettingsPage from './components/parent/SettingsPage';
import AccountInformationPage from './components/parent/AccountInfoPage';
import SideBarPage from './components/parent/SideBarPage';
import ParentChildForm from './components/parent/VerificationForm2';

//Babysitters Page
import AccountInformationPageB from './components/babysitter/AccountInfoPage';
import PaymentHistoryPageB from './components/babysitter/PaymentHistoryPage';
import JobOfferPage from './components/babysitter/JobOfferPage';
import ParentsProfilePage from './components/babysitter/ParentsProfilePage';
import CreditScorePage from './components/babysitter/CreditScorePage';
import ProfilePageB from './components/babysitter/ProfilePage';
import TaskTakePhoto from './components/babysitter/TaskTakePhoto';
import PaymentConfirmationScreen from './components/parent/UploadReceipt';
import { RootStackParamList } from './components/parent/types/RootStackParamList';
import PaymentPreference from './components/babysitter/PaymentPreference';
import IDCapturePage from './components/parent/IDcapturePage';
import WorklogPage from './components/babysitter/Worklog';
import UploadReceipt from './components/parent/UploadReceipt';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function RootStack() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#C8D8E8',
        },
        }}>
      <Stack.Screen name='Welcome' component={WelcomePage} options={{ headerShown: false }} />
      <Stack.Screen name='Choose' component={ChoosePage} options={{ headerShown: false }}/>
      <Stack.Screen name='Signup' component={SignUpPage} options={{ headerShown: false }}/>
      <Stack.Screen name='Login' component={LoginPage} options={{ headerShown: false }}/>
          
      {/*Parents Page*/}
      <Stack.Screen name="Home" component={BottomNav}
        options={{
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30,
          },
          title:"YaYuh!", 
          headerRight: () => (<View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Search' as never)} style={styles.search}>
            <Ionicon name='search' color='white' size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SideBar' as never)} style={styles.hamburger}>
            <Ionicon name='menu' color='white' size={30} />
            </TouchableOpacity>
          </View>
          ), headerLeft: () => (false)
        }}/>
        <Stack.Screen 
          name="SideBar" 
          options={{title: "   Your Profile", headerLeft: () => (
            <TouchableOpacity onPress={() =>{navigation.navigate("Home" as never)}}><Ionicon  name="arrow-back-outline" size={20} color="black"/></TouchableOpacity>
          ), headerRight: () => (<View><TouchableOpacity onPress={() => navigation.navigate('Settings' as never)}><Ionicon name='settings-outline' color='white' size={30}/></TouchableOpacity></View>)}} 
          component={SideBarPage} />
      <Stack.Screen name='Settings' component={SettingsPage} />
      <Stack.Screen name='AccInfo' component={AccountInformationPage} />
      <Stack.Screen name='ForgotPass' options={{title: 'Forgot Password'}} component={ForgotPasswordPage}/>
      <Stack.Screen name='VerifyCode' options={{title: 'Verification'}} component={VerificationPage}/>
      <Stack.Screen name='NewPass' options={{title: 'New Password'}} component={NewPasswordPage}/>
      <Stack.Screen name='Verification' component={VerificationForm}/>
      <Stack.Screen name='IDCapture' component={IDCapturePage}/>
      <Stack.Screen name='ParentChild' component={ParentChildForm}/>
      <Stack.Screen name='YourProfile' component={YourProfilePage}/>
      <Stack.Screen name='Profile' component={ProfilePage}/>
      <Stack.Screen name='Babysitter' component={BabysitterProfilePage}/>
      <Stack.Screen name='Payment' component={PaymentCheckoutPage}/>
      <Stack.Screen 
        name='PaymentPrefer'
        options={{title: 'Preferred Payment',
          headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('PaymentHistory')}><MaterialIcon name='history' color='white' size={30}/></TouchableOpacity>)}} component={PaymentPreference}/>
      <Stack.Screen name='UploadReceipt' component={UploadReceipt}/>
      <Stack.Screen name='PaymentHistory' options={{title: 'Payment History'}} component={PaymentHistoryPage}/>
      <Stack.Screen name='ManageEmergency' component={ManageEmergencyContactListPage}/>
      <Stack.Screen name='Emergency' component={EmergencyContactListPage}/>
      <Stack.Screen name='HelpSupport' component={HelpSupportPage}/>
      <Stack.Screen name='AboutApp' component={AboutAppPage}/>
      <Stack.Screen name='SavedBabysitter' component={SavedBabysittersPage}/>
      <Stack.Screen name='JobRequest' component={JobRequestPage} />
      <Stack.Screen name='Subscription' component={SubscriptionPage} />
      <Stack.Screen name='Search' component={SearchPage} />
      <Stack.Screen name='TaskManage' component={TaskManagementPage} />
      <Stack.Screen name='TaskMonitor' component={TaskMonitoringPage} />
      <Stack.Screen name='TaskTakePhoto' component={TaskTakePhoto} />

      {/*Babysitters Page*/}
      <Stack.Screen name='AccInfoB' component={AccountInformationPageB} />
      <Stack.Screen name='PaymentHistoryB' component={PaymentHistoryPageB}/>
      <Stack.Screen name='JobOffer' component={JobOfferPage}/>
      <Stack.Screen name='ParentsProfile' component={ParentsProfilePage}/>
      <Stack.Screen name='CreditScore' component={CreditScorePage}/>
      <Stack.Screen name='ProfileB' component={ProfilePageB}/>
      <Stack.Screen name='Worklog' component={WorklogPage}/>
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
          <RootStack/>
          <Toast />
        </NavigationContainer>
    </Provider>
    
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40,
    color: 'black',
  },
  search: {
    marginLeft: 100,
  },
  hamburger: {
    marginLeft: 30,
  },
  headerIcon: {
    width: 40,
    height: 40,
  }
})