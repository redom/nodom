export function ClassList (el) {
  this.reset(el.className);
}

ClassList.prototype = [];

ClassList.prototype.reset = function (className) {
  const classNames = (className || '').split(' ');

  this.length = classNames.length;

  for (let i = 0; i < classNames.length; i++) {
    this[i] = classNames[i];
  }
};

ClassList.prototype.add = function (className) {
  if (!this.contains(className)) {
    this.push(className);
  }
};

ClassList.prototype.contains = function (className) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === className) {
      return true;
    }
  }
  return false;
};

ClassList.prototype.item = function (index) {
  return this[index] || null;
};

ClassList.prototype.remove = function (className) {
  const classNames = this.classNames;

  for (let i = 0; i < this.length; i++) {
    if (classNames[i] === className) {
      this.splice(i, 1);
    }
  }
};

ClassList.prototype.toggle = function (className) {
  const idx = this.indexOf(className);

  if (idx >= 0) {
    this.splice(idx, 1);
    return false;
  } else {
    this.push(className);
    return true;
  }
};

ClassList.prototype.toString = function () {
  return this.join(' ').trim();
};
