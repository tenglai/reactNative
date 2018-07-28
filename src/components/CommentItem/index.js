/**
 * 评论列表页 item 组件(CommentItem)
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

export default class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
    }
  }

  render() {
    const { row } = this.props;

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
}


const styles = StyleSheet.create({
  // 评论区
  replyBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  // 评论区头像
  replyAvator: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },
  // 评论区昵称
  replyNickname: {
    color: '#666'
  },
  // 评论区内容
  replyContent: {
    marginTop: 4,
    color: '#666'
  },

  reply: {
    flex: 1
  }
});