/**
 * 详情页
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ListView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../../common/config';
import request from '../../common/request';


let {width} = Dimensions.get("window");
let cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
};


export default class Detail extends Component {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    // let data = this.props.data; // _loadPage() data: row
    this.state = {
      data: params.data,
      // 评论数据
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows([]),

      // video player
      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false,

      // video control
      videoOk: true,
      videoLoaded: false,
      playing: false,
      paused: false,
      videoProgress: 0.01,

      // all time
      videoTotal: 0,
      currentTime: 0,

      // modal
      content: '',
      animationType: 'none',
      modalVisible: false,
      isSending: false
    }
  }

  componentDidMount() {
    this._fetchData();
  }

  _hasMore() {
    return cachedResults.items.length !== cachedResults.items.total;
  }

  _fetchMoreData() {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return
    }
    let page = cachedResults.nextPage;
    this._fetchData(page)
  }

  _fetchData(page) {
    let that = this;

    this.setState({
      isLoadingTail: true
    });

    request
      .get(config.api.base + config.api.comment, {
        accessToken: 'abc',
        page: page,
        creation: '123'
      })
      .then((data) => {
        if (data.success) {
          let items = cachedResults.items.slice();
          items = items.concat(data.data);

          cachedResults.nextPage += 1;
          cachedResults.items = items;
          cachedResults.total = data.total;

          that.setState({
            isLoadingTail: false,
            dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
          });
        }
      })
      .catch((error) => {
        this.setState({
          isLoadingTail: false
        });
        console.warn(error);
      });
  }

  render() {
    // let data = this.props.data;
    const {params} = this.props.navigation.state;
    let data = params.data;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBox}
            onPress={this._pop.bind(this)}
          >
            <Icon
              style={styles.backIcon}
              name='ios-arrow-back'
            />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text
            style={styles.headerTitle}
            numberOfLines={1} // only 1 line
          >
            Video Detail Page
          </Text>
        </View>
        <View style={styles.videoBox}>
          <Video
            style={styles.video}
            ref="videoPlayer"
            source={{uri: data.video}}
            // Sound: 0 is muted, 1 is double.
            volume={5}
            // paused false or true
            paused={this.state.paused}
            // 0 is paused, 1 is normal.
            rate={this.state.rate}
            // Mutes true or false.
            muted={this.state.muted}
            // Fill the whole screen at aspect ratio
            resizeMode={this.state.resizeMode}
            // Repeat true or false.
            repeat={this.state.repeat}
            // Callback when video starts to load
            onLoadStart={this._onLoadStart.bind(this)}
            // Callback when video loading
            onLoad={this._onLoad.bind(this)}
            // Callback every ~250ms with currentTime
            onProgress={this._onProgress.bind(this)}
            // Callback when playback finishes
            onEnd={this._onEnd.bind(this)}
            // Callback when video cannot be loaded
            onError={this._onError.bind(this)}
          />
          {/* 视频出错 */}
          {
            !this.state.videoOk && <Text style={styles.failText}>视频出错了！</Text>
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
          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
          </View>
        </View>
        <ListView
          // 列表依赖的数据源
          dataSource={this.state.dataSource}
          // copy 从数据源(Data source)接受一条数据,它所在section的ID,返回一个可渲染的组件
          renderRow={this._renderRow.bind(this)}
          // copy 页头会在每次渲染过程中都重新渲染
          renderHeader={this._renderHeader.bind(this)}
          // copy 页脚会在每次渲染过程中都重新渲染
          renderFooter={this._renderFooter.bind(this)}
          // copy 当所有的数据都已经渲染过，
          onEndReached={this._fetchMoreData.bind(this)}
          // 滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用。单位是像素。
          onEndReachedThreshold={20}
          // 渲染空的区块
          enableEmptySections={true}
          // 是否展示垂直的滚动条
          showsVerticalScrollIndicator={false}
          // 控制是否调整内容（消除小空白）
          automaticallyAdjustContentInsets={false}
        />
        <Modal
          //  modal animates.
          animationType={'fade'}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // passing a function that will be called once then modal has been dismissed.
            this._setModalVisible(false)
          }}
        >
          <View style={styles.modalContainer}>
            <Icon
              style={styles.closeIcon}
              name="ios-close-outline"
              onPress={this._closeModal.bind(this)}
            />
            <View style={styles.commentBox}>
              <View style={styles.comment}>
                <TextInput
                  style={styles.content}
                  placeholder="Comment me"
                  multiline={true}
                  defaultValue={this.state.content}
                  onChangeText={(text) => {
                    this.setState({
                      content: text
                    });
                  }}
                />
              </View>
            </View>
            <Button
              style={styles.submitBtn}
              onPress={this._submit.bind(this)}
            >
              Comment
            </Button>
          </View>
        </Modal>
      </View>
    )
  }

  _renderRow(row) {
    return (
      <View
        style={styles.replyBox}
        key={row._id}
      >
        <Image
          style={styles.replyAvator}
          source={{uri: row.replyBy.avatar}}
        />
        <View style={styles.reply}>
          {/* RAP: render() console.log(data) */}
          <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
          <Text style={styles.replyContent}>{row.content}</Text>
        </View>
      </View>
    )
  }

  _renderHeader() {
    let data = this.state.data;
    return (
      <View style={styles.listHeader}>
        <View style={styles.infoBox}>
          <Image
              style={styles.avatar}
              source={{uri: data.author.avatar}}
          />
          <View style={styles.descBox}>
            <Text style={styles.nickname}>{data.author.nickname}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
                style={styles.content}
                underlineColorAndroid='transparent'
                placeholder="Love that cat"
                multiline={true}
                onFocus={this._focus.bind(this)}
            />
          </View>
        </View>
        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>Nice Comment</Text>
        </View>
      </View>
    )
  }

  _renderFooter() {
    if (!this._hasMore() && cachedResults.items.total !== 0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>No More!</Text>
        </View>
      )
    }

    if (!this.state.isLoadingTail) {
      return <View style={styles.loadingMore}/>
    }

    return <ActivityIndicator
      style={styles.loadingMore}
    />
  }

  _pop() {
    // 取消压站内容
    // this.props.navigator.pop();
    const {navigate} = this.props.navigation;
    navigate('List');
  }

  _onLoadStart() {
  }

  _onLoad() {
  }

  _onProgress(data) {
    if (!this.state.videoLoaded) {
      this.setState({
        videoLoaded: true
      })
    }

    // console.log(data);
    // total time
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
    if (!this.state.playing) {
      newState.playing = true
    }

    this.setState(newState);
  }

  _onEnd() {
    this.setState({
      videoProgress: 1,
      playing: false
    });
  }

  _onError(e) {
    this.setState({
      videoOk: false
    });
  }

  _rePlay() {
    this.refs.videoPlayer.seek(0)
  }

  _pause() {
    if (!this.state.paused) {
      this.setState({
        paused: true
      })
    }
  }

  _resume() {
    if (this.state.paused) {
      this.setState({
        paused: false
      })
    }
  }

  _focus() {
    this._setModalVisible(true);
  }

  _closeModal() {
    this._setModalVisible(false);
  }

  _setModalVisible(isVisible) {
    this.setState({
      modalVisible: isVisible
    })
  }

  _submit() {
    let that = this;

    if (!this.state.content) {
      return Alert.alert('Can not null');
    }
    if (this.state.isSending) {
      return Alert.alert('Commenting');
    }

    this.setState({
      isSending: true
    }, function () {
      let body = {
        accessToken: 'abc',
        creation: '123',  // 评论视频
        content: this.state.content // 评论内容
      };
      let url = config.api.base + config.api.comment;

      request
        .post(url, body)
        .then(function (data) {
          if (data && data.success) {
            let items = cachedResults.items.slice();
            items = [{
              content: that.state.content,
              replyBy: {
                avatar: 'http://dummyimage.com/640X640/7c1d80)',
                nickname: 'cat say'
              }
            }].concat(items);
            cachedResults.items = items;
            cachedResults.total = cachedResults.total + 1;
            that.setState({
              isSending: false,
              dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
            });
            that._setModalVisible(false);
          }
        })
        .catch((err) => {
          that.setState({
            isSending: false
          });
          that._setModalVisible(false);
          Alert.alert('Message Error');
        });
    });
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },

  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#fff'
  },

  closeIcon: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#ee753c'
  },

  submitBtn: {
    width: width - 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ee735c',
    borderRadius: 4,
    fontSize: 18,
    color: '#ee735c'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff'
  },

  backBox: {
    position: 'absolute',
    left: 12,
    top: 32,
    width: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },

  headerTitle: {
    width: width - 120,
    textAlign: 'center'
  },

  backIcon: {
    color: '#999',
    fontSize: 20,
    marginRight: 5
  },

  backText: {
    color: '#999'
  },

  videoBox: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },

  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },

  loading: {
    position: 'absolute',
    left: 0,
    top: 80,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },

  failText: {
    position: 'absolute',
    left: 0,
    top: 90,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },

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

  pauseBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: width * 0.56
  },

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
  },

  infoBox: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },

  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30
  },

  descBox: {
    flex: 1
  },

  nickname: {
    fontSize: 18
  },

  title: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  },

  replyBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },

  replyAvator: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },

  replyNickname: {
    color: '#666'
  },

  replyContent: {
    marginTop: 4,
    color: '#666'
  },

  reply: {
    flex: 1
  },

  loadingMore: {
    marginVertical: 20
  },

  loadingText: {
    color: '#777',
    textAlign: 'center'
  },

  listHeader: {
    width: width,
    marginTop: 10
  },

  commentBox: {
    marginTop: 0,
    marginBottom: 10,
    padding: 8,
    width: width
  },

  comment: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4
  },

  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },

  commentTitle: {},

  content: {
    paddingLeft: 2,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 14,
    height: 80
  }
});