/**
 * 没有更多数据
 */
import React from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

const NoMore = () => (
  <View style={styles.loadingMore}>
    <Text style={styles.loadingText}>没有更多了</Text>
  </View>
)

const styles = StyleSheet.create({
  loadingMore: {
    marginVertical: 20
  },

  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
})

export default NoMore;