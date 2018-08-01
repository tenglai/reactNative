/**
 * 账号页面
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

// 获取屏幕宽度
const {width} = Dimensions.get('window');

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logined: false,
      user: null
    };
  }

  render() {
    let user = this.state.user;
    if (!user) {
      return <View/>
    }

    return (
      <View style={styles.container}>
        <View style={styles.btn}>
          <Text
            style={styles.btnText}
            onPress={this._logout.bind(this)}
          >
            退出登录
          </Text>
        </View>
      </View>
    );
  }

  _logout() {
    // 清空用户信息
    AsyncStorage.removeItem('user');
    // 重置状态
    this.setState({
      logined: false,
      user: null
    });
    // 返回登录页
    const {navigate} = this.props.navigation;
    navigate('Login');

    /**
     * 也可以通过调用父组件的 logout 方法
     * this.props.logout();
     */
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  btn: {
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ee735d',
    marginTop: 25,
    marginRight: 10,
    marginLeft: 10,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ee735d'
  }
});