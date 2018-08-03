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
  TouchableOpacity,
} from 'react-native';
// 图标
import Icon from 'react-native-vector-icons/Ionicons';
// 按钮
import Button from 'react-native-button';

export default class AccountHeader extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      // 动画类型
      animationType: 'fade',
      // 透明度
      transparent: false,
      // 浮窗显示或隐藏
      modalVisible: false,
      // 用户信息
      user: props.user
    };

    this._setModalVisible = this._setModalVisible.bind(this);
  }

  // 设置浮窗显示或隐藏
  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  // 编辑
  _editAccount() {
    this._setModalVisible(true);
  }

  // 关闭浮窗
  _closeModal() {
    this._setModalVisible(false);
  }

  // 修改账户信息
  _changeUserInfo(key, value) {
    let user = this.state.user;
    user[key] = value;
    console.log('Change' + JSON.stringify(user));
    this.setState({
      user: user
    });
  }

  // 保存资料
  _saveUserInfo() {
    // 获取当前的用户信息
    let user = this.state.user;
    // 验证user的合法性
    if(user && user.accessToken) {
      // 调用父组件方法,将数据保存至后台
      // this.props._asyncUpdateUser();
    }
    // 关闭浮窗
    this._setModalVisible(false);
  }

  render() {
    const { user } = this.state;
    return (
      <View style={styles.container}>
        {/*顶部标题栏*/}
        <View style={styles.toolBar}>
          <Text style={styles.toolBarText}>狗狗的账户</Text>
          <Text onPress={this._editAccount.bind(this)} style={styles.toolBarEdit}>编辑</Text>
        </View>
        {/*浮窗*/}
        <Modal
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          // 在 'Android' 平台，必需使用此函数
          onRequestClose={() => {
            this._setModalVisible(false)
          }}
          onShow={this._startShow}
        >
          <View style={styles.modalContainer}>
            {/*关闭浮窗的按钮*/}
            <Icon
              name='ios-close-outline'
              size={45}
              onPress={this._closeModal.bind(this)}
              style={styles.closeIcon}
            />
            {/*昵称*/}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                  placeholder='输入你的昵称'
                  placeholderTextColor='blue'
                  underlineColorAndroid='transparent'
                  // 是否自动纠正
                  autoCorrect={false}
                  // 是否区分大小写
                  autoCapitalize={'none'}
                  style={styles.inputField}
                  // 默认值
                  defaultValue={user.nickname}
                  // 文本改变事件
                  onChangeText={(text) => {
                    this._changeUserInfo('nickname', text);
                  }}
              />
            </View>
            {/*年龄*/}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>年龄</Text>
              <TextInput
                  placeholder='狗狗的年龄'
                  placeholderTextColor='blue'
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  style={styles.inputField}
                  defaultValue={user.age}
                  onChangeText={(text) => {
                    this._changeUserInfo('age', text);
                  }}
              />
            </View>
            {/*性别*/}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>性别</Text>
              <Icon.Button
                name="ios-paw"
                onPress={() => {
                  this._changeUserInfo('gender', 'male')
                }}
                style={[
                  styles.gender,
                  user.gender === 'male' && styles.genderChecked
                ]}
              >
                男
              </Icon.Button>
              <Icon.Button
                name="ios-paw"
                onPress={() => {
                  this._changeUserInfo('gender', 'female')
                }}
                style={[
                  styles.gender,
                  user.gender === 'female' && styles.genderChecked
                ]}
              >
                女
              </Icon.Button>
            </View>
            <TouchableOpacity
              style={styles.btn}
              onPress={this._saveUserInfo.bind(this)}
            >
              <Text style={styles.btnText}>保存资料</Text>
            </TouchableOpacity>
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
  // },
  toolBar: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735d',
  },
  toolBarText: {
    fontSize: 16,
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  toolBarEdit: {
    position: 'absolute',
    right: 10,
    top: 25,
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600'
  },
  // 浮窗
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
  },
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
  gender: {
    backgroundColor: '#ccc'
  },
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
  },
});