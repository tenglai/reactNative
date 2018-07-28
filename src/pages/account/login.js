/**
 * 登录页
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  AsyncStorage,
  Dimensions,
} from 'react-native';
// import CountDown from 'react-native-countdown';
import config from '../../common/config';
import request from '../../common/request';
import Button from 'react-native-button';

let width = Dimensions.get("window").width - 20;

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      verifyCode: '',
      phoneNumber: '',
      codeSent: false,
      countingDone: false,
      logined: false,
      user: null
    }
  }

  componentDidMount() {
    this._asyncAppStatus();
  }

  _asyncAppStatus() {
    let that = this;
    // AsyncStorage is a simple, unencrypted, asynchronous, persistent,
    // key-value storage system that is global to the app.
    // It should be used instead of LocalStorage.
    // static getItem(key: string, callback?: ?(error: ?Error, result: ?string) => void) #
    // Reads the key field and passes the result to the callback as the second argument
    AsyncStorage
      .getItem('user')
      .then((data) => {
        let user;
        let newState = {};
        if (data) {
          user = JSON.parse(data);
        }
        if (user && user.accessToken) {
          newState.user = user;
          newState.logined = true;
        } else {
          newState.logined = false;
        }
        that.setState(newState);
      });
  }

  // user -> data.data
  _afterLogin(user) {
    let that = this;
    user = JSON.stringify(user);
    // static setItem(key: string, value: string, callback?: ?(error: ?Error) => void)
    // Sets the value of the key field and calls the callback function after completion.
    AsyncStorage
      .setItem('user', user)
      .then(() => {
        that.setState({
          logined: true,
          user: user
        })
      });

    const {navigate} = this.props.navigation;
    if (this.state.logined) {
      navigate('Account');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.inputField}
            placeholder='Input phoneNumber'
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType={'number-pad'}
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text
              })
            }}
          />
          {
            this.state.codeSent
              ?
              <View style={styles.verifyCodeBox}>
                <TextInput
                  placeholder='Input VerifyCode'
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  keyboardType={'number-pad'}
                  style={styles.inputField2}
                  onChangeText={(text) => {
                    this.setState({
                      verifyCode: text
                    })
                  }}
                />
                {
                  this.state.countingDone
                    ?
                    <Button
                        style={styles.recountBtn}
                        onPress={this._sendVerifyCode.bind(this)}
                    >
                      Regain
                    </Button>
                    :
                    /*<CountDown
                      onPress={this._countingDone.bind(this)}
                      text={'seconds:'}
                      time={2}
                      buttonStyle={styles.countBtn}
                      textStyle={{color: '#ccc'}}
                      disabledTextStyle={{color: '#fff'}}
                    />*/
                    null
                }
              </View>
              : null
          }
          {
            this.state.codeSent
              ?
              <Button
                style={styles.btn}
                onPress={this._submit.bind(this)}
              >
                Login
              </Button>
              :
              <Button
                style={styles.btn}
                onPress={this._sendVerifyCode.bind(this)}
              >
                Get VerifyCode
              </Button>
          }
        </View>
      </View>
    )
  }

  _sendVerifyCode() {
    let that = this;
    let phoneNumber = this.state.phoneNumber;
    if (!phoneNumber) {
      return Alert.alert('Cell phone number cannot be empty');
    }
    let body = {
      phoneNumber: phoneNumber
    };
    let signupURL = config.api.base + config.api.signup;

    request.post(signupURL, body)
      .then((data) => {
        if (data && data.success) {
          that._showVerifyCode();
        } else {
          Alert.alert('Authenticode failed 1');
        }
      })
      .catch(function (err) {
        Alert.alert('Authenticode failed 2');
      })
  }

  _showVerifyCode() {
    this.setState({
      codeSent: true
    })
  }

  _countingDone() {
    this.setState({
      countingDone: true
    })
  }

  _submit() {
    let that = this;
    let phoneNumber = this.state.phoneNumber;
    let verifyCode = this.state.verifyCode;
    if (!phoneNumber || !verifyCode) {
      return Alert.alert('Cell phone number and verification code cannot be empty');
    }
    let body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    };
    let verifyURL = config.api.base + config.api.verify;

    request.post(verifyURL, body)
      .then((data) => {
        if (data && data.success) {
          // Pass to father(index.ios.js)
          // that.props.afterLogin(data.data);
          that._afterLogin(data.data);
        } else {
          Alert.alert('Authenticode failed 3');
        }
      })
      .catch((err) => {
        Alert.alert('Authenticode failed 4');
      });
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  signupBox: {
    marginTop: 30
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
    color: '#333'
  },
  inputField: {
    width: width,
    height: 40,
    padding: 5,
    borderRadius: 4,
    fontSize: 16,
    color: '#666',
    backgroundColor: '#fff'
  },
  inputField2: {
    width: width - 110,
    height: 40,
    padding: 5,
    marginRight: 10,
    borderRadius: 4,
    fontSize: 16,
    color: '#666',
    backgroundColor: '#fff'
  },
  verifyCodeBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  countBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderColor: '#ee735c',
    borderRadius: 4,
    backgroundColor: '#ee735c'
  },
  recountBtn: {
    height: 40,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    color: '#fff',
    width: 100,
    borderColor: '#ee735c',
    borderRadius: 4,
    backgroundColor: '#ee735c'
  },
  btn: {
    marginTop: 10,
    padding: 10,
    borderColor: '#ee753c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee753c',
    backgroundColor: 'transparent'
  }
});