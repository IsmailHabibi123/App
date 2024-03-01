import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { Children } from 'react';

export default function KeyboardAvoidingWrapper({children}) {
  return (
    <KeyboardAvoidingView style={{flex:1}}>
        <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>{children}</>
            </TouchableWithoutFeedback>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({})