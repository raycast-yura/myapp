import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface ICommentProps {
  name: string
  body: string
}

const CommentComponent: React.FC<ICommentProps> = ({ body, name }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.titleText}>{name}</Text>
      <Text style={styles.bodyText}>{body}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  bodyText: {
    fontWeight: '400',
    fontSize: 14,
    color: 'grey',
  },
})

export default CommentComponent
