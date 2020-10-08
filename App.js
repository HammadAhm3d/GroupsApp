/* eslint-disable react-native/no-inline-styles */
/*Example of Expandable ListView in React Native*/
import React, {Component} from 'react';
//import react in our project
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  Image,
  ImageBackground,
  Button,
} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import SaveButton from './SaveButton';
import LoadButton from './LoadButton';

import ExpandableItemComponent from './ExpandableItemComponent';
//import basic react native components
export default class App extends Component {
  //Main View defined under this Class
  constructor() {
    super();
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      isLoggedIn: false,
      feed: [],
      isEmpFeed: false,
    };
  }

  updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.feed];
    //For Single Expand at a time
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex].isExpanded = !array[placeindex].isExpanded)
        : (array[placeindex].isExpanded = false),
    );

    //For Multiple Expand at a time
    //array[index]['isExpanded'] = !array[index]['isExpanded'];
    this.setState(() => {
      return {
        listDataSource: array,
      };
    });
  };

  get_Response_Info = (error, result) => {
    if (error) {
      //Alert for the Error
      alert('Error fetching data: ' + error.toString());
    } else {
      this.setState({isLoggedIn: true});
      if (result.data === undefined || result.data.length == 0) {
        console.log('empty feed');
        this.setState({
          feed: [],
          isEmpFeed: true,
        });
      } else {
        var feedArray = result.data;
        var expFeedArray = feedArray.map(function (el) {
          var arr = Object.assign({}, el);
          arr.isExpanded = false;
          return arr;
        });
        expFeedArray.pop();
        this.setState({feed: expFeedArray});
        console.log(this.state.feed);
      }
    }
  };
  getDateForLastOccurence(date, day) {
    const d = new Date(date.getTime());
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
    if (days.includes(day)) {
      const modifier = (d.getDay() + days.length - days.indexOf(day)) % 7 || 7;
      d.setDate(d.getDate() - modifier);
    }
    return d.toDateString();
  }
  onLogout = () => {
    //Clear the state after logout
    this.setState({
      isLoggedIn: false,
      feed: [],
      isEmpFeed: false,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('./bg.png')} style={styles.bgImage}>
          {this.state.isLoggedIn === false ? (
            <View style={styles.welcomeView}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.welcomeText}>Continue with Facebook</Text>
            </View>
          ) : (
            <View />
          )}
          <LoginButton
            readPermissions={[
              'public_profile',
              'groups_show_list',
              'user_managed_groups',
            ]}
            onLoginFinished={(error, result) => {
              if (error) {
                // alert(error);
                alert('login has error: ' + result.error);
              } else if (result.isCancelled) {
                alert('login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then((data) => {
                  // alert(data.accessToken.toString());
                  // 'me?fields=name,id,groups'
                  // me?fields=name,id,groups{id,name,feed{message,link,full_picture}}
                  const processRequest = new GraphRequest(
                    `334488667640512/feed?fields=id,name,message,link,full_picture&since=${this.getDateForLastOccurence(
                      new Date(),
                      'Thurs',
                    )}`,
                    null,
                    this.get_Response_Info,
                  );
                  // Start the graph request.
                  new GraphRequestManager().addRequest(processRequest).start();
                });
              }
            }}
            onLogoutFinished={this.onLogout}
          />
          {this.state.isLoggedIn === true ? (
            <View style={{alignItems: 'center', padding: 10}}>
              <Text style={styles.topHeading}>Your Songs</Text>
              {this.state.isEmpFeed === true ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.noSongsText}>
                    No songs to play this week!
                  </Text>
                </View>
              ) : (
                <View style={styles.container}>
                  <ScrollView>
                    {this.state.feed.map((item, index) => (
                      <ExpandableItemComponent
                        key={item.id}
                        onClickFunction={this.updateLayout.bind(this, index)}
                        item={item}
                        index={index}
                      />
                    ))}
                  </ScrollView>
                  <View style={styles.saveLoadView}>
                    <SaveButton />
                    <LoadButton />
                  </View>
                </View>
              )}
            </View>
          ) : (
            <Text />
          )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // marginBottom: 10,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: 'gray',
    fontWeight: 'bold',
  },
  userText: {
    color: '#fff',
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  topHeading: {
    color: '#fff',
    paddingBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40%',
    marginBottom: '10%',
  },
  welcomeText: {
    fontSize: 20,
    color: '#fff',
  },
  noSongsText: {
    fontSize: 30,
    color: '#fff',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingBottom: 10,
  },
  saveLoadView: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'stretch',
    paddingBottom: 20,
  },
});
