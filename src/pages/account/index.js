// /**
//  * 账号页面
//  */
// import React, {Component} from 'react';
// import {
//   StyleSheet,
//   TouchableOpacity,
//   AsyncStorage,
//   TextInput,
//   Modal,
//   Image,
//   ImageBackground,
//   Text,
//   View,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-image-picker';
// import config from '../../common/config';
// import request from '../../common/request';
// import sha1 from 'sha1';
// import * as Progress from 'react-native-progress';


// const {width} = Dimensions.get('window');
// let pickPhotoOptions = {
//   title: 'Select Avatar',
//   cancelButtonTitle: 'Cancel',
//   takePhotoButtonTitle: 'Photo',
//   chooseFromLibraryButtonTitle: 'From album...',
//   customButtons: [
//     {
//       name: 'vip',
//       title: 'Go RN VIP Forum'
//     }
//   ],
//   quality: 0.8,
//   allowsEditing: true,
//   noData: false,
//   storageOptions: {
//     skipBackup: true,
//     path: 'images'
//   }
// };
// // const CLOUDINARY = {
// //   cloud_name: 'mybaby',
// //   api_key: '658556635518849',
// //   api_secret: 'GxyumaJ1f_qcAhUPTC384yuseSY',
// //   base: 'https://res.cloudinary.com/mybaby',
// //   image: 'https://api.cloudinary.com/v1_1/mybaby/image/upload',
// //   video: 'https://api.cloudinary.com/v1_1/mybaby/video/upload',
// //   audio: 'https://api.cloudinary.com/v1_1/mybaby/raw/upload',
// // };
// const CLOUDINARY = {
//   cloud_name: 'dlwilyjng',
//   api_key: '499135353216869',
//   api_secret: 'KK0FxUTpBmXtom8BArBo6M0Oarc',
//   base: 'https://res.cloudinary.com/dlwilyjng',
//   image: 'https://api.cloudinary.com/v1_1/dlwilyjng/image/upload',
//   video: 'https://api.cloudinary.com/v1_1/dlwilyjng/video/upload',
//   audio: 'https://api.cloudinary.com/v1_1/dlwilyjng/raw/upload',
// };


// export default class Account extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       logined: false,
//       user: null,
//       avatarProgress: 0,
//       avatarUploading: false,
//       // none slide fade
//       animationType: 'fade',
//       // Whether modal scenes are visible
//       modalVisible: false,
//       // Transparent display
//       transparent: false,
//     };

//     this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
//     this._pickPhoto = this._pickPhoto.bind(this);
//     this._uploadToCloud = this._uploadToCloud.bind(this);
//     this._asyncUpdateUser = this._asyncUpdateUser.bind(this);
//     this._editAccount = this._editAccount.bind(this);
//     this._setModalVisible = this._setModalVisible.bind(this);
//     this._startShow = this._startShow.bind(this);
//     this._closeModal = this._closeModal.bind(this);
//     this._changeUserInfo = this._changeUserInfo.bind(this);
//     this._saveUserInfo = this._saveUserInfo.bind(this);
//     this._logout = this._logout.bind(this);
//   }

//   render() {
//     let user = this.state.user;
//     if (!user) {
//       return <View/>
//     }

//     // 图床:   国外 配置简单 国内  7牛
//     // 国外的cloudinary: http://cloudinary.com/
//     // 7牛：https://portal.qiniu.com/signup?code=3lld4je7hakb6

//     return (
//         <View style={styles.container}>
//           <View style={styles.toolBar}>
//             <Text style={styles.toolBarText}>My Account</Text>
//             <Text onPress={this._editAccount} style={styles.toolBarEdit}>Edit</Text>
//           </View>

//           {/* If the user's avatar will display the user's avatar, if not, now add the user avatar icon */}
//           {
//             user.avatar ?
//                 <TouchableOpacity
//                     onPress={this._pickPhoto}
//                     style={styles.avatarContainer}
//                 >
//                   <ImageBackground
//                       source={{uri: user.avatar}}
//                       style={styles.avatarContainer}
//                   >
//                     <View style={styles.avatarBox}>
//                       {/* If it is being uploaded, show the pie-like progress bar, on the contrary, display image */}
//                       {
//                         this.state.avatarUploading
//                           ?
//                           <Progress.Circle
//                             size={75}
//                             showsText={true}
//                             color={'#ee735d'}
//                             progress={this.state.avatarProgress}
//                           />
//                           :
//                           <Image
//                             source={{uri: user.avatar}}
//                             style={styles.avatar}
//                           >
//                           </Image>
//                       }
//                     </View>
//                     <Text style={styles.avatarText}>Click here to change avatar</Text>
//                   </ImageBackground>
//                 </TouchableOpacity>
//                 :
//                 <View style={styles.avatarContainer}>
//                   <Text style={styles.avatarText}>Add User Avatar</Text>
//                   <TouchableOpacity
//                       onPress={this._pickPhoto}
//                       style={styles.avatarBox}
//                   >
//                     {/* If you are uploading, show the cake-like progress bar, on the contrary, show icon */}
//                     {
//                       this.state.avatarUploading ?
//                           <Progress.Circle
//                               size={75}
//                               showsText={true}
//                               color={'#ee735d'}
//                               progress={this.state.avatarProgress}
//                           />
//                           :
//                           <Icon
//                               name='md-add'
//                               size={45}
//                               style={styles.plusIcon}
//                           />
//                     }
//                   </TouchableOpacity>
//                 </View>
//           }
//           <Modal
//               animationType={this.state.animationType}
//               transparent={this.state.transparent}
//               visible={this.state.modalVisible}
//               onRequestClose={() => {
//                 this._setModalVisible(false)
//               }}
//               onShow={this._startShow}
//           >
//             <View style={styles.modalContainer}>
//               <Icon
//                   name='ios-close-outline'
//                   size={45}
//                   onPress={this._closeModal}
//                   style={styles.closeIcon}
//               />
//               <View style={styles.fieldItem}>
//                 <Text style={styles.label}>Nickname</Text>
//                 <TextInput
//                     placeholder='Please enter your nickname'
//                     placeholderTextColor='blue'
//                     underlineColorAndroid='transparent'
//                     autoCorrect={false}
//                     autoCapitalize={'none'}
//                     style={styles.inputField}
//                     defaultValue={user.nickname}
//                     onChangeText={(text) => {
//                       this._changeUserInfo('nickname', text);
//                     }}
//                 />
//               </View>
//               <View style={styles.fieldItem}>
//                 <Text style={styles.label}>Age</Text>
//                 <TextInput
//                     placeholder='Please enter your age'
//                     placeholderTextColor='blue'
//                     underlineColorAndroid='transparent'
//                     autoCorrect={false}
//                     autoCapitalize={'none'}
//                     style={styles.inputField}
//                     defaultValue={user.age}
//                     onChangeText={(text) => {
//                       this._changeUserInfo('age', text);
//                     }}
//                 />
//               </View>
//               <View style={styles.fieldItem}>
//                 <Text style={styles.label}>Gender</Text>
//                 <Icon.Button
//                     name="ios-paw"
//                     onPress={() => {
//                       this._changeUserInfo('gender', 'male')
//                     }}
//                     style={[
//                       styles.gender,
//                       user.gender === 'male' && styles.genderChecked
//                     ]}
//                 >
//                   Male
//                 </Icon.Button>
//                 <Icon.Button
//                     name="ios-paw"
//                     onPress={() => {
//                       this._changeUserInfo('gender', 'female')
//                     }}
//                     style={[
//                       styles.gender,
//                       user.gender === 'female' && styles.genderChecked
//                     ]}
//                 >
//                   Female
//                 </Icon.Button>
//               </View>
//               <View style={styles.btn}>
//                 <Text style={styles.btnText} onPress={this._saveUserInfo}>Save</Text>
//               </View>
//             </View>
//           </Modal>
//           <View style={styles.btn}>
//             <Text
//                 style={styles.btnText}
//                 onPress={this._logout.bind(this)}
//             >
//               Log out
//             </Text>
//           </View>
//         </View>
//     );
//   }

//   _logout() {
//     // Empty the local user store to change the entire app's login status
//     // alert('logout');
//     // this.props.logout();
//     const {navigate} = this.props.navigation;
//     navigate('Login');
//     // this.props.logout();
//   }

//   _saveUserInfo() {
//     this._asyncUpdateUser();
//   }

//   _changeUserInfo(key, value) {
//     // console.log('key---'+key+'--value-'+value);
//     let user = this.state.user;
//     user[key] = value;
//     console.log('Change' + JSON.stringify(user));
//     this.setState({
//       user: user
//     });
//   }

//   _setModalVisible(visible) {
//     this.setState({modalVisible: visible});
//   }

//   _startShow() {
//     console.log('Start showing modal');
//   }

//   _closeModal() {
//     this._setModalVisible(false);
//   }

//   _editAccount() {
//     // alert('弹出modal');
//     this._setModalVisible(true);
//   }

//   _pickPhoto() {
//     // react-native-image-picker copy!
//     ImagePicker.showImagePicker(pickPhotoOptions, (response) => {
//       console.log('Response = ', response);
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else if (response.customButton) {
//         console.log('User tapped custom button: ', response.customButton);
//       } else {
//         // You can display the image using either data...
//         // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
//         // First Scenario
//         // Base64 when we need to upload pictures
//         let avatarUri = 'data:image/jpeg;base64,' + response.data;
//         // Start uploading image servers
//         // Generate signatures on your own server
//         let timestamp = Date.now();
//         let tags = 'app,avatar';
//         let folder = 'avatar';
//         let accessToken = this.state.user.accessToken;
//         let signatureUrl = config.api.base + config.api.signature;

//         request
//           .post(signatureUrl, {
//             accessToken: accessToken,
//             tags: tags,
//             folder: folder,
//             timestamp: timestamp,
//           })
//           .then((data) => {
//             if (data && data.success) {
//               // data.data : Is the signature that the server generated for us.
//               console.log('The signature generated by the server-' + data.data);
//               // Generate signatures locally
//               let signature = 'folder=' + folder
//                   + '&tags=' + tags
//                   + '&timestamp=' + timestamp
//                   + CLOUDINARY.api_secret;
//               // sha1 encryption
//               signature = sha1(signature);
//               console.log('Server-generated signatures：' + signature);

//               // Start post to graph bed
//               let body = new FormData();
//               body.append('folder', folder);
//               body.append('tags', tags);
//               body.append('api_key', CLOUDINARY.api_key);
//               body.append('signature', signature);
//               body.append('resource_type', 'image');
//               body.append('file', avatarUri);
//               body.append('timestamp', timestamp);

//               this._uploadToCloud(body);
//             }
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       }
//     });
//   }

//   _uploadToCloud(body) {
//     let uploadRequest = new XMLHttpRequest();
//     let url = CLOUDINARY.image;
//     uploadRequest.open('POST', url);
//     uploadRequest.send(body);

//     this.setState({
//       avatarUploading: true,
//       avatarProgress: 0,
//     });

//     uploadRequest.onload = () => {
//       if (uploadRequest.status !== 200) {
//         return alert('Request failed：' + uploadRequest.responseText);
//       }
//       if (!uploadRequest.responseText) {
//         return alert('Returned an empty message body');
//       }

//       let response;
//       let responseText;
//       try {
//         responseText = uploadRequest.responseText;
//         console.log('The graph bed server returns the:' + responseText);
//         response = JSON.parse(responseText)
//       } catch (e) {
//         console.log(e);
//       }

//       if (response && response.public_id) {
//         // Update our view
//         let user = this.state.user;
//         // https://res.cloudinary.com/mybaby
//         // /image/upload/v1477463217/avatar/e7g5cpfbxtjjrxsbirbp.jpg
//         let cloudUrl = CLOUDINARY.base + '/image/upload/v'
//             + response.version + '/'
//             + response.public_id + '.'
//             + response.format;
//         console.log('Post the address of the graph bed:' + cloudUrl);
//         user.avatar = cloudUrl;

//         this.setState({
//           user: user,
//           avatarUploading: false,
//           avatarProgress: 0,
//         });

//         this._asyncUpdateUser();
//       }
//     };

//     // Get the progress data for the uploaded image
//     if (uploadRequest.upload) {
//       uploadRequest.upload.onprogress = (event) => {
//         if (event.lengthComputable) {
//           let percent = Number((event.loaded / event.total).toFixed(2));
//           this.setState({
//             avatarProgress: percent
//           });
//         }
//       }
//     }
//   }

//   _asyncUpdateUser() {
//     // Update user information to: own server local
//     let user = this.state.user;
//     console.log('Start synchronizing user information:' + JSON.stringify(user));

//     AsyncStorage
//       .setItem('user', JSON.stringify(user))
//       .then(() => {
//         console.log('Update Local success');
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     // Update your own server
//     let url = config.api.base + config.api.update;
//     request
//       .post(url, user)
//       .then((data) => {
//         if (data && data.success) {
//           alert('Update user information to server success');
//           // Do it yourself, update the user state from the data returned by the server
//           this._closeModal();
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   componentDidMount() {
//     this._asyncGetAppStatus();
//   }

//   _asyncGetAppStatus() {
//     AsyncStorage
//         .getItem('user')
//         .then((data) => {
//           let user;
//           let newState = {};
//           if (data) {
//             user = JSON.parse(data);
//           }
//           if (user && user.accessToken) {
//             newState.logined = true;
//             newState.user = user;
//             // newState.user.avatar = '';
//           } else {
//             newState.logined = false;
//           }
//           this.setState(newState);
//         })
//         .catch((err) => {
//           alert(err);
//         });
//   }
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5FCFF',
//   },
//   toolBar: {
//     flexDirection: 'row',
//     paddingTop: 25,
//     paddingBottom: 12,
//     backgroundColor: '#ee735d',
//   },
//   toolBarText: {
//     fontSize: 16,
//     flex: 1,
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   toolBarEdit: {
//     position: 'absolute',
//     right: 10,
//     top: 25,
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 15,
//     fontWeight: '600'
//   },
//   avatarContainer: {
//     width: width,
//     height: 140,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#666',
//   },
//   avatarText: {
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//     color: '#fff',
//     backgroundColor: 'transparent'
//   },
//   avatar: {
//     marginBottom: 10,
//     width: width * 0.2,
//     height: width * 0.2,
//     borderRadius: width * 0.1,
//     borderWidth: 1,
//     borderColor: 'red',
//     resizeMode: 'cover',
//   },
//   avatarBox: {
//     marginTop: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   plusIcon: {
//     padding: 20,
//     paddingLeft: 25,
//     paddingRight: 25,
//     color: '#666',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingTop: 50,
//   },
//   closeIcon: {
//     alignSelf: 'center',
//     fontSize: 30,
//     color: 'red'
//   },
//   fieldItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 50,
//     paddingLeft: 15,
//     paddingRight: 15,
//     borderColor: '#ee735d',
//     borderBottomWidth: 1,
//   },
//   label: {
//     color: '#ccc',
//     marginRight: 10,
//     textAlign: 'center',
//   },
//   inputField: {
//     flex: 1,
//     height: 50,
//     fontSize: 14,
//     color: '#666'
//   },
//   gender: {
//     backgroundColor: '#ccc'
//   },
//   genderChecked: {
//     backgroundColor: '#ee735d'
//   },
//   btn: {
//     height: 50,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#ee735d',
//     marginTop: 25,
//     marginRight: 10,
//     marginLeft: 10,
//   },
//   btnText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#ee735d'
//   },
// });

/**
 * 账号页面
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class Account extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Account page</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center'
  }
});