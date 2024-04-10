import createElement from './createElement'

export default function renderPage({ pages, current, onClickPage }) {
  return createElement(
    'div',
    { className: 'page-container' },
    Array.from({ length: pages }, (_, i) => {
      const isCurrent = i + 1 === current

      return createElement(
        'button',
        {
          className: `page-container__page ${isCurrent ? 'active' : ''}`,
          onclick() {
            onClickPage(i + 1)
          },
        },
        [`${i + 1}`]
      )
    })
  )
}
