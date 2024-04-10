import api from './api'
import renderPostsContainer from './posts-container'
import renderPage from './page'
import renderPostModal from './post-modal'

export default async function renderApp(page = 1) {
  const res = await api.getPosts({ page })

  refresh(res.data, res.pages, res.first, res.prev)
}

function refresh(posts, pages, first, prev) {
  const app = document.querySelector('#app')
  const currentPage = first + prev ?? 0

  app.innerHTML = ''
  app.append(
    renderPostsContainer(posts, {
      onCreatePostClick() {
        renderPostModal({
          submitButton: {
            attrs: {
              className: 'bg-sky-500 hover:bg-sky-400 active:bg-sky-600',
            },
            text: '작성',
            async onclick(postData) {
              await api.createPost(postData)
            },
          },
        })
      },
      onPostClick(postId) {
        renderPostModal({
          postId,
          submitButton: {
            attrs: {
              className: 'bg-sky-500 hover:bg-sky-400 active:bg-sky-600',
            },
            text: '수정',
            async onclick(postData) {
              await api.updatePost(postData)
            },
          },
        })
      },
    }),
    renderPage({
      pages: pages,
      current: currentPage,
      async onClickPage(page) {
        await renderApp(page)
      },
    })
  )
}
