// See https://eslint.org/docs/rules/no-prototype-builtins.
export function hasOwnProperty (obj, propName) {
  return Object.prototype.hasOwnProperty.call(obj, propName);
}
