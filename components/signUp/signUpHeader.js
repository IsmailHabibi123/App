import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import {ColorApp} from '../../services/ColorApp';
import { auth, app } from '../../firebaseConfig';
export default function SignUpHeader() {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
      alignItems: "center",
    },
    
    title:{
        marginLeft: 110,
        marginTop: 75,
        height: 180,
        width: "70%",
        fontSize: 50,
        fontWeight: "bold",
        marginBottom: -60,
        color: ColorApp(),
    },
  });