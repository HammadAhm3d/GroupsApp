/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/*Example of Expandable ListView in React Native*/
import React, {Component} from 'react';
//import react in our project
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-community/async-storage';
import {loadedData} from './LoadButton';
// import {loadedData} from './SaveButton';
//import basic react native components

export var checkedList = [];

export default class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List
  constructor(props) {
    super(props);
    this.state = {
      layoutHeight: 0,
      toggleCheckBox: false,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }
  checkChange = (item) => {
    this.setState({
      toggleCheckBox: !this.state.toggleCheckBox,
    });
    var id = item.id;
    console.log('checkbox:' + this.state.toggleCheckBox);
    if (this.state.toggleCheckBox === true) {
      var tmp = checkedList.filter(ind => ind !== id);
      checkedList = tmp;
    }
    else {
      if (!checkedList.includes(id)) {
        checkedList.push(item.id);
      }
    }
    console.log('checkedList: ' + checkedList);
    console.log('selected: ' + item.id);
  }
  changeColor = (item) => {
    console.log('item change color: ' + item.name + item.id);
    console.log('loaded data in change color: ' + loadedData);
    // console.log(loadedData.includes(item.id));
    return loadedData.includes(item.id) ? 'gray' : '#B4DCEE';
  }
  render() {
    return (
      <View>
{/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={{...styles.header, backgroundColor: this.changeColor(this.props.item)}}
          // style={styles.header}
          >
          <CheckBox
          disabled={false}
          value={this.state.toggleCheckBox}
          onValueChange={this.checkChange.bind(this, this.props.item)}
          />
          <Text style={styles.headerText}>{this.props.item.name}</Text>
        </TouchableOpacity>
         {/* Content under the header of the Expandable List Item*/ }
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
          }}>
          <TouchableOpacity
              key={this.props.item.id}
              style={styles.content}
              // onPress={() => alert('Id: ' + item.id + ' val: ' + item.message)}
              >
              <View style={styles.imageAndText}>
                <Image
                source={{ uri: this.props.item.full_picture }}
                style={styles.imageStyle}
                />
                {/* <Text style={styles.text}>{this.props.item.message}</Text> */}
                <Text style={styles.text}>{this.props.item.message.replace(this.props.item.link, '')}</Text>
              </View>
              <View style={styles.separator} />
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#F5FCFF',
  },
  topHeading: {
    paddingLeft: 10,
    fontSize: 20,
  },
  header: {
    backgroundColor: '#B4DCEE',
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  content: {
    // paddingBosubcategoryom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  imageStyle: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
  },
  imageAndText: {
    flexDirection: 'row',
  },
});
