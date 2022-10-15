import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from 'store/store'

import { getPosts } from '../../client/api'

export interface IPost {
  id: string
  title: string
  body: string
}

interface IPostsState {
  posts: Array<IPost>
  status: 'idle' | 'load' | 'suc' | 'fail'
}

const initialState: IPostsState = {
  posts: [],
  status: 'idle',
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await getPosts()
  return res
})

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetPosts: (state) => {
      state.posts = []
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload
        state.status = 'suc'
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts = []
        state.status = 'fail'
      })
      .addCase(fetchPosts.pending, (state) => {
        state.posts = []
        state.status = 'load'
      })
  },
})

export const { resetPosts } = postsSlice.actions

export const selectPosts = (state: RootState) => state.posts.posts
export const selectPostsStatus = (state: RootState) => state.posts.status

export default postsSlice.reducer
