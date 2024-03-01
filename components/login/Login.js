import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { ColorApp } from '../../services/ColorApp';
import { Divider } from 'react-native-elements';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
export default function LoginScreen({ navigation }) {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
      if (isLoading) return; // Prevent multiple presses
      setIsLoading(true); // Disable the login button

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in successfully");

        // Get user's document from Firestore
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
              // Check the actor field and navigate accordingly]
              console.log(userData.actor);
              switch (userData.actor) {
                case 'normal user':
                  navigation.navigate('CustomerHome');
                  break;
                case 'Admin':
                  navigation.navigate('AdminHome');
                  break;
                // Add more cases as needed
                case 'Delivery Guy':
                  navigation.navigate('DeliveryGuyHome');
                  break;

              }
//        navigation.navigate('Tab');
       }
      } catch (error) {
        console.error("Login failed: ", error);
        Alert.alert("Login Failed", error.message);
      }

      setIsLoading(false); // Re-enable the login button
    };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={false}>
        {/* Login Header */}
        <View style={styles.headerContainer}>
          <Image style={styles.logo} source={require('../../assets/img/HaniLogo.png')} />
          <Text style={styles.title}>Cake Ordering App</Text>
        </View>

        {/* Login Inputs */}
        <View style={styles.handleInputs}>
          <AntDesign name={"user"} size={30} color={"black"} />
          <TextInput
            style={styles.inputs}
            placeholder='Email'
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.handleInputs}>
          <AntDesign name={"lock"} size={30} color={"black"} />
          <TextInput
            style={styles.inputs}
            placeholder='Password'
            secureTextEntry={showPassword}
            autoCapitalize="none"
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eyeStyle} onPress={togglePasswordVisibility}>
            {showPassword ? (
              <Entypo name="eye" size={24} color="black" />
            ) : (
              <Entypo name="eye-with-line" size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>

        {/* Login Button */}
       <TouchableOpacity
         onPress={handleLogin}
         style={styles.button}
         disabled={isLoading} // Disable the button when loading
       >
         <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Login'}</Text>
       </TouchableOpacity>


        <Divider style={styles.divider} orientation="horizontal" width={3} color='black' />

        {/* Sign Up Navigation */}
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Combine all styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    width: "100%",
  },
  headerContainer: {
    alignItems: "center",
  },
  logo: {
    marginTop: 60,
    height: 220,
    width: "78%",
    borderRadius: 150, // circle shape
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 20,
    color: ColorApp(),
  },
  handleInputs: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 30,
    borderColor: ColorApp(),
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20,
    paddingLeft: 15,
    backgroundColor: "white",
    position: 'relative',
    margin: 20,
  },
  inputs: {
    padding: 15,
    fontSize: 18,
    flex: 1,
  },
  eyeStyle: {
    marginRight: 18,
  },
  button: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    backgroundColor: ColorApp(),
    borderColor: "black",
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  divider: {
    marginBottom: 15,
    marginTop: 15,
    marginLeft: 50,
    marginRight: 50,
  },
});
