/**
 * 下拉刷新/上拉加载更多 组件(Scroller)
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

export default class Scroller extends Component {
  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      //
    }
  }

  render() {
    const { dataSource, renderRow, isRefreshing } = this.props;
    // console.log(this.props);

    return (
      <View style={styles.container}>
        {/*列表数据*/}
        <ListView
          // 数据源
          dataSource={dataSource}
          // 从数据源(dataSource)中接受一条数据，以及它和它所在section的ID
          renderRow={renderRow}
          // 页头与页脚会在每次渲染过程中都重新渲染(允许在ListView底部增加一栏,便于显示加载动画)
          renderFooter={this._renderFooter.bind(this)}
          // 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
          onEndReached={this._fetchMoreData.bind(this)}
          // 调用onEndReached之前的临界值，单位是像素。(预加载)
          onEndReachedThreshold={20}
          // 隐藏右侧滚动条
          showsVerticalScrollIndicator={false}
          // finished warning : in next release ...
          enableEmptySections={true}
          // 自动调整迁移内容
          // 导航栏或标签栏或工具栏不覆盖 Scrollview 内容
          // 去除默认定位间距
          automaticallyAdjustContentInsets={false}
          // 下拉刷新
          refreshControl={
            <RefreshControl
              // 是否刷新
              refreshing={isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor={"#ff6600"}
              title={"拼命加载中..."}
            />
          }
        />
      </View>
    )
  }

  /**
   * 下拉刷新
   */
  _onRefresh() {
    // console.log('下拉刷新');
    if (this.props.isRefreshing || !this._hasMore()) {
      return
    }
    // 向后台发送 '0',告知刷新操作
    this.props.fetchData(0);
  }

  /**
   * 加 _ 代表私有方法
   * 上拉加载更多
   */
  _fetchMoreData() {
    // console.log('上拉加载更多');
    /**
     * this._hasMore() 验证还有更多数据
     * isLoadingTail true/false 加载动画(菊花图)
     */
    if (!this._hasMore() || this.props.isLoadingTail) {
      return
    }
    let page = this.props.cachedResults.nextPage;
    this.props.fetchData(page);
  }

  /**
   * 验证还有更多数据
   */
  _hasMore() {
    return this.props.cachedResults.items.length !== this.props.cachedResults.items.total;
  }

  /**
   * 底部加载动画 及 没有更多数据文本(ListView底部增加一栏,便于显示加载动画)
   */
  _renderFooter() {
    if (!this._hasMore() && this.props.cachedResults.total !== 0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      )
    }

    if (!this.props.isLoadingTail) {
      return (
        <View style={styles.loadingMore}></View>
      )
    }

    // 菊花图
    return (
      <ActivityIndicator style={styles.loadingMore}/>
    )
  }

}

// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  // 菊花图
  loadingMore: {
    marginVertical: 20
  },
  // 文案样式
  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
});