const combinators = ' >+~';
const ws = new RegExp('\\s*([' + combinators + '])\\s*', 'g');
const terms = new RegExp('(^|[' + combinators + '])([^' + combinators + ']+)', 'ig');

const id = new RegExp('#[^.' + combinators + ']+', 'g');
const tagName = new RegExp('^(?:[' + combinators + '])?([^#.' + combinators + '\\[\\]]+)');
const classNames = new RegExp('\\.[^.' + combinators + ']+', 'g');

const fst = a => a != null ? a[0] : null;
const snd = a => Array.isArray(a) && a.length > 1 ? a[1] : null;
const map = fn => as => Array.isArray(as) ? as.map(fn) : null;

const trimFirst = s => s.substr(1);
const trimId = id => id != null ? trimFirst(id) : null;
const trimClassNames = map(trimFirst);

export function parseSelector (selector) {
  if (selector == null || selector.length === 0) {
    return null;
  }

  return selector
    .replace(ws, '$1')
    .match(terms)
    .map((term, i) => ({
      tagName: (snd(term.match(tagName)) || '').toLowerCase(),
      id: trimId(fst(term.match(id))),
      classNames: trimClassNames(term.match(classNames)),
      relation: i > 0 ? term[0] : null
    }))
    .reverse();
}
