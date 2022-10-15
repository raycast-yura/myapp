import { configureStore } from '@reduxjs/toolkit'

import postsReducer from 'store/slices/postSlice'
import commentsReducer from 'store/slices/commentsSlice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
