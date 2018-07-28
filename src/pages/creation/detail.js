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
// 评论列表 子组件 item
import CommentItem from '../../components/CommentItem';
// 评论列表页 头部
import CommentListHeader from '../../components/CommentListHeader';

import config from '../../common/config';
import request from '../../common/request';

let { width } = Dimensions.get("window");
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

    this.state = {
      data: params.data,
      // 评论数据
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows([]),
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
      </View>
    )
  }

  _renderRow(row) {
    return (
      <CommentItem row={row} />
    )
  }

  _renderHeader() {
    let data = this.state.data;
    return (
      <CommentListHeader data={data} />
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
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
});