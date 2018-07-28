/**
 * 视频播放器 组件
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
// 播放器组件
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

let {width} = Dimensions.get("window");

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 视频播放器
      rate: 1, // 是否暂停 0:暂停, 1:正常
      muted: false, // 是否静音
      resizeMode: 'contain', // 充满整个播放区域 cover 或 自适应 contain
      repeat: false, // 是否重复播放

      // video control
      videoOk: true, // 视频是否出错
      videoLoaded: false, // 视频是否加载
      playing: false, // 视频是否播放中
      paused: false, // 是否暂停
      videoProgress: 0.01, // 进度条

      // all time
      videoTotal: 0, // 视频总时间
      currentTime: 0, // 当前时间
    }
  }

  render() {
    return (
      <View style={styles.videoBox}>
        <Video
          style={styles.video}
          ref="videoPlayer"
          source={{uri: this.props.uri}}
          // 声音放大的倍数: 0 is muted, 1 is double.
          volume={5}
          // 是否暂停 true or false.
          paused={this.state.paused}
          // 0 是 暂停, 1 是 正常.
          rate={this.state.rate}
          // 是否静音 true or false.
          muted={this.state.muted}
          // 充满整个播放区域 或 自适应
          resizeMode={this.state.resizeMode}
          // 是否重复播放 true or false.
          repeat={this.state.repeat}
          // 当视频开始加载时
          onLoadStart={this._onLoadStart.bind(this)}
          // 当视频在不断的加载时
          onLoad={this._onLoad.bind(this)}
          // 当视频播放时，每250ms调用一次，便于知悉当前播放位置(时间)
          onProgress={this._onProgress.bind(this)}
          // 当视频播放结束时调用
          onEnd={this._onEnd.bind(this)}
          // 当视频出错时调用
          onError={this._onError.bind(this)}
        />
        {/* 视频出错 */}
        {
          !this.state.videoOk && <Text style={styles.failText}>视频出错了！很抱歉</Text>
        }

        {/* 没有加载 */}
        {
          !this.state.videoLoaded && <ActivityIndicator style={styles.loading} color="#ee735c"/>
        }

        {/* 播放结束 */}
        {
          this.state.videoLoaded && !this.state.playing
            ?
            <Icon
              style={styles.playIcon}
              onPress={this._rePlay.bind(this)}
              name='ios-play'
              size={48}
            />
            : null
        }

        {/* 视频正在播放，控制是否暂停 */}
        {
          this.state.videoLoaded && this.state.playing
              ?
              <TouchableOpacity
                style={styles.pauseBtn}
                onPress={this._pause.bind(this)}
              >
                {
                  this.state.paused
                    ?
                    <Icon
                      style={styles.resumeIcon}
                      size={48}
                      onPress={this._resume.bind(this)}
                      name="ios-play"
                    />
                    :
                    <Text></Text>
                }
              </TouchableOpacity>
              : null
        }
        {/*进度条*/}
        <View style={styles.progressBox}>
          <View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
        </View>
      </View>
    )
  }

  // 当视频开始加载时
  _onLoadStart() {
    //
  }

  // 当视频在不断的加载时
  _onLoad() {
    //
  }

  // 当视频播放时，每250ms调用一次，便于知悉当前播放位置(时间)
  _onProgress(data) {
    if (!this.state.videoLoaded) {
      this.setState({
        videoLoaded: true
      })
    }

    // 视频中时长
    let duration = data.playableDuration;
    let currentTime = data.currentTime;
    // toFixed(2) get 小数点后两位
    let percent = Number((currentTime / duration).toFixed(2));
    let newState = {
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    };

    if (!this.state.videoLoaded) {
      newState.videoLoaded = true
    }
    // 视频暂停播放或播放结束，显示播放按钮
    if (!this.state.playing) {
      newState.playing = true
    }

    this.setState(newState);
  }

  // 当视频播放结束时调用
  _onEnd() {
    this.setState({
      videoProgress: 1, // 进度为1表示播放结束
      playing: false
    });
  }

  // 当视频出错时调用
  _onError(e) {
    this.setState({
      videoOk: false
    });
  }

  // 重新播放
  _rePlay() {
    this.refs.videoPlayer.seek(0)
  }

  // 暂停播放
  _pause() {
    if (!this.state.paused) {
      this.setState({
        paused: true
      })
    }
  }

  // 继续播放
  _resume() {
    if (this.state.paused) {
      this.setState({
        paused: false
      })
    }
  }
}


const styles = StyleSheet.create({
  // 视频播放器 容器
  videoBox: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  // 视频播放器
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  // 加载动画(菊花图)
  loading: {
    position: 'absolute',
    left: 0,
    top: 80,
    width: width,
    alignSelf: 'center', // 字体居中对齐
    backgroundColor: 'transparent'
  },
  // 视频出错时，文本样式
  failText: {
    position: 'absolute',
    left: 0,
    top: 90,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  // 进度条样式
  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc'
  },

  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#ff6600'
  },
  // 播放按钮样式
  playIcon: {
    position: 'absolute',
    top: 90,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  },
  // 暂停
  pauseBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: width * 0.56
  },
  // 继续
  resumeIcon: {
    position: 'absolute',
    top: 80,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  }
});