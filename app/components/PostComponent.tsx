import React from 'react'
import { Pressable, Text, StyleSheet, GestureResponderEvent } from 'react-native'

interface IPostProps {
  title: string
  body: string
  onPress: (event: GestureResponderEvent) => void
}

const PostComponent: React.FC<IPostProps> = ({ body, title, onPress }) => {
  return (
    <Pressable style={styles.itemContainer} onPress={onPress}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.bodyText}>{body}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
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

export default PostComponent
