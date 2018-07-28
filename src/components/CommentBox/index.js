/**
 * 评论操作 组件(CommentBox)
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import config from '../../common/config';
import request from '../../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

let { width } = Dimensions.get("window");

export default class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // modal
      content: '',
      animationType: 'none',
      modalVisible: false,
      isSending: false
    }
  }

  render() {
    const { data } = this.props;

    return (
      <View>
        {/*评论操作*/}
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
              style={styles.content}
              underlineColorAndroid='transparent'
              placeholder="好喜欢这个狗狗啊..."
              multiline={true}
              onFocus={this._focus.bind(this)}
            />
          </View>
        </View>
        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
        {/*浮层*/}
        <Modal
          //  modal 动画
          animationType={'fade'}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // 浮层关闭时调用
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
                  placeholder="敢不敢评论一个..."
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
              评论
            </Button>
          </View>
        </Modal>
      </View>
    )
  }

  // 设置浮层显示或隐藏
  _setModalVisible(isVisible) {
    this.setState({
      modalVisible: isVisible
    })
  }

  // 输入框聚焦时调用
  _focus() {
    this._setModalVisible(true);
  }

  // 隐藏浮层
  _closeModal() {
    this._setModalVisible(false);
  }

  // 提交评论
  _submit() {
    let that = this;

    if (!this.state.content) {
      return Alert.alert('留言不能为空!');
    }
    if (this.state.isSending) {
      return Alert.alert('正在评论中!');
    }

    this.setState({
      isSending: true
    }, function () {
      // 请求参数
      let body = {
        accessToken: 'abc',
        creation: '123',  // 评论视频
        content: this.state.content // 评论内容
      };
      // 接口
      let url = config.api.base + config.api.comment;

      request
        .post(url, body)
        .then(function (data) {
          if (data && data.success) {
            // 之前的items
            let items = cachedResults.items.slice();
            // 将新的item拼接到items
            items = [{
              content: that.state.content,
              replyBy: {
                avatar: 'http://dummyimage.com/640X640/7c1d80)',
                nickname: '狗狗说'
              }
            }].concat(items);
            // 将数据保存在缓存数据中
            // cachedResults.items = items;
            // cachedResults.total = cachedResults.total + 1;
            that.setState({
              isSending: false,
              // dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
            });
            // 向父组件传值
            // that.props.changeCachedResults();
            // 隐藏浮层
            that._setModalVisible(false);
          }
        })
        .catch((err) => {
          // 请求发送完毕
          that.setState({
            isSending: false
          });
          // 隐藏浮层
          that._setModalVisible(false);
          Alert.alert('留言失败,稍后重试!');
        });
    });
  }
}


const styles = StyleSheet.create({
  // 评论
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
  },
  // 浮层样式
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
  // 评论按钮
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
  }
});