import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { Alert } from 'react-native';
import LoginInputs from '../login/Login';
import {AntDesign} from 'react-native-vector-icons';
import { ColorApp } from '../../services/ColorApp';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import SignUp from '../../screens/SignUp';
import { auth, db } from '../../firebaseConfig';

export default function SignUpBody({navigation}) {


  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");


  //const auth = firebase.auth();

  const signUpTest = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      console.log('Creating user...');
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log('User created:', user.uid);

      console.log('Saving user details to Firestore...');
      await db.collection('users').doc(user.uid).set({
        firstName,
        lastName,
        email,
      });
      console.log('User details saved to Firestore');

      // Navigate to the home screen and display success alert
      navigation.navigate('Home');
      Alert.alert("Success", "User created successfully");
    } catch (err) {
      console.error('Error during sign up:', err);
      Alert.alert("Error", err.message);
    }
  };




  //navigation={navigation}
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(true);
  const togglePassword = () => {
    setshowpassword(!showpassword);

  };

  const [password1, setpassword1] = useState("");
  const [showpassword1, setshowpassword1] = useState(true);
  const togglePassword1 = () => {
    setshowpassword1(!showpassword1);
  };

  return (
      <View style={{ width: '100%' }}>
        <View style={styles.container}>
          <View style={styles.inlineInputs}>
            <View style={styles.handleInputs}>
              <TextInput style={styles.inputStyle}  placeholder='First Name' onChangeText={(text) => setFirstName(text)}/>
            </View>
            <View style={styles.handleInputs}>
              <TextInput style={styles.inputStyle} placeholder='Last Name' onChangeText={(text) => setLastName(text)}/>
            </View>
          </View>
          {/*<LoginInputs /> */}
          <View style={styles.handleInputs}>
            <TextInput style={styles.inputs} placeholder='Email' onChangeText={(text) => setEmail(text)}/>
          </View>

          <View style={styles.handleInputs}>
            <TextInput style={styles.inputPassword}
            placeholder='Password'
            secureTextEntry={showpassword1}
            autoCapitalize="none"
            onChangeText= {(text) => setpassword1(text)}/>
            {/*eye configue1*/}
            <TouchableOpacity style={styles.eyestyle} onPress={togglePassword1}>
              {showpassword1 ? (
              <Entypo name="eye" size={24} color="black" />
              ) : (
              <Entypo name="eye-with-line" size={24} color="black" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.handleInputs}>
            <TextInput style={styles.inputPassword}
            placeholder='Confirm Password'
            secureTextEntry={showpassword}
            autoCapitalize="none"
            onChangeText= {(text) => setpassword(text)}/>
            {/*eye configue1*/}
            <TouchableOpacity style={styles.eyestyle} onPress={togglePassword}>
                {showpassword ? (
                    <Entypo name="eye" size={24}  color="black"/>
                ): (
                    <Entypo name="eye-with-line" size={24}  color="black"/>
                )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={signUpTest} activeOpacity={0.5} style={styles.button}>
                <View>
                    <Text style={styles.buttonText}>Register</Text>
                </View>
          </TouchableOpacity>

                <View style={styles.CombinedStyle}>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.5}>
                    <Text style={styles.Textbutton}>Login here</Text>
                  </TouchableOpacity>
                  <Text style = {styles.TextStyle}>Already have an account?</Text>
                </View>

          {/* Not the right solution to handle bg image */}
          <View style={{margin: 18}}></View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputStyle : {
    width: 190, // Adjust the width based on your requirement
    borderWidth: 2,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 30,
    fontSize: 17,
    paddingLeft: 15,
    borderColor: ColorApp(),
  },
  inlineInputs: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
  },
  handleInputs: {
    marginBottom: 30,
  },
  inputs: {
    height: 50,
    borderColor: 'black',
    borderWidth: 2,
    paddingLeft: 10,
    backgroundColor: "white",
    borderRadius: 30,
    fontSize: 17,
    paddingLeft: 15,
    borderColor: ColorApp(),
  },
  buttonText:{
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  button:{
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    backgroundColor: ColorApp(),
    borderColor: "black",
    marginLeft: 2,
    marginRight: 9,
    borderRadius: 30,
    marginTop: 10,
    width: 385,
  },
  Textbutton:{
    textDecorationLine: 'underline',
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 260,
    marginTop: 10,
   },
   TextStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: -300,
    marginTop: 10,
   },
  CombinedStyle:{
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    fontWeight: "bold",
    color: "black",
  },
  inputPassword: {
    height: 50,
    borderColor: 'black',
    borderWidth: 2,
    paddingLeft: 10,
    backgroundColor: "white",
    borderRadius: 30,
    fontSize: 17,
    paddingLeft: 15,
    borderColor: ColorApp(),
    flex: 1,
    position: 'relative',
  },
  eyestyle: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  }
});
