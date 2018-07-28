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
// 倒计时
import CountDown from 'react-native-sk-countdown';
// 按钮
import Button from 'react-native-button';
import config from '../../common/config';
import request from '../../common/request';

let width = Dimensions.get("window").width - 20;

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      verifyCode: '', // 验证码
      phoneNumber: '', // 手机号
      codeSent: false, // 验证码是否发送
      countingDone: false, // 倒计时是否结束
      logined: false, // 是否登录过
      user: null // 用户信息
    }
  }

  componentDidMount() {
    this._asyncAppStatus();
  }

  // 获取本地存储数据
  _asyncAppStatus() {
    let that = this; // 通过 that 拿到 this 上下文

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

  // 登录以后更新本地存储数据
  _afterLogin(user) {
    let that = this;
    user = JSON.stringify(user);

    AsyncStorage
      .setItem('user', user)
      .then(() => {
        that.setState({
          logined: true,
          user: user
        })
      });

    // 跳转账户页面 
    const {navigate} = this.props.navigation;
    if (this.state.logined) {
      navigate('Account');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/*注册*/}
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            style={styles.inputField}
            placeholder='输入手机号'
            // 不矫正大小写
            autoCapitalize={'none'}
            // 不矫正内容对错
            autoCorrect={false}
            // 数字键盘
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
                  placeholder='输入验证码'
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
                      获取验证码
                    </Button>
                    :
                    <CountDown
                      style={styles.countBtn}
                      countType='seconds' // 计时类型：seconds / date
                      auto={true} // 自动开始
                      afterEnd={this._countingDone} // 结束回调
                      timeLeft={10} // 正向计时 时间起点为0秒
                      step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                      startText='获取验证码' // 开始的文本
                      endText='获取验证码' // 结束的文本
                      intervalText={(sec) => '剩余秒数:' + sec} // 定时的文本回调
                    />
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
                登录
              </Button>
              :
              <Button
                style={styles.btn}
                onPress={this._sendVerifyCode.bind(this)}
              >
                获取验证码
              </Button>
          }
        </View>
      </View>
    )
  }

  // 获取验证码
  _sendVerifyCode() {
    let that = this;
    let phoneNumber = this.state.phoneNumber;
    if (!phoneNumber) {
      return Alert.alert('手机号不能为空!');
    }
    // 表单主体
    let body = {
      phoneNumber: phoneNumber
    };
    // 接口
    let signupURL = config.api.base + config.api.signup;
    // 请求验证码
    request.post(signupURL, body)
      .then((data) => {
        if (data && data.success) {
          // 显示输入验证码的输入框
          that._showVerifyCode();
        } else {
          Alert.alert('获取验证码失败,请检查手机号是否正确');
        }
      })
      .catch(function (err) {
        Alert.alert('获取验证码失败,请检查网络是否良好');
      })
  }

  // 显示输入验证码的输入框
  _showVerifyCode() {
    this.setState({
      codeSent: true
    })
  }

  // 倒计时结束
  _countingDone() {
    this.setState({
      countingDone: true
    })
  }

  // 登录
  _submit() {
    let that = this;
    let phoneNumber = this.state.phoneNumber;
    let verifyCode = this.state.verifyCode;
    if (!phoneNumber || !verifyCode) {
      return Alert.alert('手机号或验证码不能为空!');
    }
    // 参数
    let body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    };
    // 接口
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
  // 注册
  signupBox: {
    marginTop: 30
  },
  // 标题
  title: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
    color: '#333'
  },
  // 输入框的样式
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
  // 验证码
  verifyCodeBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  // 倒计时按钮样式
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
  // 获取验证码 按钮 样式
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