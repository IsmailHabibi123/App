import { StaaccepttusBar } from 'expo-status-bar';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LoginHeader from '../components/login/Login'

import LoginBody from '../components/login/Login';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingView';
import { Dimensions } from 'react-native';
export default function Login({navigation}) {
//  const navigation = useNavigation();
  return (
    <KeyboardAvoidingWrapper>
    <View>
      <ImageBackground style={styles.bg} source={require('../assets/img/background.jpg')}>

        <LoginBody navigation={navigation}/>
      </ImageBackground>
    </View>
    </KeyboardAvoidingWrapper>
  );
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  bg: {
      width: width,
      height: height+100,
    flex: 1,
  }
});