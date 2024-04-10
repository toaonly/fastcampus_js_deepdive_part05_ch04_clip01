import createElement from './createElement'

export default function createModal({ attrs, width, children, buttons }) {
  const modalWrapper = createElement(
    'div',
    {
      className: 'modal-container',
      ...attrs,
    },
    [
      createElement(
        'div',
        {
          className: 'modal-container__layer',
        },
        [
          createElement(
            'div',
            {
              className: 'modal-container__layer__main',
            },
            [
              createElement(
                'div',
                {
                  className: `flex flex-col gap-4 h-fit`,
                  style: {
                    width: `${width}px`,
                  },
                },
                [
                  ...children,
                  createElement(
                    'div',
                    {
                      className: 'modal-container__layer__main__button-wrapper',
                    },
                    [
                      ...buttons,
                      createElement(
                        'button',
                        {
                          className: 'btn-close',
                          onclick() {
                            close()
                          },
                        },
                        ['닫기']
                      ),
                    ]
                  ),
                ]
              ),
            ]
          ),
        ]
      ),
    ]
  )

  document.body.append(modalWrapper)

  const close = () => {
    modalWrapper.remove()
  }

  return {
    close,
  }
}
