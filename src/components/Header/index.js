/**
 * 顶部导航栏 组件(Header)
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

let {width} = Dimensions.get("window");

export default class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //
    }
  }

  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBox}
          onPress={this._pop.bind(this)}
        >
          <Icon
            style={styles.backIcon}
            name='ios-arrow-back'
          />
          <Text style={styles.backText}>返回</Text>
        </TouchableOpacity>
        <Text
          style={styles.headerTitle}
          numberOfLines={1} // only 1 line
        >
          视频详情页
        </Text>
      </View>
    )
  }

  _pop() {
    // 取消压站内容
    // this.props.navigator.pop();
    const {navigate} = this.props.navigation;
    navigate('List');
  }
}


const styles = StyleSheet.create({
  // 顶部标题栏
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
  // 返回按钮样式
  backBox: {
    position: 'absolute',
    left: 12,
    top: 32,
    width: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  // 顶部标题样式
  headerTitle: {
    width: width - 120,
    textAlign: 'center'
  },
  // 返回按钮 icon 样式
  backIcon: {
    color: '#999',
    fontSize: 20,
    marginRight: 5
  },
  // 返回按钮 文案样式
  backText: {
    color: '#999'
  }
});