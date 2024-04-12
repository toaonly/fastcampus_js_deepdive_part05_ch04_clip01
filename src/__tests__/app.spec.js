import { vi } from 'vitest'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import db from '../../db/db.json'
import renderApp from '../app'

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('app 테스트', () => {
  beforeAll(() => {
    vi.mock('../api.js', () => {
      return {
        default: {
          getPosts({ page }) {
            const start = (page - 1) * 10
            const end = start + 10

            return Promise.resolve({
              first: 1,
              items: db.posts.length,
              last: Math.ceil(db.posts.length / 10),
              next: page + 1,
              pages: Math.ceil(db.posts.length / 10),
              prev: page - 1,
              data: db.posts.slice(start, end),
            })
          },
          getPost: ({ id }) => Promise.resolve(db.posts.find(p => p.id === id)),
          createPost({ title, content }) {
            db.posts.push({ id: uuid(), createdAt: dayjs().format(), title, content })

            return Promise.resolve(db.posts[db.posts.length - 1])
          },
          updatePost({ id, title, content }) {
            db.posts.some(post => {
              if (post.id === id) {
                post.title = title
                post.content = content
                return true
              }
            })

            return Promise.resolve(db.posts.find(p => p.id === id))
          },
        },
      }
    })
  })

  beforeEach(async () => {
    document.body.innerHTML = '<div id="app"></div>'

    await renderApp()
  })

  it('게시글을 클릭하면 게시글 수정 modal 이 나오고 게시글의 title 과 content 가 표시 된다', async () => {
    const post = db.posts[0]
    const postRow = document.querySelector(`[data-test-id="post-row__${post.id}"]`)

    expect(postRow).toBeInstanceOf(HTMLElement)

    await postRow.click()

    const postModal = document.querySelector(`[data-test-id="post-modal__${post.id}"]`)

    expect(postModal).toBeInstanceOf(HTMLElement)
    expect(postModal.querySelector('input').value).toBe(post.title)
    expect(postModal.querySelector('textarea').value).toBe(post.content)

    postModal.remove()
  })

  describe('게시글 수정 modal 테스트', () => {
    const post = db.posts[0]

    beforeEach(async () => {
      const postRow = document.querySelector(`[data-test-id="post-row__${post.id}"]`)

      await postRow.click()
    })

    it('title 을 변경 하고 수정을 누르면 해당 게시글의 title 이 수정 된다', async () => {
      const postModal = document.querySelector(`[data-test-id="post-modal__${post.id}"]`)
      const postTitle = postModal.querySelector('input')

      postTitle.value = '제목 변경 테스트 - 1'
      postTitle.dispatchEvent(new InputEvent('input'))

      await postModal.querySelector('button.btn-update').click()

      expect(db.posts[0].title).toBe('제목 변경 테스트 - 1')
    })

    it('content 를 변경 하고 수정을 누르면 해당 게시글의 content 가 수정 된다', async () => {
      const postModal = document.querySelector(`[data-test-id="post-modal__${post.id}"]`)
      const postContent = postModal.querySelector('textarea')

      postContent.value = '내용 변경 테스트 - 1'
      postContent.dispatchEvent(new InputEvent('input'))

      await postModal.querySelector('button.btn-update').click()

      expect(db.posts[0].content).toBe('내용 변경 테스트 - 1')
    })

    it('title, content 를 변경 하고 수정을 누르면 해당 게시글의 title, content 가 수정 된다', async () => {
      const postModal = document.querySelector(`[data-test-id="post-modal__${post.id}"]`)
      const postTitle = postModal.querySelector('input')
      const postContent = postModal.querySelector('textarea')

      postTitle.value = '제목 변경 테스트 - 2'
      postTitle.dispatchEvent(new InputEvent('input'))
      postContent.value = '내용 변경 테스트 - 2'
      postContent.dispatchEvent(new InputEvent('input'))

      await postModal.querySelector('button.btn-update').click()

      expect(db.posts[0].title).toBe('제목 변경 테스트 - 2')
      expect(db.posts[0].content).toBe('내용 변경 테스트 - 2')
    })

    it('게시글 수정 후 수정된 게시글이 목록에 반영되어야 한다', async () => {
      const postModal = document.querySelector(`[data-test-id="post-modal__${post.id}"]`)
      const postTitle = postModal.querySelector('input')

      postTitle.value = '제목 변경 테스트 - 3'
      postTitle.dispatchEvent(new InputEvent('input'))

      await postModal.querySelector('button.btn-update').click()

      expect(db.posts[0].title).toBe('제목 변경 테스트 - 3')

      await wait()

      const postRow = document.querySelector(`[data-test-id="post-row__${post.id}"]`)

      expect(postRow.querySelector('.posts-container__list__row__title').textContent).toBe('제목 변경 테스트 - 3')
    })
  })

  describe('게시글 생성 modal 테스트', () => {
    beforeEach(() => {
      const btnWrite = document.querySelector(`button.btn-write`)

      btnWrite.click()
    })

    it('title, content 를 입력하고 작성을 누르면 게시글이 생성된다', async () => {
      const postModal = document.querySelector(`[data-test-id="post-modal"]`)
      const postTitle = postModal.querySelector('input')
      const postContent = postModal.querySelector('textarea')

      postTitle.value = '[제목] 게시글 작성 테스트 - 1'
      postTitle.dispatchEvent(new InputEvent('input'))
      postContent.value = '[내용] 게시글 작성 테스트 - 1'
      postContent.dispatchEvent(new InputEvent('input'))

      await postModal.querySelector('button.btn-create').click()

      expect(db.posts[db.posts.length - 1].title).toBe('[제목] 게시글 작성 테스트 - 1')
      expect(db.posts[db.posts.length - 1].content).toBe('[내용] 게시글 작성 테스트 - 1')
    })

    it('게시글 작성 후 작성된 게시글이 목록에 반영되어야 한다', async () => {
      const postModal = document.querySelector(`[data-test-id="post-modal"]`)
      const postTitle = postModal.querySelector('input')
      const postContent = postModal.querySelector('textarea')

      postTitle.value = '[제목] 게시글 작성 테스트 - 2'
      postTitle.dispatchEvent(new InputEvent('input'))
      postContent.value = '[내용] 게시글 작성 테스트 - 2'
      postContent.dispatchEvent(new InputEvent('input'))

      await postModal.querySelector('button.btn-create').click()

      expect(db.posts[db.posts.length - 1].title).toBe('[제목] 게시글 작성 테스트 - 2')
      expect(db.posts[db.posts.length - 1].content).toBe('[내용] 게시글 작성 테스트 - 2')

      const lastPage = document.querySelector(`.page-container__page:last-child`)
      const lastPost = db.posts[db.posts.length - 1]

      lastPage.click()

      await wait()

      const lastPostRow = document.querySelector(`[data-test-id="post-row__${lastPost.id}"]`)

      expect(lastPostRow.querySelector('.posts-container__list__row__title').textContent).toBe(
        '[제목] 게시글 작성 테스트 - 2'
      )
    })
  })
})
