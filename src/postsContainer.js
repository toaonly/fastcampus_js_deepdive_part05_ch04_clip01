import createElement from './createElement'
import renderPostRow from './postRow'

const CLASSNAME = {
  CONTAINER: 'posts-container',
  get HEADER() {
    return `${this.CONTAINER}__header`
  },
  get HEADER_ID() {
    return `${this.HEADER}__id`
  },
  get HEADER_TITLE() {
    return `${this.HEADER}__title`
  },
  get HEADER_CREATED_AT() {
    return `${this.HEADER}__created-at`
  },
  get LIST() {
    return `${this.CONTAINER}__list`
  },
}

export default function renderPostsContainer({ posts, onCreatePostClick, onPostClick }) {
  return createElement('div', { className: CLASSNAME.CONTAINER }, [
    createElement('div', { className: 'flex justify-end' }, [
      createElement(
        'button',
        {
          className: 'px-4 py-2 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 rounded-sm',
          onclick() {
            onCreatePostClick()
          },
        },
        ['작성하기']
      ),
    ]),
    createElement('div', { className: CLASSNAME.HEADER }, [
      createElement('div', { className: CLASSNAME.HEADER_ID }, ['ID.']),
      createElement('div', { className: CLASSNAME.HEADER_TITLE }, ['제목']),
      createElement('div', { className: CLASSNAME.HEADER_CREATED_AT }, ['작성일']),
    ]),
    createElement(
      'div',
      { className: CLASSNAME.LIST },
      posts.map(post => renderPostRow({ post, onPostClick }))
    ),
  ])
}
