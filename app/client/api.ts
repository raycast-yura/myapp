import axios from 'axios'
import { Dirs, FileSystem } from 'react-native-file-access'
import { IPost } from 'store/slices/postSlice'

export const getPosts = async () => {
  const res = await axios({
    method: 'get',
    url: 'https://jsonplaceholder.typicode.com/posts',
  })

  return res.data
}

export const getComments = async (postId: string) => {
  const res = await axios({
    method: 'get',
    url: `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
  })
  return res.data
}

export const readLocalPosts = async () => {
  const pathExists = await FileSystem.exists(Dirs.CacheDir + '/posts.txt')
  if (pathExists) {
    const postsStr = await FileSystem.readFile(Dirs.CacheDir + '/posts.txt')
    return JSON.parse(postsStr)
  } else {
    return []
  }
}

export const writeLocalPosts = async (posts: Array<IPost>) => {
  const postsStr = JSON.stringify(posts)
  await FileSystem.writeFile(Dirs.CacheDir + '/posts.txt', postsStr)
}
