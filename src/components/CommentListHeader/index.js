/**
 * 评论列表 头部 组件(CommentListHeader)
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';
// 评论组件
import CommentBox from '../CommentBox';

let { width } = Dimensions.get("window");

export default class CommentListHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
    }
  }

  render() {
    const { data } = this.props;

    return (
      <View style={styles.listHeader}>
        {/*视频信息的展示*/}
        <View style={styles.infoBox}>
          <Image
            style={styles.avatar}
            source={{uri: data.author.avatar}}
          />
          {/*视频的描述*/}
          <View style={styles.descBox}>
            <Text style={styles.nickname}>{data.author.nickname}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
        </View>
        {/*评论操作*/}
        <CommentBox />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  listHeader: {
    width: width,
    marginTop: 10
  },
  // 信息框
  infoBox: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  // 头像
  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30
  },
  // 描述
  descBox: {
    flex: 1
  },
  // 昵称
  nickname: {
    fontSize: 18
  },
  // 标题
  title: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  }
});