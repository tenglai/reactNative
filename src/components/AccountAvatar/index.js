/**
 * 账户头像 组件
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  Modal,
  Image,
  ImageBackground,
  Text,
  View,
  Dimensions,
} from 'react-native';
// 图标
import Icon from 'react-native-vector-icons/Ionicons';
// 选择手机相册
import ImagePicker from 'react-native-image-picker';
// 请求配置文件
import config from '../../common/config';
import request from '../../common/request';
// 用于加密签名
import sha1 from 'sha1';
// 进度 组件
import * as Progress from 'react-native-progress';

// 获取屏幕宽度
const {width} = Dimensions.get('window');

// 上传头像的基础配置
let pickPhotoOptions = {
  title: '选择头像',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '选择相册',
  customButtons: [ // 自定义按钮
    {
      name: '自定义name',
      title: '自定义title'
    }
  ],
  quality: 0.8, // 图片质量
  allowsEditing: true, // 是否允许内置功能对照片进行拉伸、剪裁操作
  noData: false, // 图片转成base64
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

// Cloudinary图床配置信息
const CLOUDINARY = {
  cloud_name: 'dlwilyjng',
  api_key: '499135353216869',
  api_secret: 'KK0FxUTpBmXtom8BArBo6M0Oarc',
  base: 'https://res.cloudinary.com/dlwilyjng',
  // 上传地址
  image: 'https://api.cloudinary.com/v1_1/dlwilyjng/image/upload',
  video: 'https://api.cloudinary.com/v1_1/dlwilyjng/video/upload',
  audio: 'https://api.cloudinary.com/v1_1/dlwilyjng/raw/upload',
};

function avatar(id, type) {
  if(id.indexOf('http') > -1) {
    return id;
  }

  if(id.indexOf('data:image') > -1) {
    return id;
  }

  return CLOUDINARY.base + '/' + type + '/upload/' + id
}

export default class AccountAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logined: false,
      user: null,
      avatarProgress: 0,
      avatarUploading: false,
    };

    this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
    this._pickPhoto = this._pickPhoto.bind(this);
    this._uploadToCloud = this._uploadToCloud.bind(this);
  }

  render() {
    let user = this.state.user;
    if (!user) {
      return <View/>
    }

    return (
      <View style={styles.container}>
        <View style={styles.toolBar}>
          <Text style={styles.toolBarText}>我的账户</Text>
          <Text onPress={this._editAccount} style={styles.toolBarEdit}>Edit</Text>
        </View>

        {/* 如果用户头像存在则显示，否则添加头像Icon */}
        {
          user.avatar ?
          <TouchableOpacity
            onPress={this._pickPhoto}
            style={styles.avatarContainer}
          >
            <ImageBackground
              source={{uri: user.avatar}}
              style={styles.avatarContainer}
            >
              <View style={styles.avatarBox}>
                {/* If it is being uploaded, show the pie-like progress bar, on the contrary, display image */}
                {
                  this.state.avatarUploading
                  ?
                  <Progress.Circle
                    // 尺寸
                    size={75}
                    // 是否显示文本
                    showsText={true}
                    color={'#ee735d'}
                    // 进度值
                    progress={this.state.avatarProgress}
                  />
                  :
                  <Image
                    source={{uri: user.avatar}}
                    style={styles.avatar}
                  >
                  </Image>
                }
              </View>
              <Text style={styles.avatarText}>戳这里换头像</Text>
            </ImageBackground>
          </TouchableOpacity>
          :
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>添加狗狗头像</Text>
            <TouchableOpacity
              onPress={this._pickPhoto}
              style={styles.avatarBox}
            >
              {/* If you are uploading, show the cake-like progress bar, on the contrary, show icon */}
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
                <Icon
                  name='md-add'
                  size={45}
                  style={styles.plusIcon}
                />
              }
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  }

  // 上传头像
  _pickPhoto() {
    // 选择图片
    ImagePicker.showImagePicker(pickPhotoOptions, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('用户点击自定义按钮: ', response.customButton);
      } else {
        // 可以使用任何数据显示图像
        // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        // 第一种方案
        // 当我们需要上传图片 使用 Base64
        let avatarUri = 'data:image/jpeg;base64,' + response.data;
        // 开始上传图像服务器
        // 在自己的服务器上生成签名
        let timestamp = Date.now(); // 时间戳
        let tags = 'app,avatar'; // 标签
        let folder = 'avatar'; // 对应图床下的文件夹
        let accessToken = this.state.user.accessToken; // 用户标识
        let signatureUrl = config.api.base + config.api.signature; // 获取签名的地址

        request
          .post(signatureUrl, {
            accessToken: accessToken,
            tags: tags,
            folder: folder,
            timestamp: timestamp,
          })
          .then((data) => {
            if (data && data.success) {
              // data.data 是服务器为我们生成的签名
              console.log('服务器生成的签名:' + data.data);
              // 在本地生成签名
              let signature = 'folder=' + folder
                  + '&tags=' + tags
                  + '&timestamp=' + timestamp + CLOUDINARY.api_secret;
              // sha1 加密
              signature = sha1(signature);
              // console.log('服务器生成签名:' + signature);

              // 通过 formData 形式发送请求
              let body = new FormData();
              body.append('folder', folder);
              body.append('tags', tags);
              body.append('api_key', CLOUDINARY.api_key);
              body.append('signature', signature);
              body.append('resource_type', 'image'); // 媒体类型
              body.append('file', avatarUri); // 图片数据
              body.append('timestamp', timestamp); // 时间戳
              // 上传 Cloudinary图床
              this._uploadToCloud(body);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  // 上传 Cloudinary图床
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
        return alert('Request failed：' + uploadRequest.responseText);
      }
      if (!uploadRequest.responseText) {
        return alert('Returned an empty message body');
      }

      let response;
      let responseText;
      // 捕获异常
      try {
        responseText = uploadRequest.responseText;
        console.log('The graph bed server returns the:' + responseText);
        response = JSON.parse(responseText)
      } catch (e) {
        console.log(e);
      }

      if (response && response.public_id) {
        // 更新视图
        let user = this.state.user;
        // https://res.cloudinary.com/mybaby
        // /image/upload/v1477463217/avatar/e7g5cpfbxtjjrxsbirbp.jpg
        let cloudUrl = CLOUDINARY.base + '/image/upload/v'
            + response.version + '/'
            + response.public_id + '.'
            + response.format;
        console.log('Post the address of the graph bed:' + cloudUrl);
        user.avatar = cloudUrl;

        // 更改状态
        this.setState({
          user: user,
          avatarUploading: false,
          avatarProgress: 0,
        });

        this._asyncUpdateUser();
      }
    };

    // 获取上传图片进度
    if (uploadRequest.upload) {
      uploadRequest.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          // 进度(0-1)
          let percent = Number((event.loaded / event.total).toFixed(2));
          this.setState({
            avatarProgress: percent
          });
        }
      }
    }
  }

  // 更新本地缓存用户信息
  _asyncUpdateUser() {
    let that = this;
    // 将用户信息更新到：自己的服务器本地
    let user = this.state.user;
    console.log('开始同步用户信息:' + JSON.stringify(user));

    AsyncStorage
      .setItem('user', JSON.stringify(user))
      .then(() => {
        console.log('更新本地成功');
      })
      .catch((err) => {
        console.log(err);
      });

    // 更新自己的服务器
    let url = config.api.base + config.api.update;
    request
      .post(url, user)
      .then((data) => {
        if (data && data.success) {
          // alert('将用户信息更新到服务器成功');
          // 从服务器返回的数据更新用户状态
          // this._closeModal();
          that.setState({
            user: ''
          })
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this._asyncGetAppStatus();
  }

  // 获取应用状态
  _asyncGetAppStatus() {
    // 从本地缓存中获取用户信息
    AsyncStorage
      .getItem('user')
      .then((data) => {
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
      })
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
  // 顶部的条
  toolBar: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735d',
  },
  // 文案样式
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
  // 头像视窗
  avatarContainer: {
    width: width,
    height: 140,
    justifyContent: 'center', // 上下居中
    alignItems: 'center', // 作用居中
    backgroundColor: '#666',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  // 头像
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
  // 上传按钮
  plusIcon: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color: '#666',
    backgroundColor: '#fff',
    borderRadius: 10,
  }
});