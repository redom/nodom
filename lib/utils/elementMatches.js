export function elementMatches (el, selector) {
  if (el == null) {
    return false;
  }

  if (selector.tagName && el.tagName !== selector.tagName) {
    return false;
  }

  if (selector.id && el.id !== selector.id) {
    return false;
  }

  if (selector.classNames && !selector.classNames.every(cn => el.classList.contains(cn))) {
    return false;
  }

  return true;
}
