import React, {Component} from 'react';
//import react in our project
import {View, Text, TouchableOpacity, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export var loadedData = [];
const LoadButton = (props) => {
  return <Button title="load" onPress={() => loadData()} />;
};
const loadData = async () => {
  try {
    // AsyncStorage.clear();
    const value = await AsyncStorage.getItem('@ListKey');
    if (value !== null) {
      // We have data!!
      console.log('data fetched');
      var ret_value = JSON.parse(value) || [];
      console.log('from return: ' + ret_value);
      alert('Login again to see changes!');
      loadedData = ret_value;
      return ret_value;
    }
  } catch (error) {
    alert('error loading.' + error);
  }
};
export default LoadButton;
