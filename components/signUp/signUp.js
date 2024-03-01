import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { ColorApp } from '../../services/ColorApp';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpBody({ navigation }) {
  // State variables
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  // Toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Sign up logic
  const signUpTest = async () => {
    console.log('Sign up process started.');

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      console.log('Error: Passwords do not match.');
      return;
    }

    try {
      console.log('Attempting to create user with email and password.');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(`User created with UID: ${user.uid}`);

      console.log('Attempting to save user details to Firestore.');
      await setDoc(doc(db, 'users', user.uid), {
            firstName,
            lastName,
            email,
            actor: "normal user",
          });
      console.log('User details saved to Firestore');

      navigation.navigate('CustomerHome');
      Alert.alert("Success", "User created successfully");
      console.log('User registration successful, navigated to Home.');
    } catch (err) {
      console.error('Error during sign up:', err);
      Alert.alert("Error", err.message);
    }
  };



  return (
    <View style={{ width: '100%' }}>
      <SignUpHeader />
      <View style={{ width: '100%' }}>
        <View style={styles.container}>
          <View style={styles.inlineInputs}>
            <TextInput
              style={styles.inputStyle}
              placeholder='First Name'
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.inputStyle}
              placeholder='Last Name'
              onChangeText={setLastName}
            />
          </View>
          <TextInput
            style={styles.inputs}
            placeholder='Email'
            onChangeText={setEmail}
          />
          <View style={styles.handleInputs}>
            <TextInput
              style={styles.inputs}
              placeholder='Password'
              secureTextEntry={showPassword}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.eyeStyle} onPress={togglePassword}>
              {showPassword ? <Entypo name="eye" size={24} color="black" /> :
                <Entypo name="eye-with-line" size={24} color="black" />}
            </TouchableOpacity>
          </View>
          <View style={styles.handleInputs}>
            <TextInput
              style={styles.inputs}
              placeholder='Confirm Password'
              secureTextEntry={showConfirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeStyle} onPress={toggleConfirmPassword}>
              {showConfirmPassword ? <Entypo name="eye" size={24} color="black" /> :
                <Entypo name="eye-with-line" size={24} color="black" />}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={signUpTest} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <View style={styles.CombinedStyle}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.TextButton}>Login here</Text>
            </TouchableOpacity>
            <Text style={styles.TextStyle}>Already have an account?</Text>
          </View>
        </View>
      </View>
    </View>
  );
}


function SignUpHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Sign Up</Text>
    </View>
  );
}

// Combine and adjust styles from both components
const styles = StyleSheet.create({
    headerContainer: {
      alignItems: "center",
      justifyContent: 'center', // Center the header vertically
    },
    title: {
      fontSize: 40,
      fontWeight: "bold",
      color: ColorApp(),
      marginTop: 90, // Give some vertical space
      marginBottom: 40,
    },
    container: {
      padding: 20,
    },
    inlineInputs: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15, // Space between inline inputs and the next element
    },
    inputStyle : {
      flex: 1, // Take available space
      marginHorizontal: 5, // Space between two inputs
      marginBottom: 10,
      borderWidth: 1,
      padding: 15,
      backgroundColor: "white",
      borderRadius: 30,
      fontSize: 16,
      borderColor: ColorApp(),
    },
    inputs: {
      borderWidth: 1,
      padding: 15,
      backgroundColor: "white",
      marginVertical: 20,
      borderRadius: 30,
      fontSize: 16,
      borderColor: ColorApp(),
      marginBottom: 15, // Space between inputs
    },
    button:{
      paddingVertical: 10, // More padding for button
      backgroundColor: ColorApp(),
      borderRadius: 30,
      marginTop: 20,
    },
    buttonText:{
      textAlign: 'center', // Center text inside the button
      fontSize: 18,
      color: "white",
    },
    CombinedStyle:{
      flexDirection: "row",
      justifyContent: 'center', // Center the text and the link
      marginVertical: 10, // Give some vertical space
    },
    TextButton:{
      marginTop: 10,
      textDecorationLine: 'underline',
      fontSize: 15,
      color: ColorApp(),
      marginHorizontal: 5, // Space between text and link
    },
    TextStyle: {
      color: ColorApp(),
      marginTop: 10,
      fontSize: 15,
      color: 'black',
    },
    eyeStyle: {
      position: 'absolute',
      right: 15,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    handleInputs: {
      position: 'relative',
//      marginBottom: 15,
    },
});
