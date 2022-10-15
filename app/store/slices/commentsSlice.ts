import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from 'store/store'

import { getComments } from '../../client/api'

export interface IComment {
  id: string
  name: string
  body: string
}

interface ICommentsState {
  comments: Array<IComment>
  status: 'idle' | 'load' | 'suc' | 'fail'
}

const initialState: ICommentsState = {
  comments: [],
  status: 'idle',
}

export const fetchComments = createAsyncThunk('posts/fetchComments', async (postId: string) => {
  const res = await getComments(postId)
  return res
})

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    resetComments: (state) => {
      state.comments = []
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload
        state.status = 'suc'
      })
      .addCase(fetchComments.rejected, (state) => {
        state.comments = []
        state.status = 'fail'
      })
      .addCase(fetchComments.pending, (state) => {
        state.comments = []
        state.status = 'load'
      })
  },
})

export const { resetComments } = commentsSlice.actions

export const selectComments = (state: RootState) => state.comments.comments
export const selectCommentsStatus = (state: RootState) => state.comments.status

export default commentsSlice.reducer
