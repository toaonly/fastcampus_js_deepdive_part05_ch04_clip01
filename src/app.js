import api from './api'
import renderPostsContainer from './postsContainer'
import renderPage from './page'
import { renderCreatePostModal, renderUpdatePostModal } from './postModal'

export default async function renderApp(page = 1) {
  const res = await api.getPosts({ page })

  refresh(res.data, res.pages, res.first, res.prev)
}

function refresh(posts, pages, first, prev) {
  const app = document.querySelector('#app')
  const currentPage = first + prev ?? 0

  app.innerHTML = ''
  app.append(
    renderPostsContainer({
      posts,
      onCreatePostClick() {
        renderCreatePostModal({
          async onCreated() {
            await renderApp(currentPage)
          },
        })
      },
      onPostClick(postId) {
        renderUpdatePostModal({
          postId,
          async onUpdated() {
            await renderApp(currentPage)
          },
        })
      },
    }),
    renderPage({
      pages: pages,
      current: currentPage,
      async onPageClick(page) {
        await renderApp(page)
      },
    })
  )
}
