import React, {Component} from 'react';
//import react in our project
import {View, Text, TouchableOpacity, Button,} from 'react-native';
import {checkedList} from './ExpandableItemComponent';
import AsyncStorage from '@react-native-community/async-storage';
const SaveButton = (props) => {
  return (
    <Button
      title="save"
      style={{paddingBottom: 20}}
      onPress={() => {
        saveData();
      }}
    />
  );
};
const saveData = async () => {
  try {
    AsyncStorage.clear();
    await AsyncStorage.setItem('@ListKey', JSON.stringify(checkedList));
    alert('data saved! click load to load changes');
    console.log('saved data: ' + checkedList);
  } catch (error) {
    alert('error saving.' + error);
  }
};
export default SaveButton;
