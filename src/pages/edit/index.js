/**
 * 录制视频页
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class Edit extends Component {
  constructor(props) {
    super(props);
  
    this.state = {};
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text>Edit page</Text>
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


/********************************* 20180730 ************************************/
// import React, { Component } from 'react';
// import { CountDownText } from '../../components/CountDown';
// import Video from 'react-native-video';
// import {AudioRecorder, AudioUtils} from 'react-native-audio';
// import ImagePicker from 'react-native-image-picker';
// import _ from 'lodash';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   Dimensions,
//   TouchableOpacity,
//   AsyncStorage,
//   Alert,
//   ProgressBarAndroid,
//   Modal,
//   TextInput,
//   Platform,  // 判断平台
//   PermissionsAndroid  //权限(android)
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { get,post } from '../../common/request'
// import config from '../../common/config'
// import Button from 'react-native-button';

// const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

// // 选择视频配置
// const videoOptions = {
//   title: '选择视频',
//   cancelButtonTitle: '取消',
//   takePhotoButtonTitle: '录制 10 秒视频',
//   chooseFromLibraryButtonTitle: '选择已有视频',
//   videoQuality: 'medium',
//   mediaType: 'video',
//   durationLimit: 10,
//   noData: false,
//   storageOptions: {
//     skipBackup: true,
//     path: 'Download'
//   }
// }

// var defaultState = {
//   previewVideo : null,
//   videoId: null,
//   audioId: null,
//   title: '',
//   modalVisible: false,
//   publishProgress: 0.2,
//   publishing: false,
//   willPublish: false,
//   // video player
//   rate : 1.0,
//   muted : true,
//   resizeMode : 'contain',
//   repeat : false,
//   // video loads
//   videoProgress : 0.01,
//   videoTotal : 0,
//   currentTime : 0,
//   playing : false,
//   paused : true,
//   // video upload
//   video: null,
//   videoUploading: false,
//   videoUploaded: false,
//   videoUploadedProgress: 0.01,
//   // count down
//   counting: false,
//   recording: false,
//   // audio
//   audioCurrentTime: 0.0,
//   audioRecording: false,
//   stoppedRecording: false,
//   audioFinished: false,
//   audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
//   hasPermission: undefined,
//   audioPlaying: false,
//   recordDone: false,
//   // audio upload
//   audio: null,
//   audioUploading: false,
//   audioUploaded: false,
//   audioUploadedProgress: 0.01,
// };

// export default class Edit extends Component {
//   constructor(props){
//     super(props)
//     var state = _.clone(defaultState);
//     this.state = state;
//   }
//   // android授权(麦克风)
//   _checkPermission () {
//     // 苹果平台跳过
//     if (Platform.OS !== 'android') {
//       return Promise.resolve(true);
//     }
//     // 提示语
//     const rationale = {
//       'title': 'Microphone Permission',
//       'message': 'AudioExample needs access to your microphone so you can record audio.'
//     };
//     return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
//       .then((result) => {
//         console.log('Permission result:', result);
//         return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
//       });
//   }
//   prepareRecordingPath(audioPath){
//     AudioRecorder.prepareRecordingAtPath(audioPath, {
//       SampleRate: 22050,
//       Channels: 1,
//       AudioQuality: "Low",
//       AudioEncoding: "aac",
//       AudioEncodingBitRate: 32000
//     });
//   }
//   _initAudio () {
//     var that = this
//     this._checkPermission().then((hasPermission) => {
//       that.setState({ hasPermission });

//       if (!hasPermission) return;

//       that.prepareRecordingPath(that.state.audioPath);
//       AudioRecorder.onProgress = (data) => {
//         that.setState({audioCurrentTime: Math.floor(data.currentTime)});
//       };

//       console.log(that.state.audioPath);
//       AudioRecorder.onFinished = (data) => {
//         // Android callback comes in the form of a promise instead.
//         if (Platform.OS === 'ios') {
//           that._finishRecording(data.status === "OK", data.audioFileURL);
//         }
//       };
//     });
//   }
//   _finishRecording(didSucceed, filePath) {
//     this.setState({audioFinished: didSucceed });
//     console.log(`Finished recording of duration ${this.state.audioCurrentTime} seconds at path: ${filePath}`);
//   }
//   _preview () {
//     if(this.state.audioPlaying){
//       AudioRecorder.stopPlaying();
//     }

//     this.setState({
//       videoProgress: 0,
//       audioPlaying: true
//     })

//     AudioRecorder.playRecording()
//     this.refs.videoPlayer.seek(0)
//   }
//   componentDidMount () {
//     var that = this
//     AsyncStorage.getItem('userInfo').then((data)=>{
//       var data = JSON.parse(data)
//       if(data && data.accessToken){
//         that.setState({
//           userInfo : data
//         })
//       }
//     }).catch((e)=>{
//       console.log(e)
//     })
//     // 初始化音频
//     this._initAudio()
//   }
//   _onLoad () {
//     console.log('onLoad')
//   }
//   _onLoadStart () {
//     console.log('_onLoadStart')
//   }
//   _onProgress (data) {
//     // console.log(data);
//     var duration = data.seekableDuration
//     var currentTime = data.currentTime
//     var percent = Number((currentTime / duration).toFixed(2))
//     this.setState({
//       videoTotal : duration,
//       currentTime : Number(data.currentTime.toFixed(2)),
//       videoProgress : Number(percent.toFixed(2)) //强制转换，不然会报错
//     })
//   }
//   _onEnd () {
//     if(this.state.recording){
//       AudioRecorder.stopRecording()
//       this.setState({
//         videoProgress : 1,
//         recordDone: true,
//         recording : false
//       })
//     }
//   }
//   _onError () {
//     console.log('_onError')
//   }
//   _upload (body,type) {
//     var xhr = new XMLHttpRequest()
//     // xhr.responseType = "json";
//     var url = config.qiniu.upload
//     var that = this

//     if(type == 'audio'){
//       url = config.cloudinary.video
//     }
//     var state = {}
//     state[type + 'UploadedProgress'] = 0
//     state[type + 'Uploading'] = true
//     state[type + 'Uploaded'] = false

//     this.setState(state)
//     console.log(url+'type:'+type);
//     xhr.open('POST',url)
//     xhr.send(body)
//     xhr.onload = () => {
//       console.log('_upload');
//       console.log(body);
//       if(xhr.status !== 200){
//         Alert.alert('请求失败200')
//         console.log(xhr.responseText)
//         return 
//       }

//       if(!xhr.responseText){
//         Alert.alert('请求失败')
//         console.log(xhr.responseText)
//         return
//       }
      
//       var response

//       try{
//         response = JSON.parse(xhr.response)
//         console.log(response)
//       }catch(e){
//         console.log(e)
//         console.log('parse fails')
//       }
//       if(response){
//         var newState = {}

//         newState[type] = response
//         newState[type+'Uploading'] = false
//         newState[type+'Uploaded'] = true

//         that.setState(newState)
//       }
//       // {hash: "lhezjcLut9aqQ5_jdEVICM6NJe2u", key: "3e331984-4138-42f8-9c4b-4a5f19f7b75e.mp4", persistentId: "z0.5a20c868b946531900350995"}
//       // z0.5a20c868b946531900350995
//       // http://api.qiniu.com/status/get/prefop?id=z0.5a20cc37b94653190035aa4b
//       // http://p07n183yy.bkt.clouddn.com/tif2A2xwqtgaelwOgLOIfPiOteo=/lhezjcLut9aqQ5_jdEVICM6NJe2u

//       // 同步到Cloudinary
//       var updateURL = config.api.localhost + config.api[type];
//       var accessToken = that.state.userInfo.accessToken;
//       var updateBody = {
//         accessToken: accessToken
//       }
//       updateBody[type] = response
//       if(type === 'audio'){
//         uploadBody.videoId = that.state.videoId
//       }
//       post(updateURL,updateBody).catch((err)=>{
//         console.log(err);
//         if(type === 'audio'){
//           Alert.alert('音频同步出错，请重新上传！');
//         }else{
//           Alert.alert('视频同步出错，请重新上传！');    
//         }
//       }).then((data)=>{
//         if(data && data.success){
//           var mediaState = {};

//           mediaState[type+'Id'] = data.data;
          
//           if(type === 'audio'){
//             that._showModal();
//             mediaState.willPublish = true
//           }

//           that.setState(mediaState);
//         }else{
//           if(type === 'audio'){
//             Alert.alert('音频同步出错，请重新上传！');
//           }else{
//             Alert.alert('视频同步出错，请重新上传！');    
//           }
//         }
//       })
//     }
//     // 错误处理
//     xhr.onerror = function(e) {
//       console.log(e);
//     };
//     // Could not retrieve file for uri /data/data/com.dogapp/files/test.aac
//     // 上传进度
//     if(xhr.upload) {
//       // xhr.upload.onerror
//       xhr.upload.onprogress = (event) => {
//         if(event.lengthComputable) {
//           var percent = Number((event.loaded / event.total).toFixed(2))
//           var uState = {}
//           uState[type+'UploadedProgress'] = percent
//           that.setState(uState)
//         }
//       }
//     }
//   }
//   _getToken(body){
//     var signatureURL = config.api.localhost + config.api.signature
//     body.accessToken = this.state.userInfo.accessToken

//     return post(signatureURL,body)
//   }
//   _uploadAudio(){
//     var that = this,
//       folder = 'audio',
//       tags = 'app,audio',
//       timestamp = Date.now();

//     this._getToken({
//       type: 'audio',
//       timestamp: timestamp,
//       cloud: 'cloudinary'
//     }).catch((e)=>{
//       console.log(e)
//     }).then((data)=>{
//       if(data && data.success) {
//         var signature = data.data.token;
//         var key = data.data.key;

//         var body = new FormData()
//         body.append('folder',folder)
//         body.append('signature',signature)
//         body.append('tags',tags)
//         body.append('timestamp',timestamp)
//         body.append('api_key',config.cloudinary.api_key)
//         body.append('cloud_name',config.cloudinary.cloud_name)
//         body.append('resource_type','video')
//         body.append('file',{
//           type: 'video/mp4',
//           uri: that.state.audioPath,
//           name: key
//         })
//         that._upload(body,'audio')
//       }
//     })
//   }
//   _pickVideo(){
//     var that = this
//     ImagePicker.showImagePicker(videoOptions, (response) => {
//       if (response.didCancel) {
//         return
//       }
                  
//       // var timestamp = Date.now()
//       // var tags = 'app,avatar'
//       // var folder = 'avatar'
//       // var signatureURL = config.api.localhost + config.api.signature
//       var state = _.clone(defaultState);
//       var uri = response.uri;
//       state.previewVideo = response.uri;
//       state.userInfo = this.state.userInfo
      
//       that.setState(state)

//       that._getToken({
//         type: 'video',
//         cloud: 'qiniu'
//       }).catch((e)=>{
//         Alert.alert('上传出错')
//         console.log(e)
//       }).then((data)=>{
//         if(data && data.success) {
//           // var signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLUNDINARY.api_secret
//           // signature = sha1(signature)
//           var token = data.data.token;
//           var key = data.data.key;

//           console.log(data.data);
          
//           var body = new FormData()
//           body.append('token',token)
//           body.append('key',key)
//           body.append('file',{
//             type: 'video/mp4',
//             uri: uri,
//             name: key
//           })

//           that._upload(body,'video')
//         }
//       })
//     });
//   }
//   _record () {
//     this.setState({
//       videoProgress: 0.01,
//       counting: false,
//       recordDone: false,
//       recording: true,
//       paused: false
//     })
//     // 开始录音
//     AudioRecorder.startRecording()
//     this.refs.videoPlayer.seek(0.01)
//   }
//   _counting () {
//     if(!this.state.counting && !this.state.recording && !this.state.audioPlaying){
//       this.setState({
//         counting: true
//       })
//       this.refs.videoPlayer.seek(this.state.videoTotal - 0.01)
//     }
//     var timer = null;
//     this.refs.videoPlayer
//   }
//   _showModal() {
//     this.setState({
//       modalVisible: true
//     })
//   }
//   _closeModal () {
//     this.setState({
//       modalVisible: false
//     })
//   }
//   // 发布视频
//   _submit () {
//     var that = this
//     var body = {
//       title: this.state.title,
//       videoId: this.state.videoId,
//       audioId: this.state.audioId
//     };

//     var creationURL = config.api.localhost + config.api.creations;
//     var user = that.state.userInfo

//     if(user && user.accessToken){
//       body.accessToken = user.accessToken
//       this.setState({
//         publishing: true
//       })
//       post(creationURL,body).catch((e)=>{
//         console.log(e);
//         Alert.alert('视频发布失败');
//       }).then((body)=>{
//         if(data && data.success){
//           that._closeModal();
//           Alert.alert('视频发布成功');
//           var state = _.clone(defaultState);
//           state.userInfo = this.state.userInfo;
//           that.setState(state);
//         }else{
//           this.setState({
//             publishing: false
//           })
//           Alert.alert('视频发布失败');
//         }
//       })
//     }
//   }
//   render () {
//     return (
//       <View style={styles.container}>
//         <View style={styles.toolbar}>
//           <Text style={styles.toolbarTitle}>
//             {
//               this.state.previewVideo ? '点击按钮配音' : '理解狗狗，从配音开始'
//             }
//           </Text>
//           {
//             this.state.previewVideo && this.state.videoUploaded
//             ? <Text style={styles.toolbarExtra} onPress={this._pickVideo.bind(this)}>更换视频</Text>
//             : null
//           }
//         </View>

//         <View style={styles.page}>
//           {
//             this.state.previewVideo
//             ? <View style={styles.videoContainer}>
//                 <View style={styles.videoBox}>
//                   <Video 
//                     ref="videoPlayer"
//                     source={{uri:this.state.previewVideo}}
//                     // source={require('./demo.mp4')}
//                     style={styles.video}
//                     paused={this.state.paused}
//                     rate={this.state.rate}     // 控制暂停/播放，0 代表暂停paused, 1代表播放normal. 
//                     volume={1.0}                 // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数 
//                     muted={this.state.muted}   // true代表静音，默认为false. 
//                     resizeMode={this.state.resizeMode}           // 视频的自适应伸缩铺放行为，
//                     repeat = {this.state.repeat}
//                     playInBackground={false}     // 当app转到后台运行的时候，播放是否暂停
//                     onLoadStart={this._onLoadStart} // 当视频开始加载时的回调函数
//                     onLoad={this._onLoad}           // 当视频加载完毕时的回调函数
//                     onProgress={this._onProgress.bind(this)}   // 进度控制，每250ms调用一次，以获取视频播放的进度
//                     onEnd={this._onEnd.bind(this)}             // 当视频播放完毕后的回调函数
//                     onError={this._onError.bind(this)}         // 当视频不能加载，或出错后的回调函数
//                   />
//                 </View>
//                 {
//                   this.state.recording || this.state.audioPlaying
//                   ? <View style={styles.progressTipBox}>
//                     <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} style={styles.progressBar} color='#ee735c' progress={this.state.videoProgress}/>
//                     {
//                       this.state.recording
//                       ? <Text style={styles.progressTip}>录制声音中</Text>
//                       : null
//                     }
//                   </View>
//                   : null
//                 }
//                 {
//                   this.state.recordDone
//                   ? <View style={styles.previewBox}>
//                     <Icon name="ios-play" style={styles.previewIcon}/>
//                     <Text style={styles.previewText} onPress={this._preview.bind(this)}>预览</Text>
//                   </View>
//                   : null
//                 }
//                 {
//                   !this.state.videoUploaded && this.state.videoUploading
//                   ? <View style={styles.progressTipBox}>
//                       <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} style={styles.progressBar} color='#ee735c' progress={this.state.videoUploadedProgress}/>
//                       <Text style={styles.progressTip}>正在生成静音视频，已完成{(this.state.videoUploadedProgress * 100).toFixed(2)}%</Text>
//                     </View>
//                   : null
//                 }
//               </View>
//             : <TouchableOpacity style={styles.uploadContainer} onPress={this._pickVideo.bind(this)}>
//                 <View style={styles.uploadBox}>
//                   <Image style={styles.uploadIcon} source={require('../assets/images/dog.png')} />
//                   <Text style={styles.uploadTitle}>点我上传视频</Text>
//                   <Text style={styles.uploadDesc}>建议时长不超过20秒</Text>
//                 </View>
//               </TouchableOpacity>
//           }
//           {
//             this.state.videoUploaded
//             ? <View style={styles.recordBox}>
//                 <View style={[styles.recordIconBox,(this.state.recording || this.state.audioPlaying) && styles.recordOn]}>
//                   {
//                     this.state.counting && !this.state.recording
//                     ? <CountDownText
//                       ref="countDownText"
//                       style={styles.countBtn}
//                       countType='seconds' // 计时类型：seconds / date
//                       auto={true} // 自动开始
//                       afterEnd={this._record.bind(this)} // 结束回调
//                       timeLeft={3} // 正向计时 时间起点为0秒
//                       step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
//                       startText='准备录制' // 开始的文本
//                       endText='Go' // 结束的文本
//                       intervalText={(sec) => {
//                         return sec === 0 ? 'Go' : sec
//                       }} // 定时的文本回调
//                       />
//                     : <TouchableOpacity onPress={this._counting.bind(this)}>
//                         <Icon name='md-microphone' style={styles.recordIcon}/>
//                       </TouchableOpacity>
//                   }
//                 </View>
//               </View>
//             : null
//           }
//           {
//             this.state.videoUploaded && this.state.recordDone
//             ? <View style={styles.uploadAudioBox}>
//               {
//                 !this.state.audioUploaded && !this.state.audioUploading
//                 ? <Text style={styles.uploadAudioText} onPress={this._uploadAudio.bind(this)}>下一步</Text>
//                 : null
//               }
//               {
//                 this.state.audioUploading
//                 ? <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} style={styles.progressBar} color='#ee735c' progress={this.state.audioUploadedProgress}/>
//                 : null
//               }
//             </View>
//             : null
//           }    
//         </View>

//         <Modal
//           animationType={'slide'}
//           visible={this.state.modalVisible}
//           onRequestClose={()=>this._closeModal(false)}>
//           <View style={styles.modalContainer}>
//             <Icon name='ios-close-outline' style={styles.closeIcon} onPress={this._closeModal.bind(this)}/>
//               {
//                 this.state.audioUploaded && !this.state.publishing
//                 ? <View style={styles.fieldBox}>
//                     <TextInput
//                       placeholder="配音视频标题"
//                       style={styles.inputField}
//                       autoCapitalize={'none'}
//                       autoCorrect={false}
//                       defaultValue={this.state.title}
//                       onChangeText= {(text)=>{
//                         this.setState({
//                           title: text
//                         })
//                       }}
//                       underlineColorAndroid={'transparent'}
//                     />
//                 </View>
//                 : null
//               }

//               {
//                 this.state.publishing
//                 ? <View style={styles.loadingBox}>
//                     <Text style={styles.loadingText}>耐心等一下，拼命为您生成视频中...</Text>
//                       {
//                         this.state.willPublish
//                         ? <Text style={styles.loadingText}>正在合并视频音频...</Text>
//                         : null
//                       }
//                       {
//                         this.state.publishProgress > 0.3
//                         ? <Text style={styles.loadingText}>开始上传...</Text>
//                         : null
//                       }
//                     <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} style={styles.progressBar} color='#ee735c' progress={this.state.publishProgress}/>
//                   </View>
//                 : null
//               }
            
//             <View style={styles.submitBox}>
//               {
//                 this.state.audioUploaded && !this.state.publishing
//                 ? <Button style={styles.btn} onPress={this._submit.bind(this)}>发布视频</Button>
//                 : null
//               }
//             </View>
//           </View>
//         </Modal>
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5FCFF',
//   },
//   toolbar: {
//     flexDirection: 'row',
//     paddingTop: 25,
//     paddingBottom: 12,
//     backgroundColor: '#ee735c'
//   },
//   toolbarTitle: {
//     flex: 1,
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//     fontWeight: '600',
//     fontSize: 14
//   },
//   toolbarExtra : {
//     position: 'absolute',
//     right: 10,
//     top: 26,
//     color: '#fff',
//     textAlign: 'right',
//     fontWeight: '600'
//   },
//   page: {
//     flex: 1,
//     alignItems: 'center'
//   },
//   uploadContainer: {
//     marginTop: 50,
//     width: width - 40,
//     paddingBottom: 10,
//     borderWidth: 1,
//     borderColor: '#ee735c',
//     height: 240,
//     justifyContent: 'center',
//     borderRadius: 6,
//     backgroundColor: '#fff'
//   },
//   uploadTitle: {
//     color: '#000',
//     textAlign: 'center',
//     fontSize: 16,
//     marginBottom: 10
//   },
//   uploadDesc: {
//     color: '#999',
//     textAlign: 'center',
//     fontSize: 12
//   },
//   uploadIcon: {
//     width: 110,
//     height: 110,
//     resizeMode: 'contain'
//   },
//   uploadBox: {
//     flex:1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   videoContainer: {
//     width: width,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     position: 'relative'
//   },
//   videoBox: {
//     width: width,
//     height: height * 0.4,
//     backgroundColor: '#333',
//     position: 'relative'
//   },
//   video: {
//     width: width,
//     height: height * 0.3
//   },
//   progressTipBox: {
//     position: 'absolute',
//     left: 0,
//     bottom: 0,
//     width: width,
//     height: 50,
//     backgroundColor: 'rgba(244,244,244,0.65)'
//   },
//   progressTip: {
//     color: '#333',
//     width: width - 10,
//     padding: 5
//   },
//   progressBar: {
//     width: width
//   },
//   recordBox: {
//     width: width,
//     height: 60,
//     alignItems: 'center'
//   },
//   recordIconBox: {
//     width: 68,
//     height: 68,
//     marginTop: -30,
//     borderRadius: 34,
//     backgroundColor: '#ee735c',
//     borderWidth: 1,
//     borderColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   recordIcon: {
//     fontSize: 58,
//     backgroundColor: 'transparent',
//     color: '#fff'
//   },
//   countBtn: {
//     fontSize: 32,
//     fontWeight: '600',
//     color: '#fff'
//   },
//   recordOn: {
//     backgroundColor: '#ccc'
//   },
//   previewBox: {
//     width: 80,
//     height: 30,
//     position: 'absolute',
//     right: 10,
//     bottom: 10,
//     borderWidth: 1,
//     borderColor: '#ee735c',
//     borderRadius: 3,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   previewIcon: {
//     marginRight: 5,
//     fontSize: 20,
//     color: '#ee735c',
//     backgroundColor: 'transparent'
//   },
//   previewText: {
//     fontSize: 20,
//     color: '#ee735c',
//     backgroundColor: 'transparent'
//   },
//   uploadAudioBox: {
//     width: width,
//     height: 60,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   uploadAudioText: {
//     width: width - 20,
//     padding: 5,
//     borderWidth: 1,
//     borderColor: '#ee735c',
//     borderRadius: 5,
//     textAlign: 'center',
//     fontSize: 30,
//     color: '#ee735c'
//   },
//   modalContainer : {
//     width: width,
//     height: height,
//     paddingTop : 50,
//     backgroundColor: '#fff'
//   },
//   closeIcon : {
//     position : 'absolute',
//     fontSize : 32,
//     right : 20,
//     top : 30,
//     color : '#ee735c'
//   },
//   loadingBox : {
//     width: width,
//     height: 50,
//     marginTop: 10,
//     padding: 15,
//     alignItems: 'center'
//   },
//   loadingText: {
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#333'
//   },
//   fieldBox: {
//     width: width - 40,
//     height: 36,
//     marginTop: 30,
//     marginLeft: 20,
//     marginRight: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eaeaea'
//   },
//   inputField: {
//     height : 36,
//     textAlign: 'center',
//     color : '#666',
//     fontSize : 14
//   },
//   btn : {
//     padding: 10,
//     marginTop: 25,
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#ee753c',
//     borderRadius: 4,
//     color: '#ee735c',
//     marginLeft: 10,
//     marginRight: 10
//   },
//   submitBox : {
//     marginTop: 50,
//     padding: 15
//   }
// });