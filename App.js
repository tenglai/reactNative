/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import Tts from 'react-native-tts';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';

type Props = {};
export default class App extends Component<Props> {
  onButtonPress(){
    Tts.getInitStatus().then(() => {
      Tts.speak('Hello, world!');
    });
  }

  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Button
          title="测试"
          onPress={() => this.onButtonPress()}
          color="#841584">
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
