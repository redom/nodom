export function Node () {}

Node.prototype.cloneNode = function (deep) {
  const Class = Object.getPrototypeOf(this);

  return new Class.constructor(this);
};
