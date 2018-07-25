/**
 * 用户页面
 */
import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  TextInput,
  Modal,
  Image,
  Text,
  View,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import config from '../common/config';
import request from '../common/request';
import sha1 from 'sha1';
import * as Progress from 'react-native-progress';

const {width, height} = Dimensions.get('window');

let pickPhotoOptions = {
  title: '选择头像',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '从相册...',
  customButtons: [
    {
      name: 'vip', title: 'Go RN VIP论坛'
    }
  ],
  quality: 0.8,
  allowsEditing: true,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

const CLOUDINARY = {
  cloud_name: 'mybaby',
  api_key: '658556635518849',
  api_secret: 'GxyumaJ1f_qcAhUPTC384yuseSY',
  base: 'https://res.cloudinary.com/mybaby',
  image: 'https://api.cloudinary.com/v1_1/mybaby/image/upload',
  video: 'https://api.cloudinary.com/v1_1/mybaby/video/upload',
  audio: 'https://api.cloudinary.com/v1_1/mybaby/raw/upload',
};


export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logined: false,
      user: null,
      avatarProgress: 0,
      avatarUploading: false,
      animationType: 'fade',//none slide fade
      modalVisible: false,//模态场景是否可见
      transparent: false,//是否透明显示
    };

    this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
    this._pickPhoto = this._pickPhoto.bind(this);
    this._uploadToCloud = this._uploadToCloud.bind(this);
    this._asyncUpdateUser = this._asyncUpdateUser.bind(this);
    this._editAccount = this._editAccount.bind(this);
    this._setModalVisible = this._setModalVisible.bind(this);
    this._startShow = this._startShow.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this._changeUserInfo = this._changeUserInfo.bind(this);
    this._saveUserInfo = this._saveUserInfo.bind(this);
    this._logout = this._logout.bind(this);
  }

  render() {
    let user = this.state.user;

    if (!user) {
      return <View/>
    }

    //图床   国外 配置简单 国内  7牛
    //国外的:http://cloudinary.com/
    //7牛：https://portal.qiniu.com/signup?code=3lld4je7hakb6

    return (
        <View style={styles.container}>
          <View style={styles.toolBar}>
            <Text style={styles.toolBarText}>我的账户</Text>
            <Text onPress={this._editAccount} style={styles.toolBarEdit}>编辑</Text>
          </View>
          {/*如果有用户的头像则显示用户的头像，如果没有则现在添加用户头像的图标*/}
          {
            user.avatar ?
                <TouchableOpacity
                    onPress={this._pickPhoto}
                    style={styles.avatarContainer}
                >
                  <Image style={styles.avatarContainer}
                         source={{uri: user.avatar}}
                  >
                    <View style={styles.avatarBox}>
                      {/*如果是正在上传的话就显示饼状的进度条，反之就显示image*/}
                      {
                        this.state.avatarUploading
                            ?
                            <Progress.Circle
                                size={75}
                                showsText={true}
                                color={'#ee735d'}
                                progress={this.state.avatarProgress}
                            />
                            :
                            <Image
                                style={styles.avatar}
                                source={{uri: user.avatar}}
                            >
                            </Image>
                      }
                    </View>
                    <Text style={styles.avatarText}>点击这里更换头像</Text>
                  </Image>
                </TouchableOpacity>
                :
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>添加用户头像</Text>
                  <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarBox}>
                    {/*如果是正在上传的话就显示饼状的进度条，反之就显示icon*/}
                    {
                      this.state.avatarUploading ?
                          <Progress.Circle
                              size={75}
                              showsText={true}
                              color={'#ee735d'}
                              progress={this.state.avatarProgress}
                          />
                          :
                          <Icon
                              name='md-add'
                              size={45}
                              style={styles.plusIcon}
                          />
                    }
                  </TouchableOpacity>
                </View>
          }
          <Modal
              animationType={this.state.animationType}
              transparent={this.state.transparent}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this._setModalVisible(false)
              }}
              onShow={this._startShow}
          >
            <View style={styles.modalContainer}>
              <Icon
                  name='ios-close-outline'
                  size={45}
                  onPress={this._closeModal}
                  style={styles.closeIcon}
              />
              <View style={styles.fieldItem}>
                <Text style={styles.label}>昵称</Text>
                <TextInput
                    placeholder='请输入你的昵称'
                    placeholderTextColor='blue'
                    underlineColorAndroid='transparent'
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    style={styles.inputField}
                    defaultValue={user.nickname}
                    onChangeText={(text) => {
                      this._changeUserInfo('nickname', text);
                    }}
                />
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.label}>年龄</Text>
                <TextInput
                    placeholder='请输入你的年龄'
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
                  男宝宝
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
                  女宝宝
                </Icon.Button>
              </View>
              <View style={styles.btn}>
                <Text style={styles.btnText} onPress={this._saveUserInfo}>保存</Text>
              </View>
            </View>
          </Modal>
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
    //清空本地的用户存储 改变整个app的登录状态
    // alert('logout');
    // this.props.logout();
    const {navigate} = this.props.navigation
    navigate('Login');
    // this.props.logout();
  }

  _saveUserInfo() {
    this._asyncUpdateUser();
  }

  _changeUserInfo(key, value) {
    // console.log('key---'+key+'--value-'+value);
    let user = this.state.user;
    user[key] = value;
    console.log('改变后' + JSON.stringify(user));

    this.setState({
      user: user
    });
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _startShow() {
    console.log('开始显示modal');
  }

  _closeModal() {
    this._setModalVisible(false);
  }

  _editAccount() {
    // alert('弹出modal');
    this._setModalVisible(true);
  }

  _pickPhoto() {

    ImagePicker.showImagePicker(pickPhotoOptions, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        //第一种方案
        //当我们需要上传图片的时候 图片的base64
        let avatarUri = 'data:image/jpeg;base64,' + response.data;

        //开始上传图片服务器   图床
        //在自己的服务器中生成签名
        let timestamp = Date.now();
        let tags = 'app,avatar';
        let folder = 'avatar';
        let accessToken = this.state.user.accessToken;
        let signatureUrl = config.api.base + config.api.signature;
        request
            .post(signatureUrl, {
              accessToken: accessToken,
              tags: tags,
              folder: folder,
              timestamp: timestamp,
            })
            .then(
                (data) => {
                  if (data && data.success) {
                    //data.data 就是服务器给我们生成的签名
                    console.log('服务器给我们生成的签名模拟的-' + data.data);
                    //自己在本地生成签名
                    let signature = 'folder=' + folder + '&tags=' +
                        tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret;
                    //sha1加密
                    signature = sha1(signature);

                    console.log('服务器生成的签名：' + signature);

                    //开始post到图床了
                    let body = new FormData();
                    body.append('folder', folder);
                    body.append('tags', tags);
                    body.append('api_key', CLOUDINARY.api_key);
                    body.append('signature', signature);
                    body.append('resource_type', 'image');
                    body.append('file', avatarUri);
                    body.append('timestamp', timestamp);

                    this._uploadToCloud(body);
                  }
                }
            )
            .catch((err) => {
              console.log(err);
            });
      }
    });
  }

  _uploadToCloud(body) {
    let uploadRequest = new XMLHttpRequest();
    let url = CLOUDINARY.image;
    uploadRequest.open('POST', url);
    uploadRequest.send(body);

    this.setState({
      avatarUploading: true,
      avatarProgress: 0,
    });

    uploadRequest.onload = () => {
      if (uploadRequest.status !== 200) {
        return alert('请求失败：' + uploadRequest.responseText);
      }
      if (!uploadRequest.responseText) {
        return alert('返回了一个空的消息体');
      }

      let response;
      let responseText;
      try {
        responseText = uploadRequest.responseText;
        console.log('图床服务器返回的:' + responseText);
        response = JSON.parse(responseText)
      } catch (e) {
        console.log(e);
      }

      if (response && response.public_id) {
        //更新我们的视图
        let user = this.state.user;
        //https://res.cloudinary.com/mybaby
        // /image/upload/v1477463217/avatar/e7g5cpfbxtjjrxsbirbp.jpg

        let cloudUrl = CLOUDINARY.base + '/image/upload/v'
            + response.version + '/' + response.public_id + '.' + response.format;
        console.log('上传图床后的地址:' + cloudUrl);
        user.avatar = cloudUrl;

        this.setState({
          user: user,
          avatarUploading: false,
          avatarProgress: 0,
        });

        this._asyncUpdateUser();
      }
    }

    //得到上传图片的进度数据
    if (uploadRequest.upload) {
      uploadRequest.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          let percent = Number((event.loaded / event.total).toFixed(2));
          this.setState({
            avatarProgress: percent,
          });
        }
      }
    }
  }

  _asyncUpdateUser() {
    //更新一下用户信息到：自己的服务器  本地
    let user = this.state.user;
    console.log('开始同步用户信息了:' + JSON.stringify(user));

    AsyncStorage
        .setItem('user', JSON.stringify(user))
        .then(
            () => {
              console.log('更新本地成功啦');
            }
        )
        .catch((err) => {
          console.log(err);
        });

    //更新自己的服务器
    let url = config.api.base + config.api.update;
    request
        .post(url, user)
        .then(
            (data) => {
              if (data && data.success) {
                alert('更新用户信息到服务器成功啦');

                //自己去实现 从服务器返回的数据里去更新本地的user state

                this._closeModal();
              }
            }
        )
        .catch((err) => {
          console.log(err);
        });
  }

  componentDidMount() {
    this._asyncGetAppStatus();
  }

  _asyncGetAppStatus() {
    AsyncStorage
        .getItem('user')
        .then(
            (data) => {
              let user;
              let newState = {};
              if (data) {

                user = JSON.parse(data);
              }

              if (user && user.accessToken) {
                newState.logined = true;
                newState.user = user;
                // newState.user.avatar = '';
              } else {
                newState.logined = false;
              }

              this.setState(newState);
            }
        )
        .catch((err) => {
          alert(err);
        });
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
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
  avatarContainer: {
    width: width,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#666',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  avatar: {
    marginBottom: 10,
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    borderWidth: 1,
    borderColor: 'red',
    resizeMode: 'cover',
  },
  avatarBox: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color: '#666',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
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