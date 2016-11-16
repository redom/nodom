export function render (view, inner) {
  const el = view.el || view;

  return el.render(inner);
}
