/**
 * 视频列表页
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ListView,
  TouchableHighlight,
  Alert,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
// 下拉刷新/上拉加载更多组件
import Scroller from '../../components/Scroller';
// 图标
import Icon from 'react-native-vector-icons/Ionicons';
// item 组件
import CreationItem from '../../components/CreationItem';
import config from '../../common/config';
import request from '../../common/request';

let {width} = Dimensions.get("window");

// 缓存列表中所有数据
let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // listview 数据(视频列表)
  total: 0 // 总数
};

export default class List extends Component {
  // 构造函数
  constructor() {
    super();
    let ds = new ListView.DataSource({
      // 比较两条数据是否是一样的,来判断数据是否发生改变
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoadingTail: false, // loading?
      isRefreshing: false // refresh?
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/*顶部标题栏*/}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        {/*列表数据*/}
        <Scroller
          // 数据源
          dataSource={this.state.dataSource}
          // 渲染item(子组件)
          renderRow={this._renderRow.bind(this)}
          // 是否可以刷新
          isRefreshing={this.state.isRefreshing}
          // 是否可以加载更多
          isLoadingTail={this.state.isLoadingTail}
          // 请求数据
          fetchData={this._fetchData.bind(this)}
          // 缓存列表数据
          cachedResults={cachedResults}
        />
      </View>
    )
  }

  // 生命周期-组件挂载完毕 请求数据
  componentDidMount() {
    this._fetchData(1);
  }

  // 请求数据
  _fetchData(page) {
    let that = this;

    if (page !== 0) { // 加载更多操作
      this.setState({
        isLoadingTail: true
      });
    } else { // 刷新操作
      this.setState({
        isRefreshing: true
      });
      // 初始哈 nextPage
      cachedResults.nextPage = 1;
    }

    request
      .get(config.api.base + config.api.creations, {
        accessToken: 'abc'
      })
      // data 变化的新数据
      .then((data) => {
        if (data.success) {
          // 保存原数据
          let items = cachedResults.items.slice();
          if (page !== 0) { // 加载更多操作
            // 数组拼接
            items = items.concat(data.data);
            cachedResults.nextPage += 1;
          } else { // 刷新操作
            // 数据不变
            items = data.data;
          }

          cachedResults.items = items; // 视频列表数据
          cachedResults.total = data.total; // 总数

          setTimeout(function () {
            if (page !== 0) { // 加载更多操作
              that.setState({
                isLoadingTail: false,
                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
              });
            } else { // 刷次操作
              that.setState({
                isRefreshing: false,
                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
              });
            }
          }, 1000);
        }
      })
      .catch((error) => {
        if (page !== 0) { // 上拉加载更多操作
          this.setState({
            isLoadingTail: false
          });
        } else {
          this.setState({ // 刷新操作
            isRefreshing: false
          });
        }
        console.error(error);
      });
  }

  // 列表 Item
  _renderRow(row) {
    const { navigation } = this.props;
    return (
      <CreationItem
        navigation={navigation}
        key={row.id} // 子组件唯一性
        row={row}
      />
    )
  }
}

// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  // 头部样式
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c',
  },
  // 头部title样式
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
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