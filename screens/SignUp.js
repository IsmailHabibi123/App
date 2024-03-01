import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert } from 'react-native';
import React from 'react';
import SignUpBody from '../components/signUp/signUp';
import LoginHeader from '../components/login/Login';
import SignUpHeader from '../components/signUp/signUp';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingView';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

export default function SignUp({navigation}) {
  
  return (
    <KeyboardAvoidingWrapper>
    <View style={styles.container}>
      <ImageBackground style={styles.bg} source={require('../assets/img/background.jpg')}>
      <SignUpBody navigation={navigation}/>
      </ImageBackground>
    </View>
    </KeyboardAvoidingWrapper>
  )
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  bg: {
      width: width,
      height: height+100,
      flex: 1,
  }
});

{/*<TouchableOpacity onPress={() => navigation.goBack()} ><LoginHeader/> </TouchableOpacity>*/}