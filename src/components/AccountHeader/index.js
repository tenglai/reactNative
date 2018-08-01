/**
 * 账户头部 组件
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal, // 浮窗
  TextInput,
} from 'react-native';
// 按钮
import Button from 'react-native-button';

export default class AccountHeader extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      modalVisible: false
    };
  }

  // 编辑
  _edit() {
    this.setState({
      modalVisible: true
    });
  }

  // 关闭浮窗
  _closeModal() {
    this.setState({
      modalVisible: false
    });
  }

  // 修改账户信息
  _changeUserState(key, value) {
    let user = this.state.user;

    user[key] = value;
    this.setState({
      user: user
    });
  }

  // 保存资料
  _submit(){
    // 获取当前的用户信息
    let user = this.state.user;
    // 验证user的合法性
    if(user && user.accessToken) {
      // 调用父组件方法,将数据保存至后台
      this.props._asyncUpdateUser();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/*顶部标题栏*/}
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>狗狗的账户</Text>
          <Text style={styles.toolbarExtra} onPress={() => this._edit()}>编辑</Text>
        </View>
        {/*浮窗*/}
        <Modal
          animated={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.modalContainer}>
            {/*关闭浮窗的按钮*/}
            <Icon
              name='ios-close-outline'
              style={styles.closeIcon}
              onPress={() => this._closeModal()}
            />
            {/*编辑区域*/}
            {/*昵称*/}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                // 提示的文案
                placeholder={"输入你的昵称"}
                style={styles.inputField}
                // 是否区分大小写
                autoCapitalize={'none'}
                // 是否自动纠正
                autoCorrect={false}
                // 默认值
                defaultValue={user.nickname}
                // 改变事件
                onChangeText={(text) => {
                  this._changeUserState('nickname',text)
                }}
              />
            </View>
            {/*品种*/}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>品种</Text>
              <TextInput
                // 提示的文案
                placeholder={"狗狗的品种"}
                style={styles.inputField}
                // 是否区分大小写
                autoCapitalize={'none'}
                // 是否自动纠正
                autoCorrect={false}
                // 默认值
                defaultValue={user.bread}
                // 改变事件
                onChangeText={(text) => {
                  this._changeUserState('bread',text)
                }}
              />
            </View>
            {/*年龄*/}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>年龄</Text>
              <TextInput
                // 提示的文案
                placeholder={"狗狗的年龄"}
                style={styles.inputField}
                // 是否区分大小写
                autoCapitalize={'none'}
                // 是否自动纠正
                autoCorrect={false}
                // 默认值
                defaultValue={user.age}
                // 改变事件
                onChangeText={(text) => {
                  this._changeUserState('age',text)
                }}
              />
            </View>
            {/*性别*/}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>性别</Text>
              <Icon.Button
                onPress={() => {
                  this._changeUserState('gender','male')
                }}
                style={[
                  styles.gender,
                  user.gender === 'male' && styles.genderChecked
                ]}
                name='ios-paw'
              >
                男
              </Icon.Button>

              <Icon.Button
                onPress={() => {
                  this._changeUserState('gender','female')
                }}
                style={[
                  styles.gender,
                  user.gender === 'female' && styles.genderChecked
                ]}
                name='ios-paw-outline'
              >
                女
              </Icon.Button>
            </View>
            {/*保存按钮*/}
            <Button
              style={styles.btn}
              onPress={this._submit.bind(this)}
            >
              保存资料
            </Button>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#F5FCFF',
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  // 浮窗
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  // 关闭按钮
  closeIcon: {
    alignSelf: 'center',
    fontSize: 30,
    color: 'red'
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#ee735d',
    borderBottomWidth: 1,
  },
  label: {
    color: '#ccc',
    marginRight: 10,
    textAlign: 'center',
  },
  inputField: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: '#666'
  },
  // 性别未选中
  gender: {
    backgroundColor: '#ccc'
  },
  // 性别选中
  genderChecked: {
    backgroundColor: '#ee735d'
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