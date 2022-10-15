import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import { View, StyleSheet, FlatList, ListRenderItemInfo, ActivityIndicator } from 'react-native'
import Snackbar from 'react-native-snackbar'

import { useNavigation } from '@react-navigation/native'

import { useNetInfo } from '@react-native-community/netinfo'

import { HomeScreenProps } from 'pages/types'

import { useAppDispatch, useAppSelector } from 'hooks/hooks'

import { readLocalPosts, writeLocalPosts } from 'client/api'

import {
  fetchPosts,
  selectPosts,
  IPost,
  selectPostsStatus,
  resetPosts,
} from 'store/slices/postSlice'
import PostComponent from 'components/PostComponent'
import CommentsModalComponent, { IModal } from 'components/CommentsModalComponent'

const HomeScreen = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectPosts)
  const postsStatus = useAppSelector(selectPostsStatus)

  const navigation = useNavigation<HomeScreenProps['navigation']>()
  const bottomSheetRef = useRef<IModal>(null)

  const [listItems, setListItems] = useState<Array<IPost>>([])

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(resetPosts())
      bottomSheetRef.current?.hide()
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const netInfo = useNetInfo()

  // const [lastNetStatus, setLastStatus] = useState<boolean>(false)

  useEffect(() => {
    if (posts.length === 0 && postsStatus === 'idle' && netInfo.isConnected) {
      dispatch(fetchPosts())
    } else if (posts.length === 0 && postsStatus === 'idle') {
      readLocalPosts()
        .then((localPosts: Array<IPost>) => {
          setListItems(localPosts)
        })
        .catch((e) => console.error(e))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netInfo])

  useEffect(() => {
    if (postsStatus === 'fail') {
      Snackbar.show({
        text: 'Something went wrong',
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: 'Repeat',
          onPress: () => {
            dispatch(fetchPosts())
          },
        },
      })
    } else if (postsStatus === 'suc') {
      setListItems(posts)
      writeLocalPosts(posts).catch((e) => console.error(e))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsStatus])

  const onPressPostHandler = useCallback((postId: string) => {
    bottomSheetRef.current?.show(postId)
    // dispatch(fetchComments(postId))
  }, [])

  const renderItemHandler = useCallback(
    ({ item }: ListRenderItemInfo<IPost>) => {
      return (
        <PostComponent
          title={item.title}
          body={item.body}
          onPress={() => onPressPostHandler(item.id)}
        />
      )
    },
    [onPressPostHandler],
  )

  const keyExtractorHandler = useCallback((item: IPost) => {
    return item.id
  }, [])

  const listFooterComponent = useMemo(() => {
    if (postsStatus === 'load') {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size={27} color={'black'} />
        </View>
      )
    }
  }, [postsStatus])

  return (
    <View style={styles.container}>
      <FlatList<IPost>
        data={listItems}
        renderItem={renderItemHandler}
        keyExtractor={keyExtractorHandler}
        ListFooterComponent={listFooterComponent}
        ListFooterComponentStyle={styles.footerContainer}
        contentContainerStyle={styles.listContainer}
      />
      <CommentsModalComponent ref={bottomSheetRef} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContainer: {
    flexGrow: 1,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
})

export default HomeScreen
