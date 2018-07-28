/**
 * 视频列表页 item 组件(CreationItem)
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight, // 透明的点击层(点击高亮)
  ImageBackground,
  Alert,
} from 'react-native';

// 图标库
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../../common/config';
import request from '../../common/request';

// 获取当前屏幕宽度
let {width} = Dimensions.get("window");

// 每个item 的视图模板
export default class CreationItem extends Component {
  constructor(props) {
    super(props);
    // 数据
    let row = this.props.row;
    this.state = {
      up: row.voted,
      row: row
    }
  }

  render() {
    const { row } = this.state;

    return (
      <TouchableHighlight onPress={() => this._loadPage(row)}>
        <View style={styles.item}>
          {/*标题*/}
          <Text style={styles.title}>{row.title}</Text>
          {/*缩略图/封面图*/}
          <ImageBackground
            style={styles.thumb}
            source={{uri: row.thumb}}
          >
            {/*播放按钮*/}
            <Icon
              style={styles.play}
              name={'ios-play'}
              size={28}
            />
          </ImageBackground>
          {/*底部操作项*/}
          <View style={styles.itemFooter}>
            {/*喜欢/不喜欢 操作*/}
            <View style={styles.handleBox}>
              <Icon
                style={[styles.up, this.state.up ? null : styles.down]}
                name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
                size={28}
                onPress={this._up.bind(this)}
              />
              <Text
                style={styles.handleText}
                onPress={this._up.bind(this)}
              >
                喜欢
              </Text>
            </View>
            {/*评论 操作*/}
            <View style={styles.handleBox}>
              <Icon
                style={styles.commentItem}
                name={'ios-happy-outline'}
                size={28}
              />
              <Text style={styles.handleText}>
                评论
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  // 跳转详情页
  _loadPage(row) {
    const {navigate} = this.props.navigation;
    navigate('Detail', {
      data: row
    });
  }

  /**
   * 点赞操作
   */
  _up() {
    let that = this;
    let up = !this.state.up;
    let row = this.state.row;
    let url = config.api.base + config.api.up;
    let body = {
      id: row._id,  // important!
      up: up ? 'yes' : 'no',
      accessToken: 'abc'
    };
    // 发起请求
    request
      .post(url, body)
      .then(function (data) {
        if (data && data.success) {
          that.setState({
            up: up
          });
        } else {
          Alert.alert('点赞失败,稍后重试!');
        }
      })
      .catch(function (err) {
        Alert.alert('点赞失败,稍后重试!');
      })
  }
}

// 样式
const styles = StyleSheet.create({
  // 每一个视频 item
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  // 缩略图
  thumb: {
    width: width,
    height: width * 0.56
  },
  // 标题
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333'
  },
  // 底部操作项
  itemFooter: {
    flexDirection: 'row', // 对齐方向-行
    justifyContent: 'space-between', // 两端对齐
    backgroundColor: '#eee'
  },

  handleBox: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: width / 2 - 0.5,
    backgroundColor: '#fff'
  },
  // 播放按钮
  play: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66'
  },
  // 文案的样式
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  // 顶 星状图标
  up: {
    fontSize: 22,
    color: '#f00'
  },

  down: {
    fontSize: 22,
    color: '#333'
  },

  commentItem: {
    fontSize: 22,
    color: '#333'
  }
});