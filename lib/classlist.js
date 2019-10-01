export class ClassList extends Array {
  constructor (el) {
    super();
    this.reset(el.className);
  }

  reset (className) {
    const classNames = (className || '').split(' ');

    this.length = classNames.length;

    for (let i = 0; i < classNames.length; i++) {
      this[i] = classNames[i];
    }
  }

  add (className) {
    if (!this.contains(className)) {
      this.push(className);
    }
  }

  contains (className) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === className) {
        return true;
      }
    }
    return false;
  }

  item (index) {
    return this[index] || null;
  }

  remove (className) {
    const classNames = this.classNames;

    for (let i = 0; i < this.length; i++) {
      if (classNames[i] === className) {
        this.splice(i, 1);
      }
    }
  }

  toggle (className) {
    const idx = this.indexOf(className);

    if (idx >= 0) {
      this.splice(idx, 1);
      return false;
    } else {
      this.push(className);
      return true;
    }
  }

  toString () {
    return this.join(' ').trim();
  }
}

ClassList.prototype.constructor = Array;
