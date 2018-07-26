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
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../../common/config';
import request from '../../common/request';


let {width} = Dimensions.get("window");
let cachedResults = {
  nextPage: 1,
  // data listview
  items: [],
  total: 0
};


export default class List extends Component {
  constructor() {
    super();
    let ds = new ListView.DataSource({
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>List Page</Text>
        </View>
        <ListView
          // array data
          dataSource={this.state.dataSource}
          // 从数据源(dataSource)中接受一条数据，以及它和它所在section的ID
          renderRow={this._renderRow.bind(this)}
          // 页头与页脚会在每次渲染过程中都重新渲染
          renderFooter={this._renderFooter.bind(this)}
          // 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
          onEndReached={this.fetchMoreData.bind(this)}
          // 调用onEndReached之前的临界值，单位是像素。
          onEndReachedThreshold={20}
          // show right scrollbar ?
          showsVerticalScrollIndicator={false}
          // finished warning : in next release ...
          enableEmptySections={true}
          // Automatically adjust the contents of migration，
          // navigation bar or tab bar or toolbar dont't cover Scrollview content。
          // default it's true
          automaticallyAdjustContentInsets={false}
          refreshControl={
            <RefreshControl
              // refreshing true or false
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor={"#ff6600"}
              title={"Loading..."}
            />
          }
        />
      </View>
    )
  }

  _renderRow(row) {
    return (
      <Item
        onSelect={() => this._loadPage(row)}
        key={row.id} // 子组件唯一性
        row={row}
      />
    )
  }

  _loadPage(row) {
    // Navigator 压站操作
    // this.props.navigator.push({
    // name: 'detail',
    // component: Detail,
    // Passing parameters
    // params: {
    //   data: row
    // }
    // })
    const {navigate} = this.props.navigation;
    navigate('Detail', {
      data: row
    });
  }

  _hasMore() {
    return cachedResults.items.length !== cachedResults.items.total;
  }

  _renderFooter() {
    if (!this._hasMore() && cachedResults.items.total !== 0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>No more</Text>
        </View>
      )
    }

    if (!this.state.isLoadingTail) {
      return (
        <View style={styles.loadingMore}></View>
      )
    }

    // 菊花图
    return (
      <ActivityIndicator style={styles.loadingMore}/>
    )
  }

  _onRefresh() {
    if (this.state.isRefreshing || !this._hasMore()) {
      return
    }
    this._fetchData(0);
  }

  // The request data timing
  componentDidMount() {
    this._fetchData(1);
  }

  fetchMoreData() {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return
    }
    let page = cachedResults.nextPage;
    this._fetchData(page);
  }

  // asynchronous:  Not exposed outside '_'
  _fetchData(page) {
    let that = this;

    if (page !== 0) {
      this.setState({
        isLoadingTail: true
      });
    } else {
      this.setState({
        isRefreshing: true
      });
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
          if (page !== 0) {
            items = items.concat(data.data);
            cachedResults.nextPage += 1;
          } else {
            // 数据不变
            items = data.data.concat(items);
          }

          cachedResults.items = items;
          cachedResults.total = data.total;

          setTimeout(function () {
            if (page !== 0) {
              that.setState({
                isLoadingTail: false,
                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
              });
            } else {
              that.setState({
                isRefreshing: false,
                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
              });
            }
          }, 1000);
        }
      })
      .catch((error) => {
        if (page !== 0) {
          this.setState({
            isLoadingTail: false
          });
        } else {
          this.setState({
            isRefreshing: false
          });
        }
        console.error(error);
      });
  }
}


class Item extends Component {
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
    let row = this.state.row;
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
        <View style={styles.item}>
          <Text style={styles.title}>{row.title}</Text>
          <ImageBackground
              style={styles.thumb}
              source={{uri: row.thumb}}
          >
            <Icon
                style={styles.play}
                name={'ios-play'}
                size={28}
            />
          </ImageBackground>
          <View style={styles.itemFooter}>
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
                Like
              </Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                  style={styles.commentItem}
                  name={'ios-happy-outline'}
                  size={28}
              />
              <Text style={styles.handleText}>
                Comment
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

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

    request
      .post(url, body)
      .then(function (data) {
        if (data && data.success) {
          that.setState({
            up: up
          });
        } else {
          Alert.alert('voted fail 1');
        }
      })
      .catch(function (err) {
        Alert.alert('voted fail 2');
      })
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },

  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },

  thumb: {
    width: width,
    height: width * 0.56
  },

  title: {
    padding: 10,
    fontSize: 18,
    color: '#333'
  },

  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },

  handleBox: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: width / 2 - 0.5,
    backgroundColor: '#fff'
  },

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

  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },

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
  },

  loadingMore: {
    marginVertical: 20
  },

  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
});