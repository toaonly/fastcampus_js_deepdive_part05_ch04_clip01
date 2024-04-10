import api from './api'
import createElement from './createElement'
import createModal from './modal'

const CLASSNAME = {
  DETAIL: `post-detail`,
  get TITLE() {
    return `${this.DETAIL}__title`
  },
  get TITLE_LABEL() {
    return `${this.TITLE}__label`
  },
  get TITLE_VALUE() {
    return `${this.TITLE}__value`
  },
  get CONTENT() {
    return `${this.DETAIL}__content`
  },
  get CONTENT_LABEL() {
    return `${this.CONTENT}__label`
  },
  get CONTENT_VALUE() {
    return `${this.CONTENT}__value`
  },
}

export default async function renderPostModal({ postId, submitButton }) {
  const post = postId ? await api.getPost(postId) : { title: '', content: '' }
  const postDetailForm = {
    title: post.title,
    content: post.content,
    changeValue(keyVal) {
      Object.entries(keyVal).forEach(([key, val]) => {
        this[key] = val
      })
    },
    toJSON() {
      const { title, content } = this

      return { title, content }
    },
  }

  const modal = createModal({
    attrs: {},
    width: 600,
    children: [
      createElement(
        'div',
        {
          className: CLASSNAME.DETAIL,
        },
        [
          createElement(
            'div',
            {
              className: CLASSNAME.TITLE,
            },
            [
              createElement(
                'div',
                {
                  className: CLASSNAME.TITLE_LABEL,
                },
                ['제목']
              ),
              createElement('input', {
                className: CLASSNAME.TITLE_VALUE,
                value: postDetailForm.title,
                oninput(e) {
                  postDetailForm.changeValue({ title: e.target.value })
                },
              }),
            ]
          ),

          createElement(
            'div',
            {
              className: CLASSNAME.CONTENT,
            },
            [
              createElement(
                'div',
                {
                  className: CLASSNAME.CONTENT_LABEL,
                },
                ['내용']
              ),
              createElement('textarea', {
                className: CLASSNAME.CONTENT_VALUE,
                value: postDetailForm.content,
                rows: 8,
                oninput(e) {
                  postDetailForm.changeValue({ content: e.target.value })
                },
              }),
            ]
          ),
        ]
      ),
    ],
    buttons: [
      createElement(
        'button',
        {
          ...submitButton.attrs,
          async onclick() {
            const postData = {
              id: postId,
              ...postDetailForm.toJSON(),
            }

            await submitButton.onclick(postData)
            modal.close()
          },
        },
        [submitButton.text]
      ),
    ],
  })
}
