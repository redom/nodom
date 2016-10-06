import { parseSelector } from './parseSelector'
import { elementMatches } from './elementMatches'

export function querySelector(query, root) {
  const terms = parseSelector(query)

  if (terms == null) {
    return null
  }

  let init = root.getElementsByTagName(terms[0].tagName || '*')
  let curr

  for (let i = 0; i < init.length; i++) {
    if (elementMatches(init[i], terms[0])) {
      curr = init[i]
      break
    }
  }

  if (!curr) {
    return null
  }

  for (let i = 1; i < terms.length; i++) {
    switch (terms[i - 1].relation) {
      case ' ':
        // descendant, walk up the tree until a matching node is found
        do {
          curr = curr.parentNode
        } while (curr != null && !elementMatches(curr, terms[i]))
        break
      case '>':
        // immediate child
        if (!elementMatches(curr.parentNode, terms[i])) {
          return null
        }
        break
      case '+':
        // sibling selector
        do {
          curr = curr.nextSibling
        } while (curr != null && !elementMatches(curr, terms[i]))
        break
    }
  }

  return curr
}
