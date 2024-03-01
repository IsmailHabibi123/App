import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Hani SugarArt</Text>
      {/* Login Form */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email..."
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password..."
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {/* Signup Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupLink}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Assuming a black background as per the screenshot
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 28,
    color: 'pink', // Assuming the logo text is pink as per the screenshot
    marginBottom: 20,
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'pink', // Assuming the button is pink as per the screenshot
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  signupLink: {
    color: 'pink',
    marginTop: 20,
  },
});

export default LoginScreen;
