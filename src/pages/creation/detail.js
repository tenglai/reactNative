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
// 顶部导航栏
import Header from '../../components/Header';
// 播放器组件
import VideoPlayer from '../../components/VideoPlayer';
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
    // 获取导航器传递的参数
    const {params} = this.props.navigation.state;
    // let data = this.props.data; // _loadPage() data: row
    this.state = {
      data: params.data,
      // 评论数据
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows([]),

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
        {/*顶部标题栏*/}
        <Header {...this.props} />
        {/*视频播放器*/}
        <VideoPlayer uri={data.video} />
        {/*评论列表*/}
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