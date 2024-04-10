function injectAttrs(target, key, value) {
  if (typeof value !== 'object') {
    target[key] = value
    return
  }

  Object.keys(value).forEach(subKey => {
    injectAttrs(target[key], subKey, value[subKey])
  })
}

export default function createElement(tagName, attrs, children) {
  const el = document.createElement(tagName)

  Object.entries(attrs ?? {}).forEach(([key, val]) => {
    injectAttrs(el, key, val)
  })

  children?.length && el.append(...children)

  return el
}
