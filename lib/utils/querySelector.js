import { parseSelector } from './parseSelector';
import { elementMatches } from './elementMatches';

function isMatching (el, terms) {
  let curr = el;

  for (let i = 1; i < terms.length; i++) {
    switch (terms[i - 1].relation) {
      case ' ':
        // descendant, walk up the tree until a matching node is found
        do {
          curr = curr.parentNode;
        } while (curr != null && !elementMatches(curr, terms[i]));
        break;
      case '>':
        // immediate child
        if (!elementMatches(curr.parentNode, terms[i])) {
          return false;
        }
        break;
      case '+':
        // adjacent sibling selector
        if (!elementMatches(curr.parentNode.childNodes.find(c => c.nextSibling === curr), terms[i])) {
          return false;
        }
        break;
      case '~':
        // general sibling selector
        if (!curr.parentNode.childNodes.slice(0, curr.parentNode.childNodes.indexOf(curr)).some(el => elementMatches(el, terms[i]))) {
          return false;
        }
        break;
    }
  }

  return curr != null;
}

export function querySelectorAll (query, root, takeN) {
  const terms = parseSelector(query);

  if (terms == null) {
    return [];
  }

  const init = root.getElementsByTagName(terms[0].tagName || '*');
  const ret = [];

  for (let i = 0; i < init.length; i++) {
    if (elementMatches(init[i], terms[0]) && isMatching(init[i], terms)) {
      ret.push(init[i]);

      if (takeN != null && ret.length >= takeN) {
        break;
      }
    }
  }

  return ret;
}

export function querySelector (query, root) {
  return querySelectorAll(query, root, 1)[0] || null;
}
