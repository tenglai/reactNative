/**
 * 账号页面
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
// 顶部标题栏 组件
import AccountHeader from '../../components/AccountHeader';
// 头像 组件
import AccountAvatar from '../../components/AccountAvatar';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logined: false,
      user: {
        nickname: '狗狗',
        bread: '柯基',
        age: '12',
        gender: 'male'
      }
    };
  }

  render() {
    let user = this.state.user;
    // if (!user) {
    //   return <View/>
    // }

    return (
      <View style={styles.container}>
        {/*顶部标题栏*/}
        <AccountHeader user={this.state.user} />
        {/*头像*/}
        <AccountAvatar />
        {/*退出登录*/}
        <TouchableOpacity
          style={styles.btn}
          onPress={this._logout.bind(this)}
        >
          <Text style={styles.btnText}>退出登录</Text>
        </TouchableOpacity>
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