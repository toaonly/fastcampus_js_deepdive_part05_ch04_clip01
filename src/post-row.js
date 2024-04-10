import dayjs from 'dayjs'
import createElement from './createElement'

const CLASSNAME = {
  LIST_ROW: `posts-container__list__row`,
  get LIST_ROW_ID() {
    return `${this.LIST_ROW}__id`
  },
  get LIST_ROW_TITLE() {
    return `${this.LIST_ROW}__title`
  },
  get LIST_ROW_CREATED_AT() {
    return `${this.LIST_ROW}__created-at`
  },
}

export default function renderPostRow(post, { onPostClick }) {
  return createElement(
    'div',
    {
      className: CLASSNAME.LIST_ROW,
      onclick() {
        onPostClick(post.id)
      },
    },
    [
      createElement('div', { className: CLASSNAME.LIST_ROW_ID }, [post.id]),
      createElement('div', { className: CLASSNAME.LIST_ROW_TITLE }, [post.title]),
      createElement('div', { className: CLASSNAME.LIST_ROW_CREATED_AT }, [dayjs(post.createdAt).format('YY.M.D')]),
    ]
  )
}
