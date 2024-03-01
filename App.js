import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import AppNavigator from './AppNavigator';


export default function App({navigation}) {
  return (
    <>
        <StatusBar style='dark'/>
        <AppNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
