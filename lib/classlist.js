export function ClassList (el) {
  const classNames = (this.className && this.className.split(' ')) || []

  this.length = classNames.length

  for (let i = 0; i < classNames.length; i++) {
    this[i] = classNames[i]
  }

  this._updateClassName = function () {
    el.className = this.join(' ')
  }
}

ClassList.prototype = []

ClassList.prototype.add = function (className) {
  if (!this.contains(className)) {
    this.push(className)
    this._updateClassName()
  }
}

ClassList.prototype.contains = function (className) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === className) {
      return true
    }
  }
  return false
}

ClassList.prototype.remove = function (className) {
  const classNames = this.classNames

  for (let i = 0; i < this.length; i++) {
    if (classNames[i] === className) {
      this.splice(i, 1)
      this._updateClassName()
    }
  }
}
