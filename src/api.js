import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'

const api = {
  getPosts({ page } = { page: 1 }) {
    return fetch(`http://localhost:3000/posts?_page=${page}`).then(res => res.json())
  },
  getPost(id) {
    return fetch(`http://localhost:3000/posts/${id}`).then(res => res.json())
  },
  createPost({ title, content }) {
    return fetch(`http://localhost:3000/posts`, {
      method: 'POST',
      body: JSON.stringify({
        id: uuid(),
        createdAt: dayjs().format(),
        title,
        content,
      }),
    })
  },
  updatePost({ id, title, content }) {
    return fetch(`http://localhost:3000/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title,
        content,
      }),
    })
  },
}

export default api
