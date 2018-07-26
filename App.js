/**
 * 入口文件
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
// 导航
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
// 图标
import Icon from 'react-native-vector-icons/Ionicons';

// 列表页
import ListScreen from './src/pages/creation/index';
// 编辑页
import EditScreen from './src/pages/edit/index';
// 用户页
import AccountScreen from './src/pages/acount/index';
// 图片页
import PictureScreen from './src/pages/picture/index';

// 创建详情页
import DetailScreen from './src/pages/creation/detail';
// 登录页
import LoginScreen from './src/pages/acount/login';

// tabbar item
class TabBarItem extends Component {
  render() {
    return (
      <Image
        style={{tintColor: this.props.tintColor, width: 25, height: 25}}
        source={this.props.focused ? this.props.selectedImage : this.props.normalImage}
      />
    )
  }
}

const Tab = createBottomTabNavigator(
  {
    List: {
      screen: ListScreen,
      navigationOptions: () => (
        {
          tabBarLabel: 'List',
          tabBarIcon: ({tintColor, focused}) => (
            <TabBarItem
              tintColor={tintColor}
              focused={focused}
              normalImage={require('./src/assets/img/icon_tabbar_misc.png')}
              selectedImage={require('./src/assets/img/icon_tabbar_misc_selected.png')}
            />
          )
        }
      )
    },
    Edit: {
      screen: EditScreen,
      navigationOptions: () => (
        {
          tabBarLabel: 'Edit',
          tabBarIcon: ({tintColor, focused}) => (
            <TabBarItem
              tintColor={tintColor}
              focused={focused}
              normalImage={require('./src/assets/img/icon_tabbar_mine.png')}
              selectedImage={require('./src/assets/img/icon_tabbar_mine_selected.png')}
            />
          )
        }
      )
    },
    Picture: {
      screen: PictureScreen,
      navigationOptions: () => (
        {
          tabBarLabel: 'Picture',
          tabBarIcon: ({tintColor, focused}) => (
            <TabBarItem
              tintColor={tintColor}
              focused={focused}
              normalImage={require('./src/assets/img/icon_tabbar_merchant_normal.png')}
              selectedImage={require('./src/assets/img/icon_tabbar_merchant_selected.png')}
            />
          )
        }
      )
    },
    Account: {
      screen: AccountScreen,
      navigationOptions: ({navigation}) => (
        {
          tabBarLabel: 'Account',
          tabBarIcon: ({tintColor, focused}) => (
            <TabBarItem
              tintColor={tintColor}
              focused={focused}
              normalImage={require('./src/assets/img/icon_tabbar_homepage.png')}
              selectedImage={require('./src/assets/img/icon_tabbar_homepage_selected.png')}
            />
          )
        }
      )
    }
  },
  {
    // 设置默认的页面组件
    initialRouteName: 'Account',
    // 设置tabbar的位置，iOS默认在底部，安卓默认在顶部。
    tabBarPosition: 'bottom',
    // 是否允许在标签之间进行滑动。
    swipeEnabled: false,
    // 是否在更改标签时显示动画。
    animationEnabled: false,
    // 在app打开的时候将底部标签栏全部加载，默认false,推荐改成true
    lazy: true,
    // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    backBehavior: 'none',
    tabBarOptions: {
      // 文字和图片选中颜色
      activeTintColor: '#ff8500',
      // 文字和图片未选中颜色
      inactiveTintColor: '#999',
      // label和icon的背景色 未选中。
      inactiveBackgroundColor: '#fff',
      // 是否显示label，默认开启。
      showLabel: true,
      // android 默认不显示 icon, 需要设置为 true 才会显示
      showIcon: true,
      // 是否使标签大写，默认为true。
      upperCaseLabel: false,
      indicatorStyle: {
        // 如TabBar下面显示有一条线，可以设高度为0后隐藏.
        height: 0
      },
      style: {
        // TabBar 背景色
        backgroundColor: '#fff'
      },
      labelStyle: {
        // 文字大小
        fontSize: 10
      }
    }
  }
);


// 初始化StackNavigator
const Navigator = createStackNavigator(
  {
    // 将TabNavigator包裹在StackNavigator里面可以保证跳转页面的时候隐藏tabbar
    Tab: {
      screen: Tab,
      navigationOptions: {
        header: null // 顶部导航很多都会自己自定义，这里就为空
      }
    },
    Detail: {
      screen: DetailScreen,
      navigationOptions: {
        header: null
      }
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    //initialRouteName: 'Login'
    initialRouteName: 'Tab' // 默认出现的Tab页面
  }
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


export default Navigator;