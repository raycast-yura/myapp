import React, {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from 'react'
import { View, StyleSheet, ListRenderItemInfo, ActivityIndicator } from 'react-native'
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'

import CommentComponent from 'components/CommentComponent'

import {
  fetchComments,
  IComment,
  resetComments,
  selectComments,
  selectCommentsStatus,
} from 'store/slices/commentsSlice'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { HomeScreenProps } from 'pages/types'
import Snackbar from 'react-native-snackbar'

export interface IModal {
  show: (postId: string) => void
  hide: () => void
}

const CommentsModalComponent = forwardRef<IModal>((props, ref) => {
  const dispatch = useAppDispatch()

  const bottomSheetRef = useRef<BottomSheet>(null)

  const comments = useAppSelector(selectComments)
  const commentsStatus = useAppSelector(selectCommentsStatus)

  const navigation = useNavigation<HomeScreenProps['navigation']>()

  const [isOpen, setOpen] = useState<boolean>(false)

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!isOpen) {
          return
        }

        e.preventDefault()
        dispatch(resetComments())
        bottomSheetRef.current?.close()
      }),
    [navigation, isOpen, dispatch],
  )

  useImperativeHandle(ref, () => ({
    show: (postId) => {
      dispatch(fetchComments(postId))
      bottomSheetRef.current?.expand()
    },
    hide: () => {
      dispatch(resetComments())
      bottomSheetRef.current?.close()
    },
  }))

  const renderItemHandler = useCallback(({ item }: ListRenderItemInfo<IComment>) => {
    return <CommentComponent body={item.body} name={item.name} />
  }, [])

  const keyExtractorHandler = useCallback((item: IComment) => {
    return item.id
  }, [])

  const onPressBackdropHandler = useCallback(() => {
    dispatch(resetComments())
  }, [dispatch])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        opacity={0.5}
        onPress={onPressBackdropHandler}
      />
    ),
    [onPressBackdropHandler],
  )

  const snapPoints = useMemo(() => ['50%'], [])

  const listFooterComponent = useMemo(() => {
    if (commentsStatus == 'load') {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size={27} color={'black'} />
        </View>
      )
    } else if (commentsStatus == 'fail') {
      dispatch(resetComments())
      bottomSheetRef.current?.close()
      Snackbar.show({
        text: 'Something went wrong',
        duration: Snackbar.LENGTH_SHORT,
      })
    }
  }, [commentsStatus, dispatch])

  const onChangeSheetHandler = useCallback((index: number) => {
    if (index == -1) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheet}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={onChangeSheetHandler}
    >
      <BottomSheetFlatList<IComment>
        data={comments}
        renderItem={renderItemHandler}
        keyExtractor={keyExtractorHandler}
        ListFooterComponent={listFooterComponent}
        ListFooterComponentStyle={styles.footerContainer}
        contentContainerStyle={styles.listContainer}
      />
    </BottomSheet>
  )
})
// const bottomSheetRef = useRef<BottomSheet>(null)

CommentsModalComponent.displayName = 'CommentsModalComponent'

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: 'white',
  },

  listContainer: {
    flexGrow: 1,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
})

export default CommentsModalComponent
