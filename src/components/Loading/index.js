/**
 * 加载动画
 */
import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const Loading = ()=>(
  <ActivityIndicator style={styles.loading} />
);

const styles = StyleSheet.create({
  loading: {
    marginVertical: 20
  }
});

export default Loading;